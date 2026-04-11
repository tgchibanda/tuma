<?php

namespace App\Services;

use App\Models\CashDelivery;
use App\Models\Dispute;
use App\Models\PlatformDeposit;
use App\Models\SwapMatch;
use App\Models\User;
use App\Exceptions\TumaException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EscrowService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected AuditService $auditService,
        protected SocialProofService $socialProofService
    ) {}

    // ═══════════════════════════════════════════════════════════════════
    // SECURE FLOW — AUD deposited first, then cash delivered
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Called when match is agreed (rate + delivery method both confirmed).
     * Creates the deposit record and sets status to awaiting_deposit.
     */
    public function secureFlow_initiate(SwapMatch $match): void
    {
        DB::transaction(function () use ($match) {
            PlatformDeposit::create([
                'swap_match_id'      => $match->id,
                'depositor_user_id'  => $match->sendOrder->user_id,
                'amount_aud'         => $match->agreed_aud,
                'our_bank_reference' => $match->getDepositReference(),
                'status'             => 'pending',
            ]);

            $match->update(['status' => SwapMatch::STATUS_AWAITING_DEPOSIT]);
        });

        // Notify sender with deposit instructions
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\DepositInstructionsNotification($match),
            ['email', 'inapp']
        );
    }

    /**
     * Sender uploads deposit proof.
     */
    public function secureFlow_uploadProof(SwapMatch $match, User $uploader, UploadedFile $file, string $depositorRef): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_DEPOSIT) {
            throw new TumaException('Cannot upload deposit proof at this stage.', 422);
        }

        $path = $this->storeProofFile($file, 'deposits');

        DB::transaction(function () use ($match, $path, $depositorRef) {
            $match->deposit->update([
                'proof_file'          => $path,
                'depositor_reference' => $depositorRef,
                'proof_uploaded_at'   => now(),
                'status'              => 'pending',
            ]);

            $match->update(['status' => SwapMatch::STATUS_DEPOSIT_UPLOADED]);
        });

        // Notify admin
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $this->notificationService->notifyAlways(
                $admin,
                new \App\Notifications\DepositProofUploadedAdminNotification($match),
                ['inapp']
            );
        }
    }

    /**
     * Admin verifies the deposit has arrived.
     */
    public function secureFlow_verifyDeposit(SwapMatch $match, User $admin): void
    {
        if ($match->status !== SwapMatch::STATUS_DEPOSIT_UPLOADED) {
            throw new TumaException('Deposit is not in a verifiable state.', 422);
        }

        DB::transaction(function () use ($match, $admin) {
            $match->deposit->update([
                'status'       => 'verified',
                'verified_by'  => $admin->id,
                'verified_at'  => now(),
            ]);

            // Create delivery record
            $order = $match->sendOrder;
            CashDelivery::create([
                'swap_match_id'       => $match->id,
                'deliverer_user_id'   => $match->receiveOrder->user_id,
                'amount_usd'          => $match->agreed_usd,
                'recipient_name'      => $order->zim_recipient_name,
                'recipient_phone'     => $order->zim_recipient_phone,
                'delivery_location_id'=> $order->zim_delivery_location_id,
                'delivery_address'    => $order->zim_delivery_address,
                'status'              => 'pending',
            ]);

            $match->update([
                'status'              => SwapMatch::STATUS_AWAITING_DELIVERY,
                'deposit_verified_at' => now(),
                'verified_by'         => $admin->id,
            ]);
        });

        // Notify deliverer
        $this->notificationService->notify(
            $match->receiveOrder->user,
            new \App\Notifications\FundsSecuredNotification($match),
            ['email', 'inapp']
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    // RISK FLOW — Cash delivered first, then AUD deposited
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Called when risk delivery method agreed.
     */
    public function riskFlow_initiate(SwapMatch $match): void
    {
        // Create delivery record immediately (deliverer goes first)
        $order = $match->sendOrder;

        DB::transaction(function () use ($match, $order) {
            CashDelivery::create([
                'swap_match_id'       => $match->id,
                'deliverer_user_id'   => $match->receiveOrder->user_id,
                'amount_usd'          => $match->agreed_usd,
                'recipient_name'      => $order->zim_recipient_name,
                'recipient_phone'     => $order->zim_recipient_phone,
                'delivery_location_id'=> $order->zim_delivery_location_id,
                'delivery_address'    => $order->zim_delivery_address,
                'status'              => 'pending',
            ]);

            $match->update(['status' => SwapMatch::STATUS_AWAITING_RISK_DELIVERY]);
        });

        // Notify both parties
        $this->notificationService->notify(
            $match->receiveOrder->user,
            new \App\Notifications\RiskDeliveryGoFirstNotification($match),
            ['email', 'inapp']
        );
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\RiskDeliveryPartnerGoingFirstNotification($match),
            ['email', 'inapp']
        );
    }

    /**
     * Deliverer uploads delivery proof (risk flow).
     */
    public function riskFlow_uploadDeliveryProof(
        SwapMatch $match,
        User $deliverer,
        ?UploadedFile $idPhoto,
        ?string $idType,
        ?UploadedFile $handoverPhoto,
        ?UploadedFile $combinedPhoto,
        ?string $note
    ): void {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_DELIVERY) {
            throw new TumaException('Cannot upload delivery proof at this stage.', 422);
        }

        $this->uploadDeliveryProofCommon(
            $match, $deliverer, $idPhoto, $idType, $handoverPhoto, $combinedPhoto, $note,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION
        );
    }

    /**
     * Sender confirms cash was received (risk flow).
     */
    public function riskFlow_confirmReceipt(SwapMatch $match, User $sender): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION) {
            throw new TumaException('Cannot confirm at this stage.', 422);
        }

        DB::transaction(function () use ($match) {
            $match->delivery->update(['status' => 'confirmed', 'confirmed_at' => now()]);

            // Create deposit record now (cash delivered, now sender must pay)
            PlatformDeposit::create([
                'swap_match_id'      => $match->id,
                'depositor_user_id'  => $match->sendOrder->user_id,
                'amount_aud'         => $match->agreed_aud,
                'our_bank_reference' => $match->getDepositReference(),
                'status'             => 'pending',
            ]);

            $match->update(['status' => SwapMatch::STATUS_AWAITING_RISK_DEPOSIT]);
        });

        // Warn sender: they already confirmed delivery, must pay now
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\DepositInstructionsNotification($match, 'risk'),
            ['email', 'inapp']
        );

        // Flag for audit
        $this->auditService->flag(
            'risk.sender_confirmed_awaiting_deposit',
            $sender,
            $match,
            'Sender confirmed receipt in risk delivery — awaiting deposit'
        );
    }

    /**
     * Sender uploads deposit proof after risk delivery confirmation.
     */
    public function riskFlow_uploadDeposit(SwapMatch $match, User $uploader, UploadedFile $file, string $depositorRef): void
    {
        if ($match->status !== SwapMatch::STATUS_AWAITING_RISK_DEPOSIT) {
            throw new TumaException('Cannot upload deposit at this stage.', 422);
        }

        $path = $this->storeProofFile($file, 'deposits');

        DB::transaction(function () use ($match, $path, $depositorRef) {
            $match->deposit->update([
                'proof_file'          => $path,
                'depositor_reference' => $depositorRef,
                'proof_uploaded_at'   => now(),
                'status'              => 'pending',
            ]);

            $match->update(['status' => SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED]);
        });

        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $this->notificationService->notifyAlways(
                $admin,
                new \App\Notifications\DepositProofUploadedAdminNotification($match),
                ['inapp']
            );
        }
    }

    /**
     * Admin verifies risk deposit.
     */
    public function riskFlow_verifyDeposit(SwapMatch $match, User $admin): void
    {
        if ($match->status !== SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED) {
            throw new TumaException('Risk deposit is not in a verifiable state.', 422);
        }

        DB::transaction(function () use ($match, $admin) {
            $match->deposit->update([
                'status'      => 'verified',
                'verified_by' => $admin->id,
                'verified_at' => now(),
            ]);

            $match->update([
                'status'      => SwapMatch::STATUS_RISK_DEPOSIT_VERIFIED,
                'verified_by' => $admin->id,
            ]);
        });

        // Notify admin that funds are ready to release
        $this->notificationService->notifyAlways(
            $admin,
            new \App\Notifications\ReadyToReleaseAdminNotification($match),
            ['inapp']
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    // SHARED — Secure delivery proof upload (secure flow)
    // ═══════════════════════════════════════════════════════════════════

    public function uploadSecureDeliveryProof(
        SwapMatch $match,
        User $deliverer,
        ?UploadedFile $idPhoto,
        ?string $idType,
        ?UploadedFile $handoverPhoto,
        ?UploadedFile $combinedPhoto,
        ?string $note
    ): void {
        if ($match->status !== SwapMatch::STATUS_AWAITING_DELIVERY) {
            throw new TumaException('Cannot upload delivery proof at this stage.', 422);
        }

        $this->uploadDeliveryProofCommon(
            $match, $deliverer, $idPhoto, $idType, $handoverPhoto, $combinedPhoto, $note,
            SwapMatch::STATUS_AWAITING_CONFIRMATION
        );
    }

    /**
     * Sender confirms cash receipt (secure flow).
     */
    public function confirmDelivery(SwapMatch $match, User $sender): void
    {
        $allowedStatuses = [
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION,
        ];

        if (! in_array($match->status, $allowedStatuses)) {
            throw new TumaException('Cannot confirm delivery at this stage.', 422);
        }

        DB::transaction(function () use ($match, $sender) {
            $match->delivery->update([
                'status'       => 'confirmed',
                'confirmed_by' => $sender->id,
                'confirmed_at' => now(),
            ]);

            $match->update([
                'status'       => SwapMatch::STATUS_CONFIRMED,
                'confirmed_at' => now(),
            ]);
        });

        // Notify admin
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $this->notificationService->notifyAlways(
                $admin,
                new \App\Notifications\ReadyToReleaseAdminNotification($match),
                ['inapp']
            );
        }
    }

    /**
     * Admin releases AUD funds to the receiver/deliverer.
     */
    public function releaseFunds(SwapMatch $match, User $admin): void
    {
        $allowedStatuses = [
            SwapMatch::STATUS_CONFIRMED,
            SwapMatch::STATUS_RISK_DEPOSIT_VERIFIED,
        ];

        if (! in_array($match->status, $allowedStatuses)) {
            throw new TumaException("Cannot release funds when status is '{$match->status}'.", 422);
        }

        DB::transaction(function () use ($match, $admin) {
            $match->deposit->update([
                'status'      => 'released',
                'released_at' => now(),
            ]);

            $match->update([
                'status'       => SwapMatch::STATUS_COMPLETED,
                'completed_at' => now(),
                'released_by'  => $admin->id,
            ]);

            // Update user stats
            foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
                $party->increment('total_trades');
                $party->increment('successful_trades');
                $party->updateLastSeen();
            }

            // Update order statuses
            $match->sendOrder->update(['status' => 'completed']);
            $match->receiveOrder->update(['status' => 'completed']);
        });

        // Add to public feed
        $this->socialProofService->createFeedEntry($match);

        // Notify both parties
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\FundsReleasedNotification($match),
                ['email', 'inapp']
            );
        }

        // Award badges, update trust scores, process referrals
        app(\App\Services\BadgeService::class)->evaluate($match->sendOrder->user);
        app(\App\Services\BadgeService::class)->evaluate($match->receiveOrder->user);
        app(\App\Services\TrustScoreService::class)->update($match->sendOrder->user);
        app(\App\Services\TrustScoreService::class)->update($match->receiveOrder->user);
        app(\App\Services\ReferralService::class)->processCompletedTrade($match->sendOrder->user);
        app(\App\Services\ReferralService::class)->processCompletedTrade($match->receiveOrder->user);

        $this->auditService->log('match.funds_released', $admin, $match);
    }

    /**
     * Admin refunds AUD to the sender and returns both orders to open.
     */
    public function refundDeposit(SwapMatch $match, User $admin, string $reason): void
    {
        DB::transaction(function () use ($match, $admin, $reason) {
            if ($match->deposit) {
                $match->deposit->update([
                    'status'      => 'refunded',
                    'refunded_at' => now(),
                    'admin_notes' => $reason,
                ]);
            }

            $match->update([
                'status'       => SwapMatch::STATUS_REFUNDED,
                'admin_notes'  => $reason,
            ]);

            // Return orders to open
            $match->sendOrder->update(['status' => 'open']);
            $match->receiveOrder->update(['status' => 'open']);
        });

        // Notify both parties
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\MatchCancelledNotification($match, $admin),
                ['email', 'inapp']
            );
        }

        $this->auditService->log('match.refunded', $admin, $match, [], ['reason' => $reason]);
    }

    /**
     * Auto-raise a dispute when a timeout job detects an overdue confirmation.
     */
    public function autoRaiseDispute(SwapMatch $match): void
    {
        // Don't double-raise
        if ($match->status === 'disputed') return;
        if ($match->dispute()->exists()) return;

        DB::transaction(function () use ($match) {
            \App\Models\Dispute::create([
                'swap_match_id' => $match->id,
                'raised_by'     => $match->sendOrder->user_id,
                'reason'        => 'Auto-raised: delivery confirmation window expired without a response.',
                'status'        => 'open',
            ]);

            $match->update(['status' => 'disputed']);
        });

        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $this->notificationService->notifyAlways(
                $admin,
                new \App\Notifications\DisputeAutoRaisedNotification($match),
                ['inapp']
            );
        }
    }

    /**
     * Store a proof file securely (not publicly accessible).
     */
    public function storeProofFile(UploadedFile $file, string $folder): string
    {
        return $file->store($folder . '/' . date('Y/m'), 'local');
    }

    /**
     * Generate deposit reference from match ULID.
     * Format: TM-XXXXXXXX (first 8 chars of ULID, uppercase)
     */
    public static function generateDepositReference(string $ulid): string
    {
        return 'TM-' . strtoupper(substr($ulid, 0, 8));
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private function uploadDeliveryProofCommon(
        SwapMatch $match,
        User $deliverer,
        ?UploadedFile $idPhoto,
        ?string $idType,
        ?UploadedFile $handoverPhoto,
        ?UploadedFile $combinedPhoto,
        ?string $note,
        string $nextStatus
    ): void {
        // Validate: need either (idPhoto + handoverPhoto) OR combinedPhoto
        if (! $combinedPhoto && (! $idPhoto || ! $handoverPhoto)) {
            throw new TumaException('Please upload either both photos separately or one combined photo.', 422);
        }

        DB::transaction(function () use (
            $match, $idPhoto, $idType, $handoverPhoto, $combinedPhoto, $note, $nextStatus
        ) {
            $delivery = $match->delivery;

            $updates = [
                'verification_note'  => $note,
                'proof_uploaded_at'  => now(),
                'status'             => 'uploaded',
            ];

            if ($combinedPhoto) {
                $updates['combined_verification_photo'] = $this->storeProofFile($combinedPhoto, 'deliveries');
            } else {
                $updates['recipient_id_photo']    = $this->storeProofFile($idPhoto, 'deliveries');
                $updates['recipient_id_type']     = $idType;
                $updates['handover_amount_photo'] = $this->storeProofFile($handoverPhoto, 'deliveries');
            }

            $delivery->update($updates);
            $match->update([
                'status'               => $nextStatus,
                'delivery_uploaded_at' => now(),
            ]);
        });

        // Notify the sender
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\DeliveryProofUploadedNotification($match),
            ['email', 'inapp']
        );
    }
}
