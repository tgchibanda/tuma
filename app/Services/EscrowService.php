<?php

namespace App\Services;

use App\Exceptions\TumaException;
use App\Models\CashDelivery;
use App\Models\PlatformDeposit;
use App\Models\SwapMatch;
use App\Models\SwapOrder;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EscrowService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected AuditService $auditService
    ) {}

    // =========================================================================
    // SHARED HELPERS
    // =========================================================================

    /**
     * Generate the unique deposit reference for a match.
     * Format: TM- + first 8 chars of match ULID uppercase
     * Example: TM-A1B2C3D4
     */
    public function generateDepositReference(SwapMatch $match): string
    {
        return 'TM-' . strtoupper(substr($match->ulid, 0, 8));
    }

    /**
     * Verify a PIN token that was issued by PinController::verify().
     * Financial confirmation actions optionally require this.
     */
    public function verifyPinToken(User $user, ?string $pinToken): bool
    {
        if (! $pinToken) return false;
        $cacheKey = 'pin_verified_' . $user->id . '_' . $pinToken;
        return \Illuminate\Support\Facades\Cache::has($cacheKey);
    }

    /**
     * Store an uploaded proof file securely (outside public dir).
     * Returns the stored path.
     */
    public function storeProofFile($file, string $folder): string
    {
        $uuid      = \Illuminate\Support\Str::uuid();
        $extension = $file->getClientOriginalExtension();
        $filename  = $uuid . '.' . strtolower($extension);
        $path      = $file->storeAs($folder, $filename, 'local');
        return $path;
    }

    // =========================================================================
    // SECURE DELIVERY FLOW
    // =========================================================================

    /**
     * SECURE STEP 1: User uploads deposit proof + their bank reference.
     * Called after match status = awaiting_deposit.
     */
    public function secureFlow_depositUploaded(
        SwapMatch $match,
        string $proofPath,
        string $depositorReference
    ): void {
        if ($match->status !== SwapMatch::STATUS_AWAITING_DEPOSIT) {
            throw new TumaException(
                "Cannot upload deposit proof when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $proofPath, $depositorReference) {
            $match->deposit()->update([
                'proof_file'          => $proofPath,
                'depositor_reference' => $depositorReference,
                'proof_uploaded_at'   => now(),
                'status'              => PlatformDeposit::STATUS_PENDING,
            ]);

            $match->update([
                'status'              => SwapMatch::STATUS_DEPOSIT_UPLOADED,
                'deposit_uploaded_at' => now(),
            ]);
        });

        // Notify admin to verify
        $this->notifyAdmins(
            new \App\Notifications\DepositProofUploadedAdminNotification($match),
            ['inapp']
        );

        $this->auditService->log('deposit.uploaded', $match->sendOrder->user, $match);
    }

    /**
     * SECURE STEP 2 (Admin): Verify the AUD deposit has arrived in TuMa's account.
     * Advances status and notifies the cash deliverer to proceed.
     */
    public function secureFlow_verifyDeposit(SwapMatch $match, User $admin): void
    {
        if ($match->status !== SwapMatch::STATUS_DEPOSIT_UPLOADED) {
            throw new TumaException(
                "Cannot verify deposit when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $admin) {
            $match->deposit()->update([
                'status'      => PlatformDeposit::STATUS_VERIFIED,
                'verified_by' => $admin->id,
                'verified_at' => now(),
            ]);

            $match->update([
                'status'             => SwapMatch::STATUS_DEPOSIT_VERIFIED,
                'deposit_verified_at'=> now(),
                'verified_by'        => $admin->id,
            ]);

            // Create cash delivery record
            CashDelivery::create([
                'swap_match_id'       => $match->id,
                'deliverer_user_id'   => $match->receiveOrder->user_id,
                'amount_usd'          => $match->agreed_usd,
                'recipient_name'      => $match->sendOrder->zim_recipient_name,
                'recipient_phone'     => $match->sendOrder->zim_recipient_phone,
                'delivery_location_id'=> $match->sendOrder->zim_delivery_location_id,
                'delivery_address'    => $match->sendOrder->zim_delivery_address,
                'status'              => CashDelivery::STATUS_PENDING,
            ]);

            $match->update(['status' => SwapMatch::STATUS_AWAITING_DELIVERY]);
        });

        // Notify deliverer to proceed
        $deliverer = $match->receiveOrder->user;
        $this->notificationService->notify(
            $deliverer,
            new \App\Notifications\DeliveryInstructionsNotification($match),
            ['email', 'inapp']
        );

        $this->auditService->log('deposit.verified', $admin, $match);
    }

    /**
     * SECURE STEP 3: Deliverer uploads proof of cash handover.
     * Requires at least one complete verification set:
     * Option A: recipient_id_photo + handover_amount_photo
     * Option B: combined_verification_photo
     */
    public function secureFlow_deliveryUploaded(
        SwapMatch $match,
        array $proofData
    ): void {
        if ($match->status !== SwapMatch::STATUS_AWAITING_DELIVERY) {
            throw new TumaException(
                "Cannot upload delivery proof when match status is '{$match->status}'.",
                422
            );
        }

        $delivery = $match->delivery;
        if (! $delivery) {
            throw new TumaException('No delivery record found for this match.', 404);
        }

        DB::transaction(function () use ($match, $delivery, $proofData) {
            $delivery->update(array_merge($proofData, [
                'proof_uploaded_at'  => now(),
                'status'             => CashDelivery::STATUS_UPLOADED,
                'actual_delivery_at' => now(),
            ]));

            $match->update([
                'status'              => SwapMatch::STATUS_DELIVERY_UPLOADED,
                'delivery_uploaded_at'=> now(),
            ]);
        });

        // Notify sender to confirm receipt
        $sender = $match->sendOrder->user;
        $this->notificationService->notify(
            $sender,
            new \App\Notifications\ConfirmReceiptNotification($match),
            ['email', 'inapp']
        );

        $this->auditService->log('delivery.uploaded', $match->receiveOrder->user, $match);

        // Advance to awaiting_confirmation
        $match->update(['status' => SwapMatch::STATUS_AWAITING_CONFIRMATION]);
    }

    // =========================================================================
    // RISK DELIVERY FLOW
    // =========================================================================

    /**
     * RISK STEP 1: Deliverer uploads proof of cash handover (delivers FIRST).
     */
    public function riskFlow_deliveryUploaded(SwapMatch $match, array $proofData): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_DELIVERY) {
            throw new TumaException(
                "Cannot upload risk delivery proof when match status is '{$match->status}'.",
                422
            );
        }

        // Create the delivery record if it does not exist yet
        $delivery = $match->delivery ?? CashDelivery::create([
            'swap_match_id'       => $match->id,
            'deliverer_user_id'   => $match->receiveOrder->user_id,
            'amount_usd'          => $match->agreed_usd,
            'recipient_name'      => $match->sendOrder->zim_recipient_name,
            'recipient_phone'     => $match->sendOrder->zim_recipient_phone,
            'delivery_location_id'=> $match->sendOrder->zim_delivery_location_id,
            'delivery_address'    => $match->sendOrder->zim_delivery_address,
            'status'              => CashDelivery::STATUS_PENDING,
        ]);

        DB::transaction(function () use ($match, $delivery, $proofData) {
            $delivery->update(array_merge($proofData, [
                'proof_uploaded_at'  => now(),
                'status'             => CashDelivery::STATUS_UPLOADED,
                'actual_delivery_at' => now(),
            ]));

            $match->update([
                'status'               => SwapMatch::STATUS_RISK_DELIVERY_UPLOADED,
                'delivery_uploaded_at' => now(),
            ]);
        });

        // Notify sender to confirm receipt
        $sender = $match->sendOrder->user;
        $this->notificationService->notify(
            $sender,
            new \App\Notifications\ConfirmReceiptNotification($match),
            ['email', 'inapp']
        );

        $this->auditService->log('risk_delivery.uploaded', $match->receiveOrder->user, $match);

        $match->update(['status' => SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION]);
    }

    /**
     * RISK STEP 2: Sender confirms cash was received in Zimbabwe.
     * Now the sender must deposit AUD.
     */
    public function riskFlow_confirmDelivery(SwapMatch $match, User $confirmedBy): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION) {
            throw new TumaException(
                "Cannot confirm risk delivery when match status is '{$match->status}'.",
                422
            );
        }

        $reference = $this->generateDepositReference($match);

        DB::transaction(function () use ($match, $confirmedBy, $reference) {
            $match->delivery?->update([
                'status'       => CashDelivery::STATUS_CONFIRMED,
                'confirmed_by' => $confirmedBy->id,
                'confirmed_at' => now(),
            ]);

            // Create the deposit record now — sender must pay AFTER delivery
            PlatformDeposit::create([
                'swap_match_id'      => $match->id,
                'depositor_user_id'  => $match->sendOrder->user_id,
                'amount_aud'         => $match->agreed_aud,
                'our_bank_reference' => $reference,
                'status'             => PlatformDeposit::STATUS_PENDING,
            ]);

            $match->update([
                'status'       => SwapMatch::STATUS_RISK_CONFIRMED,
                'confirmed_at' => now(),
            ]);

            $match->update(['status' => SwapMatch::STATUS_AWAITING_RISK_DEPOSIT]);
        });

        // Notify sender to now deposit AUD — with urgency
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\RiskDepositNowNotification($match, $reference),
            ['email', 'inapp']
        );

        $this->auditService->log('risk_delivery.confirmed', $confirmedBy, $match, [], [
            'risk_flag' => 'sender_confirmed_must_deposit',
        ]);
    }

    /**
     * RISK STEP 3: Sender uploads deposit proof (after confirming delivery).
     */
    public function riskFlow_depositUploaded(
        SwapMatch $match,
        string $proofPath,
        string $depositorReference
    ): void {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_DEPOSIT) {
            throw new TumaException(
                "Cannot upload risk deposit proof when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $proofPath, $depositorReference) {
            $match->deposit()->update([
                'proof_file'          => $proofPath,
                'depositor_reference' => $depositorReference,
                'proof_uploaded_at'   => now(),
                'status'              => PlatformDeposit::STATUS_PENDING,
            ]);

            $match->update([
                'status'              => SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED,
                'deposit_uploaded_at' => now(),
            ]);
        });

        // Notify admin to verify
        $this->notifyAdmins(
            new \App\Notifications\DepositProofUploadedAdminNotification($match),
            ['inapp']
        );

        $this->auditService->log('risk_deposit.uploaded', $match->sendOrder->user, $match);
    }

    /**
     * RISK STEP 4 (Admin): Verify the risk deposit arrived.
     * Now release funds to the deliverer.
     */
    public function riskFlow_verifyDeposit(SwapMatch $match, User $admin): void
    {
        if ($match->status !== SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED) {
            throw new TumaException(
                "Cannot verify risk deposit when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $admin) {
            $match->deposit()->update([
                'status'      => PlatformDeposit::STATUS_VERIFIED,
                'verified_by' => $admin->id,
                'verified_at' => now(),
            ]);

            $match->update([
                'status'              => SwapMatch::STATUS_RISK_DEPOSIT_VERIFIED,
                'deposit_verified_at' => now(),
                'verified_by'         => $admin->id,
            ]);
        });

        $this->auditService->log('risk_deposit.verified', $admin, $match);
    }

    // =========================================================================
    // SHARED FINAL STEPS (used by both flows)
    // =========================================================================

    /**
     * Confirm cash delivery receipt (sender confirms — used in secure flow).
     */
    public function confirmDelivery(SwapMatch $match, User $confirmedBy): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_CONFIRMATION) {
            throw new TumaException(
                "Cannot confirm delivery when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $confirmedBy) {
            $match->delivery?->update([
                'status'       => CashDelivery::STATUS_CONFIRMED,
                'confirmed_by' => $confirmedBy->id,
                'confirmed_at' => now(),
                'delivery_duration_minutes' => $match->delivery->actual_delivery_at
                    ? $match->delivery->actual_delivery_at->diffInMinutes($match->delivery->created_at)
                    : null,
            ]);

            $match->update([
                'status'       => SwapMatch::STATUS_CONFIRMED,
                'confirmed_at' => now(),
            ]);
        });

        // Notify admin to release funds
        $this->notifyAdmins(
            new \App\Notifications\ReadyToReleaseAdminNotification($match),
            ['inapp']
        );

        $this->auditService->log('delivery.confirmed', $confirmedBy, $match);
    }

    /**
     * Admin manually releases AUD to the receiver's bank account.
     */
    public function releaseFunds(SwapMatch $match, User $admin): void
    {
        $allowedStatuses = [
            SwapMatch::STATUS_CONFIRMED,
            SwapMatch::STATUS_RISK_DEPOSIT_VERIFIED,
        ];

        if (! in_array($match->status, $allowedStatuses)) {
            throw new TumaException(
                "Cannot release funds when match status is '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $admin) {
            $match->update(['status' => SwapMatch::STATUS_RELEASING]);

            $match->deposit()->update([
                'status'      => PlatformDeposit::STATUS_RELEASED,
                'released_at' => now(),
            ]);

            $match->update([
                'status'       => SwapMatch::STATUS_COMPLETED,
                'completed_at' => now(),
                'released_by'  => $admin->id,
            ]);

            // Mark both orders as completed
            $match->sendOrder->update(['status' => SwapOrder::STATUS_COMPLETED]);
            $match->receiveOrder->update(['status' => SwapOrder::STATUS_COMPLETED]);

            // Increment trade counts on both users
            $match->sendOrder->user->increment('total_trades');
            $match->sendOrder->user->increment('successful_trades');
            $match->receiveOrder->user->increment('total_trades');
            $match->receiveOrder->user->increment('successful_trades');
        });

        // Notify both parties
        $receiver = $match->receiveOrder->user;
        $this->notificationService->notify(
            $receiver,
            new \App\Notifications\FundsReleasedNotification($match),
            ['email', 'inapp']
        );

        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\TransactionCompleteNotification($match),
            ['email', 'inapp']
        );

        // Notify both to rate each other
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\RateYourPartnerNotification($match),
                ['inapp']
            );
        }

        // Generate social proof feed entry
        app(\App\Services\SocialProofService::class)->createFeedEntry($match);

        // Evaluate and award badges for both users
        app(\App\Services\BadgeService::class)->evaluate($match->sendOrder->user);
        app(\App\Services\BadgeService::class)->evaluate($match->receiveOrder->user);

        // Process referral rewards if applicable
        app(\App\Services\ReferralService::class)->processCompletedTrade($match->sendOrder->user);
        app(\App\Services\ReferralService::class)->processCompletedTrade($match->receiveOrder->user);

        $this->auditService->log('funds.released', $admin, $match);
    }

    /**
     * Admin refunds AUD back to the sender.
     */
    public function refundDeposit(SwapMatch $match, User $admin, string $reason): void
    {
        $deposit = $match->deposit;

        if (! $deposit || $deposit->status === PlatformDeposit::STATUS_REFUNDED) {
            throw new TumaException('No deposit available to refund.', 422);
        }

        if (! in_array($deposit->status, [
            PlatformDeposit::STATUS_VERIFIED,
            PlatformDeposit::STATUS_PENDING,
        ])) {
            throw new TumaException(
                "Cannot refund a deposit with status '{$deposit->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $admin, $reason, $deposit) {
            $deposit->update([
                'status'      => PlatformDeposit::STATUS_REFUNDED,
                'refunded_at' => now(),
                'admin_notes' => $reason,
            ]);

            $match->update([
                'status'      => SwapMatch::STATUS_REFUNDED,
                'refunded_at' => now(),
                'admin_notes' => $reason,
                'released_by' => $admin->id,
            ]);

            // Return both orders to open
            $match->sendOrder->update(['status' => SwapOrder::STATUS_OPEN]);
            $match->receiveOrder->update(['status' => SwapOrder::STATUS_OPEN]);
        });

        // Notify sender of refund
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\DepositRefundedNotification($match, $reason),
            ['email', 'inapp']
        );

        $this->auditService->log('deposit.refunded', $admin, $match, [], ['reason' => $reason]);
    }

    /**
     * Auto-raise a dispute when confirmation window expires.
     * Called by the FlagOverdueConfirmations job.
     */
    public function autoRaiseDispute(SwapMatch $match): void
    {
        if (\App\Models\Dispute::where('swap_match_id', $match->id)->exists()) {
            return; // Already has a dispute
        }

        $dispute = \App\Models\Dispute::create([
            'swap_match_id' => $match->id,
            'raised_by'     => $match->sendOrder->user_id,
            'reason'        => 'Delivery confirmation window expired without confirmation from the recipient. Auto-raised by system.',
            'status'        => \App\Models\Dispute::STATUS_OPEN,
        ]);

        $match->update(['status' => SwapMatch::STATUS_DISPUTED]);

        // Notify both parties + admins
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\DisputeAutoRaisedNotification($match, $dispute),
                ['email', 'inapp']
            );
        }
        $this->notifyAdmins(
            new \App\Notifications\DisputeAutoRaisedNotification($match, $dispute),
            ['inapp']
        );

        $this->auditService->log('dispute.auto_raised', null, $match);
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    private function notifyAdmins(\Illuminate\Notifications\Notification $notification, array $channels): void
    {
        \App\Models\User::where('role', 'admin')
            ->where('account_status', 'active')
            ->get()
            ->each(function ($admin) use ($notification, $channels) {
                $this->notificationService->notify($admin, $notification, $channels);
            });
    }
}
