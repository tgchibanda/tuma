<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\TumaException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateOrderRequest;
use App\Http\Traits\ApiResponse;
use App\Models\DeliveryLocation;
use App\Models\ExchangeRate;
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
     * Filters: status, order_type, page
     */
    public function index(Request $request): JsonResponse
    {
        $query = SwapOrder::where('user_id', $request->user()->id)
            ->with(['deliveryLocation', 'bankAccount'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
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
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $user = $request->user();

        // Assert user can trade (KYC + account status)
        $this->kycService->assertCanTrade($user);

        $minAud = (float) SystemSetting::get('min_order_amount_aud', 50);
        $amountAud = (float) $request->amount_aud;

        // Minimum amount check
        if ($amountAud < $minAud) {
            return $this->error("Minimum order amount is AUD \${$minAud}.", 422);
        }

        // KYC / amount validation — installed KycService::validateOrderAmount throws on failure
        try {
            $this->kycService->validateOrderAmount($user, $amountAud);
        } catch (\App\Exceptions\TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        // Validate delivery location belongs to an active country
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
            return $this->error('You are creating orders too quickly. Please wait before creating another.', 429);
        }

        // Calculate fee and suggested USD amount
        $rate = ExchangeRate::currentRate('AUD', 'USD');
        if (! $rate) {
            return $this->error('Exchange rate not available. Please try again shortly.', 503);
        }

        $feeCalc = $this->feeService->calculateUsd($amountAud, $rate, $user);

        // Fraud detection: high-value order flagging
        $maxAud = (float) SystemSetting::get('max_order_amount_aud', 5000);
        if ($amountAud >= ($maxAud * 0.9) && (bool) SystemSetting::get('auto_flag_tier_limit_orders', true)) {
            $this->auditService->flag(
                'fraud.high_value_order',
                $user,
                null,
                "High-value order: AUD {$amountAud}"
            );
        }

        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);

        $order = DB::transaction(function () use ($request, $user, $feeCalc, $rate, $expiryHours, $bankAccount) {
            $order = SwapOrder::create([
                'user_id'                  => $user->id,
                'order_type'               => $request->order_type,
                'amount_aud'               => $request->amount_aud,
                'amount_usd'               => $feeCalc['amount_usd'],
                'exchange_rate_id'         => $rate->id,
                'platform_fee_aud'         => $feeCalc['fee_aud'],
                'platform_fee_percent'     => $feeCalc['fee_percent'],
                'fee_discount_id'          => $feeCalc['discount_id'],
                'discounted_fee_aud'       => $feeCalc['discount_id'] ? $feeCalc['fee_aud'] : null,
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

            // Save recipient if requested
            if ($request->boolean('save_recipient')) {
                SavedRecipient::create([
                    'user_id'              => $user->id,
                    'nickname'             => $request->recipient_nickname,
                    'recipient_name'       => $request->zim_recipient_name,
                    'recipient_phone'      => $request->zim_recipient_phone,
                    'delivery_location_id' => $request->zim_delivery_location_id,
                    'delivery_address'     => $request->zim_delivery_address,
                    'delivery_notes'       => $request->zim_delivery_notes,
                ]);
            }

            // Update saved recipient use count if one was pre-selected
            if ($request->saved_recipient_id) {
                $recipient = SavedRecipient::where('id', $request->saved_recipient_id)
                    ->where('user_id', $user->id)
                    ->first();
                if ($recipient) { $recipient->increment('use_count'); $recipient->update(['last_used_at' => now()]); }
            }

            return $order;
        });

        $this->auditService->log('order.created', $user, $order, [], $order->toArray());

        return $this->created([
            'order'      => $this->formatOrder($order->load('deliveryLocation')),
            'fee_details'=> $feeCalc,
        ], 'Order created successfully.');
    }

    /**
     * Get a single order by ULID.
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
     * Cancel an open order.
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

        if (! $order->isCancellable()) {
            return $this->error(
                'This order cannot be cancelled in its current status (' . $order->status . ').',
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
     * Extend an expiring order by 48 hours.
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

        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);
        $order->expires_at = now()->addHours($expiryHours);
        $order->save();

        $this->auditService->log('order.extended', $request->user(), $order);

        return $this->success($this->formatOrder($order), 'Order extended by ' . $expiryHours . ' hours.');
    }

    /**
     * Boost an order to appear at the top of browse results.
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
            return $this->error('This order is already boosted.', 422);
        }

        $boostFee   = (float) SystemSetting::get('order_boost_fee_aud', 2.00);
        $boostHours = (int) SystemSetting::get('order_boost_duration_hours', 24);

        // Record the boost
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

        return $this->success($this->formatOrder($order), "Order boosted for {$boostHours} hours. Fee: AUD \${$boostFee}");
    }

    /**
     * Clone a completed order (Repeat Order).
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
     *
     * Shows the OPPOSITE order type to what the auth user would create.
     * Primary filter: zim_location_id — only show orders for locations the user can service.
     * Boosted orders appear first. Trusted contacts highlighted.
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

        // Primary filter: Zimbabwe delivery location
        if ($request->filled('zim_location_id')) {
            $query->where('zim_delivery_location_id', $request->zim_location_id);
        }

        // Order type filter — show OPPOSITE to what the browsing user would need
        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        // Amount range filters
        if ($request->filled('min_aud')) {
            $query->where('amount_aud', '>=', $request->min_aud);
        }
        if ($request->filled('max_aud')) {
            $query->where('amount_aud', '<=', $request->max_aud);
        }

        // Sort override
        if ($request->sort === 'amount_asc') {
            $query->reorder()->orderByDesc('is_boosted')->orderBy('amount_aud');
        } elseif ($request->sort === 'amount_desc') {
            $query->reorder()->orderByDesc('is_boosted')->orderByDesc('amount_aud');
        }

        $orders = $query->paginate(15);

        // Get trusted contact IDs for the current user
        $trustedIds = TrustedContact::where('user_id', $user->id)
            ->pluck('trusted_user_id')
            ->toArray();

        $formatted = $orders->getCollection()->map(function ($order) use ($trustedIds) {
            $formatted = $this->formatOrderForBrowse($order);
            $formatted['is_trusted_contact'] = in_array($order->user_id, $trustedIds);
            return $formatted;
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
            'expires_at'               => $order->expires_at->toIso8601String(),
            'expires_in_hours'         => max(0, round(now()->diffInHours($order->expires_at, false))),
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
                'account_number' => substr($order->bankAccount->account_number, -4),
                'bsb_code'       => $order->bankAccount->bsb_code,
            ] : null;
        }

        return $data;
    }

    private function formatOrderForBrowse(SwapOrder $order): array
    {
        // Show limited public info — first name only, no phone
        $displayName = $order->user->display_first_name ?? 'Anonymous';

        return [
            'id'               => $order->id,
            'ulid'             => $order->ulid,
            'order_type'       => $order->order_type,
            'amount_aud'       => (float) $order->amount_aud,
            'amount_usd'       => (float) $order->amount_usd,
            'is_boosted'       => (bool) $order->is_boosted,
            'expires_at'       => $order->expires_at->toIso8601String(),
            'created_at'       => $order->created_at->toIso8601String(),
            'created_human'    => $order->created_at->diffForHumans(),
            'delivery_location'=> [
                'id'       => $order->deliveryLocation?->id,
                'name'     => $order->deliveryLocation?->name,
                'province' => $order->deliveryLocation?->province,
            ],
            'owner'            => [
                'ulid'          => $order->user->ulid,
                'display_name'  => $displayName,
                'rating'        => $order->user->rating,
                'total_trades'  => $order->user->total_trades,
                'trust_score'   => $order->user->trust_score,
                'last_seen'     => $order->user->last_seen_human,
                'avatar_url'    => $order->user->avatar_url,
            ],
        ];
    }
}
