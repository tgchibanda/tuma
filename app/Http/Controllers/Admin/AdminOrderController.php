<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    use ApiResponse;

    /**
     * List all orders with filters.
     * GET /api/admin/orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = SwapOrder::with(['user', 'deliveryLocation'])
            ->orderByDesc('created_at');

        if ($request->filled('status'))     $query->where('status', $request->status);
        if ($request->filled('order_type')) $query->where('order_type', $request->order_type);
        if ($request->filled('user_id'))    $query->where('user_id', $request->user_id);
        if ($request->filled('location_id'))$query->where('zim_delivery_location_id', $request->location_id);

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        $orders = $query->paginate(20);

        return $this->paginated($orders, 'Orders retrieved.', $orders->getCollection()->map(fn($o) => [
            'id'               => $o->id,
            'ulid'             => $o->ulid,
            'order_type'       => $o->order_type,
            'status'           => $o->status,
            'amount_aud'       => (float) $o->amount_aud,
            'amount_usd'       => (float) $o->amount_usd,
            'is_boosted'       => (bool) $o->is_boosted,
            'expires_at'       => $o->expires_at->toIso8601String(),
            'created_at'       => $o->created_at->toIso8601String(),
            'user'             => [
                'id'    => $o->user->id,
                'name'  => $o->user->first_name . ' ' . $o->user->last_name,
                'email' => $o->user->email,
            ],
            'delivery_location'=> [
                'name'     => $o->deliveryLocation?->name,
                'province' => $o->deliveryLocation?->province,
            ],
        ]));
    }

    /**
     * Get order detail.
     * GET /api/admin/orders/{ulid}
     */
    public function show(string $ulid): JsonResponse
    {
        $order = SwapOrder::where('ulid', $ulid)
            ->with(['user', 'deliveryLocation', 'bankAccount', 'sendMatch', 'receiveMatch'])
            ->firstOrFail();

        return $this->success([
            'id'                       => $order->id,
            'ulid'                     => $order->ulid,
            'order_type'               => $order->order_type,
            'status'                   => $order->status,
            'amount_aud'               => (float) $order->amount_aud,
            'amount_usd'               => (float) $order->amount_usd,
            'platform_fee_aud'         => (float) $order->platform_fee_aud,
            'zim_recipient_name'       => $order->zim_recipient_name,
            'zim_recipient_phone'      => $order->zim_recipient_phone,
            'zim_delivery_address'     => $order->zim_delivery_address,
            'zim_delivery_notes'       => $order->zim_delivery_notes,
            'expires_at'               => $order->expires_at->toIso8601String(),
            'cancelled_reason'         => $order->cancelled_reason,
            'is_boosted'               => (bool) $order->is_boosted,
            'created_at'               => $order->created_at->toIso8601String(),
            'user'                     => [
                'id'         => $order->user->id,
                'ulid'       => $order->user->ulid,
                'name'       => $order->user->first_name . ' ' . $order->user->last_name,
                'email'      => $order->user->email,
                'kyc_status' => $order->user->kyc_status,
            ],
            'delivery_location'        => [
                'id'       => $order->deliveryLocation?->id,
                'name'     => $order->deliveryLocation?->name,
                'province' => $order->deliveryLocation?->province,
            ],
            'bank_account'             => $order->bankAccount ? [
                'bank_name'      => $order->bankAccount->bank_name,
                'account_number' => substr($order->bankAccount->account_number, -4),
                'bsb_code'       => $order->bankAccount->bsb_code,
            ] : null,
            'active_match_ulid'        => $order->sendMatch?->ulid ?? $order->receiveMatch?->ulid,
        ], 'Order retrieved.');
    }
}
