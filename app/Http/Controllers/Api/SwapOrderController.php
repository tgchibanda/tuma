<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\TumaException;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\DeliveryLocation;
use App\Models\ExchangeRate;
use App\Models\FeeDiscount;
use App\Models\OrderBoost;
use App\Models\SavedRecipient;
use App\Models\SwapOrder;
use App\Models\SystemSetting;
use App\Models\TrustedContact;
use App\Services\AuditService;
use App\Services\FeeCalculationService;
use App\Services\KycService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Uid\Ulid;

class SwapOrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FeeCalculationService $feeService,
        protected KycService $kycService,
        protected AuditService $auditService
    ) {}

    /**
     * List the authenticated user's own orders.
     * GET /api/v1/orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = SwapOrder::where('user_id', $request->user()->id)
            ->with(['deliveryLocation', 'bankAccount'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $statusValues = explode(',', $request->status);
            if (count($statusValues) > 1) {
                $query->whereIn('status', $statusValues);
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->filled('exclude_status')) {
            $excluded = explode(',', $request->exclude_status);
            $query->whereNotIn('status', $excluded);
        }

        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        $orders = $query->paginate(15);

        return $this->paginated($orders, 'Orders retrieved.', $orders->getCollection()->map(
            fn($o) => $this->formatOrder($o)
        ));
    }

    /**
     * Create a new swap order.
     * POST /api/v1/orders
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'order_type'               => ['required', 'in:send_to_zim,receive_from_zim'],
            'amount_aud'               => ['required', 'numeric', 'min:1'],
            'zim_delivery_location_id' => ['required', 'integer', 'exists:delivery_locations,id'],
            'zim_recipient_name'       => ['required', 'string', 'max:150'],
            'zim_recipient_phone'      => ['required', 'string', 'max:30'],
            'aud_bank_account_id'      => ['required', 'integer'],
            'zim_delivery_address'     => ['nullable', 'string', 'max:500'],
            'zim_delivery_notes'       => ['nullable', 'string', 'max:300'],
            'save_recipient'           => ['nullable', 'boolean'],
            'recipient_nickname'       => ['nullable', 'string', 'max:100'],
            'saved_recipient_id'       => ['nullable', 'integer'],
        ]);

        $user      = $request->user();
        $amountAud = (float) $request->amount_aud;

        // Assert user can trade — only bans/suspensions and maintenance block this
        $this->kycService->assertCanTrade($user);

        // Validate amount limits from system settings
        $minAud = (float) SystemSetting::get('min_order_amount_aud', 50);
        $maxAud = (float) SystemSetting::get('max_order_amount_aud', 5000);

        if ($amountAud < $minAud) {
            return $this->error("Minimum order amount is AUD {$minAud}.", 422);
        }
        if ($amountAud > $maxAud) {
            return $this->error("Maximum order amount is AUD {$maxAud}.", 422);
        }

        // Validate delivery location is active
        $location = DeliveryLocation::where('id', $request->zim_delivery_location_id)
            ->where('is_active', true)
            ->firstOrFail();

        // Validate bank account belongs to this user
        $bankAccount = $user->bankAccounts()->findOrFail($request->aud_bank_account_id);

        // Fraud detection: more than 3 orders in the last hour
        $recentCount = SwapOrder::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentCount >= (int) SystemSetting::get('max_orders_per_hour', 3)) {
            $this->auditService->flag(
                'fraud.too_many_orders',
                $user,
                null,
                'User created 3+ orders in 1 hour'
            );
            return $this->error('You are creating orders too quickly. Please wait before creating another order.', 429);
        }

        // Get current exchange rate
        $rate = ExchangeRate::currentRate('AUD', 'USD');
        if (! $rate) {
            return $this->error('Exchange rate is not currently available. Please try again shortly.', 503);
        }

        // Calculate fee — applies any available referral discount automatically
        $feeCalc = $this->feeService->calculateUsd($amountAud, $rate, $user);

        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);

        $order = DB::transaction(function () use ($request, $user, $feeCalc, $rate, $expiryHours) {
            $order = SwapOrder::create([
                'ulid'                     => (string) new Ulid(),
                'user_id'                  => $user->id,
                'order_type'               => $request->order_type,
                'amount_aud'               => $request->amount_aud,
                'amount_usd'               => $feeCalc['amount_usd'],
                'exchange_rate_id'         => $rate->id,
                'platform_fee_aud'         => $feeCalc['fee_aud'],
                'platform_fee_percent'     => $feeCalc['fee_percent'],
                'fee_discount_id'          => $feeCalc['discount_id'],
                'discounted_fee_aud'       => isset($feeCalc['discount_id']) ? $feeCalc['fee_aud'] : null,
                'zim_recipient_name'       => $request->zim_recipient_name,
                'zim_recipient_phone'      => $request->zim_recipient_phone,
                'zim_delivery_location_id' => $request->zim_delivery_location_id,
                'zim_delivery_address'     => $request->zim_delivery_address,
                'zim_delivery_notes'       => $request->zim_delivery_notes,
                'aud_recipient_name'       => $user->first_name . ' ' . $user->last_name,
                'aud_bank_account_id'      => $request->aud_bank_account_id,
                'status'                   => SwapOrder::STATUS_OPEN,
                'expires_at'               => now()->addHours($expiryHours),
            ]);

            // Decrement fee discount if one was applied
            if (! empty($feeCalc['discount_id'])) {
                FeeDiscount::where('id', $feeCalc['discount_id'])->decrement('uses_remaining');
            }

            // Save recipient if user requested it
            if ($request->boolean('save_recipient') && $request->filled('zim_recipient_name')) {
                SavedRecipient::firstOrCreate(
                    [
                        'user_id'         => $user->id,
                        'recipient_phone' => $request->zim_recipient_phone,
                    ],
                    [
                        'nickname'             => $request->recipient_nickname ?: $request->zim_recipient_name,
                        'recipient_name'       => $request->zim_recipient_name,
                        'delivery_location_id' => $request->zim_delivery_location_id,
                        'delivery_address'     => $request->zim_delivery_address,
                        'delivery_notes'       => $request->zim_delivery_notes,
                    ]
                );
            }

            // Increment use count on a pre-selected saved recipient
            if ($request->filled('saved_recipient_id')) {
                SavedRecipient::where('id', $request->saved_recipient_id)
                    ->where('user_id', $user->id)
                    ->increment('use_count');
            }

            return $order;
        });

        $this->auditService->log('order.created', $user, $order, [], ['amount_aud' => $order->amount_aud, 'order_type' => $order->order_type]);

        return $this->created([
            'order'       => $this->formatOrder($order->load('deliveryLocation')),
            'fee_details' => [
                'fee_aud'          => $feeCalc['fee_aud'],
                'fee_percent'      => $feeCalc['fee_percent'],
                'amount_usd'       => $feeCalc['amount_usd'],
                'exchange_rate'    => $feeCalc['exchange_rate'],
                'wu_estimated_fee' => $feeCalc['wu_estimated_fee'] ?? null,
                'savings_vs_wu'    => $feeCalc['savings_vs_wu'] ?? null,
                'discount_applied' => ! empty($feeCalc['discount_id']),
                'discount_percent' => $feeCalc['discount_percent'] ?? null,
            ],
        ], 'Order created successfully.');
    }

    /**
     * GET /api/v1/orders/{ulid}
     */
    public function show(Request $request, string $ulid): JsonResponse
    {
        $order = SwapOrder::where('ulid', $ulid)
            ->where('user_id', $request->user()->id)
            ->with(['deliveryLocation', 'bankAccount', 'sendMatch', 'receiveMatch'])
            ->firstOrFail();

        return $this->success($this->formatOrder($order, true), 'Order retrieved.');
    }

    /**
     * PUT /api/v1/orders/{ulid}/cancel
     */
    public function cancel(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $order = SwapOrder::where('ulid', $ulid)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cancellableStatuses = [
            SwapOrder::STATUS_OPEN,
            SwapOrder::STATUS_NEGOTIATING,
        ];

        if (! in_array($order->status, $cancellableStatuses)) {
            return $this->error(
                "This order cannot be cancelled while in '{$order->status}' status. Contact support if you need help.",
                422
            );
        }

        $order->update([
            'status'           => SwapOrder::STATUS_CANCELLED,
            'cancelled_reason' => $request->reason,
            'cancelled_by'     => $request->user()->id,
        ]);

        $this->auditService->log('order.cancelled', $request->user(), $order);

        return $this->success($this->formatOrder($order), 'Order cancelled.');
    }

    /**
     * PUT /api/v1/orders/{ulid}/extend
     */
    public function extend(Request $request, string $ulid): JsonResponse
    {
        $order = SwapOrder::where('ulid', $ulid)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->status !== SwapOrder::STATUS_OPEN) {
            return $this->error('Only open orders can be extended.', 422);
        }

        $expiryHours   = (int) SystemSetting::get('order_expiry_hours', 48);
        $order->expires_at = now()->addHours($expiryHours);
        $order->save();

        $this->auditService->log('order.extended', $request->user(), $order);

        return $this->success($this->formatOrder($order), "Order extended by {$expiryHours} hours.");
    }

    /**
     * POST /api/v1/orders/{ulid}/boost
     */
    public function boost(Request $request, string $ulid): JsonResponse
    {
        if (! (bool) SystemSetting::get('order_boost_enabled', true)) {
            return $this->error('Order boosting is currently disabled.', 422);
        }

        $order = SwapOrder::where('ulid', $ulid)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->status !== SwapOrder::STATUS_OPEN) {
            return $this->error('Only open orders can be boosted.', 422);
        }

        if ($order->is_boosted && $order->boost_expires_at?->isFuture()) {
            return $this->error('This order is already boosted until ' . $order->boost_expires_at->toFormattedDateString() . '.', 422);
        }

        $boostFee   = (float) SystemSetting::get('order_boost_fee_aud', 2.00);
        $boostHours = (int) SystemSetting::get('order_boost_duration_hours', 24);

        OrderBoost::create([
            'swap_order_id' => $order->id,
            'user_id'       => $request->user()->id,
            'boost_fee_aud' => $boostFee,
            'boosted_at'    => now(),
            'expires_at'    => now()->addHours($boostHours),
            'is_active'     => true,
        ]);

        $order->update([
            'is_boosted'       => true,
            'boost_expires_at' => now()->addHours($boostHours),
        ]);

        $this->auditService->log('order.boosted', $request->user(), $order);

        return $this->success($this->formatOrder($order), "Order boosted for {$boostHours} hours. Fee: AUD {$boostFee}");
    }

    /**
     * POST /api/v1/orders/{ulid}/repeat
     */
    public function repeat(Request $request, string $ulid): JsonResponse
    {
        $user = $request->user();
        $this->kycService->assertCanTrade($user);

        $original = SwapOrder::where('ulid', $ulid)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $rate = ExchangeRate::currentRate('AUD', 'USD');
        if (! $rate) {
            return $this->error('Exchange rate not available.', 503);
        }

        $feeCalc     = $this->feeService->calculateUsd((float) $original->amount_aud, $rate, $user);
        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);

        $newOrder = SwapOrder::create([
            'ulid'                     => (string) new Ulid(),
            'user_id'                  => $user->id,
            'order_type'               => $original->order_type,
            'amount_aud'               => $original->amount_aud,
            'amount_usd'               => $feeCalc['amount_usd'],
            'exchange_rate_id'         => $rate->id,
            'platform_fee_aud'         => $feeCalc['fee_aud'],
            'platform_fee_percent'     => $feeCalc['fee_percent'],
            'zim_recipient_name'       => $original->zim_recipient_name,
            'zim_recipient_phone'      => $original->zim_recipient_phone,
            'zim_delivery_location_id' => $original->zim_delivery_location_id,
            'zim_delivery_address'     => $original->zim_delivery_address,
            'zim_delivery_notes'       => $original->zim_delivery_notes,
            'aud_recipient_name'       => $original->aud_recipient_name,
            'aud_bank_account_id'      => $original->aud_bank_account_id,
            'status'                   => SwapOrder::STATUS_OPEN,
            'expires_at'               => now()->addHours($expiryHours),
        ]);

        $this->auditService->log('order.repeated', $user, $newOrder);

        return $this->created([
            'order'      => $this->formatOrder($newOrder->load('deliveryLocation')),
            'fee_details'=> $feeCalc,
        ], 'Order repeated successfully.');
    }

    /**
     * Browse open orders from other users.
     * GET /api/v1/orders/browse
     */
    public function browse(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = SwapOrder::where('status', SwapOrder::STATUS_OPEN)
            ->where('user_id', '!=', $user->id)
            ->where('expires_at', '>', now())
            ->with(['user', 'deliveryLocation'])
            ->orderByDesc('is_boosted')
            ->orderByDesc('created_at');

        // Multi-city filter: ?zim_location_ids=1,3,7 (comma-separated)
        if ($request->filled('zim_location_ids')) {
            $ids = array_filter(
                array_map('intval', explode(',', $request->zim_location_ids)),
                fn($id) => $id > 0
            );
            if (count($ids)) {
                $query->whereIn('zim_delivery_location_id', $ids);
            }
        } elseif ($request->filled('zim_location_id')) {
            // Legacy single-city support
            $query->where('zim_delivery_location_id', (int) $request->zim_location_id);
        }
        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }
        if ($request->filled('min_aud')) {
            $query->where('amount_aud', '>=', $request->min_aud);
        }
        if ($request->filled('max_aud')) {
            $query->where('amount_aud', '<=', $request->max_aud);
        }

        if ($request->sort === 'amount_asc') {
            $query->reorder()->orderByDesc('is_boosted')->orderBy('amount_aud');
        } elseif ($request->sort === 'amount_desc') {
            $query->reorder()->orderByDesc('is_boosted')->orderByDesc('amount_aud');
        }

        $orders = $query->paginate(15);

        // Get trusted contact IDs so we can highlight them in results
        $trustedIds = TrustedContact::where('user_id', $user->id)
            ->pluck('trusted_user_id')
            ->toArray();

        $formatted = $orders->getCollection()->map(function ($order) use ($trustedIds) {
            $f                        = $this->formatOrderForBrowse($order);
            $f['is_trusted_contact']  = in_array($order->user_id, $trustedIds);
            return $f;
        });

        return $this->paginated($orders, 'Orders retrieved.', $formatted);
    }

    // ── Private formatters ────────────────────────────────────────────────────

    private function formatOrder(SwapOrder $order, bool $detailed = false): array
    {
        $data = [
            'id'                       => $order->id,
            'ulid'                     => $order->ulid,
            'order_type'               => $order->order_type,
            'amount_aud'               => (float) $order->amount_aud,
            'amount_usd'               => (float) $order->amount_usd,
            'platform_fee_aud'         => (float) $order->platform_fee_aud,
            'platform_fee_percent'     => (float) $order->platform_fee_percent,
            'discounted_fee_aud'       => $order->discounted_fee_aud ? (float) $order->discounted_fee_aud : null,
            'zim_recipient_name'       => $order->zim_recipient_name,
            'zim_recipient_phone'      => $order->zim_recipient_phone,
            'zim_delivery_location_id' => $order->zim_delivery_location_id,
            'zim_delivery_address'     => $order->zim_delivery_address,
            'zim_delivery_notes'       => $order->zim_delivery_notes,
            'aud_recipient_name'       => $order->aud_recipient_name,
            'aud_bank_account_id'      => $order->aud_bank_account_id,
            'status'                   => $order->status,
            'is_boosted'               => (bool) $order->is_boosted,
            'boost_expires_at'         => $order->boost_expires_at?->toIso8601String(),
            'expires_at'               => $order->expires_at?->toIso8601String(),
            'expires_in_hours'         => $order->expires_at ? max(0, round(now()->diffInHours($order->expires_at, false))) : 0,
            'created_at'               => $order->created_at->toIso8601String(),
            'delivery_location'        => $order->relationLoaded('deliveryLocation') ? [
                'id'       => $order->deliveryLocation?->id,
                'name'     => $order->deliveryLocation?->name,
                'province' => $order->deliveryLocation?->province,
            ] : null,
        ];

        if ($detailed) {
            $data['bank_account'] = $order->relationLoaded('bankAccount') && $order->bankAccount ? [
                'id'             => $order->bankAccount->id,
                'bank_name'      => $order->bankAccount->bank_name,
                'account_name'   => $order->bankAccount->account_name,
                'account_number' => '····' . substr($order->bankAccount->account_number, -4),
                'bsb_code'       => $order->bankAccount->bsb_code,
                'is_primary'     => (bool) $order->bankAccount->is_primary,
            ] : null;
        }

        return $data;
    }

    private function formatOrderForBrowse(SwapOrder $order): array
    {
        $owner = $order->user;
        $isAnon = $owner?->profile_visibility === 'anonymous';
        $displayName = $isAnon
            ? ($owner->anonymous_name ?: $owner->display_first_name ?? 'Anonymous')
            : ($owner->first_name ?? 'Anonymous');

        return [
            'id'               => $order->id,
            'ulid'             => $order->ulid,
            'order_type'       => $order->order_type,
            'amount_aud'       => (float) $order->amount_aud,
            'amount_usd'       => (float) $order->amount_usd,
            'is_boosted'       => (bool) $order->is_boosted,
            'expires_at'       => $order->expires_at?->toIso8601String(),
            'created_at'       => $order->created_at->toIso8601String(),
            'created_human'    => $order->created_at->diffForHumans(),
            'delivery_location'=> [
                'id'       => $order->deliveryLocation?->id,
                'name'     => $order->deliveryLocation?->name,
                'province' => $order->deliveryLocation?->province,
            ],
            'owner'            => [
                'ulid'         => $owner?->ulid,
                'display_name' => $displayName,
                'rating'       => $owner?->rating ? (float) $owner->rating : null,
                'total_trades' => $owner?->total_trades ?? 0,
                'trust_score'  => $owner?->trust_score ?? 0,
                'last_seen'    => $owner?->last_seen_human ?? 'Unknown',
                'kyc_verified' => $owner?->kyc_status === 'approved',
            ],
        ];
    }
}
