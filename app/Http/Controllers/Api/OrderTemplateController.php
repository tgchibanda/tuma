<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ExchangeRate;
use App\Models\OrderTemplate;
use App\Models\SwapOrder;
use App\Services\FeeCalculationService;
use App\Services\KycService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\Uid\Ulid;

class OrderTemplateController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FeeCalculationService $feeService,
        protected KycService $kycService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $templates = OrderTemplate::where('user_id', $request->user()->id)
            ->with('savedRecipient.deliveryLocation')
            ->where('is_active', 1)
            ->orderByDesc('use_count')
            ->get()
            ->map(fn($t) => $this->format($t));

        return $this->success($templates, 'Templates retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'               => ['required', 'string', 'max:100'],
            'order_type'         => ['required', 'in:send_to_zim,receive_from_zim'],
            'amount_aud'         => ['required', 'numeric', 'min:50'],
            'saved_recipient_id' => ['nullable', 'integer', 'exists:saved_recipients,id'],
            'aud_bank_account_id'=> ['nullable', 'integer', 'exists:bank_accounts,id'],
        ]);

        if (OrderTemplate::where('user_id', $request->user()->id)->count() >= 10) {
            return $this->error('Maximum of 10 templates allowed.', 422);
        }

        $template = OrderTemplate::create([
            'user_id'             => $request->user()->id,
            'name'                => $request->name,
            'order_type'          => $request->order_type,
            'amount_aud'          => $request->amount_aud,
            'saved_recipient_id'  => $request->saved_recipient_id,
            'aud_bank_account_id' => $request->aud_bank_account_id,
            'is_active'           => 1,
        ]);

        return $this->created($this->format($template), 'Template created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $template = OrderTemplate::where('user_id', $request->user()->id)->findOrFail($id);
        $request->validate([
            'name'       => ['sometimes', 'string', 'max:100'],
            'amount_aud' => ['sometimes', 'numeric', 'min:50'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);
        $template->update($request->only(['name', 'amount_aud', 'is_active']));
        return $this->success($this->format($template), 'Template updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        OrderTemplate::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success(null, 'Template deleted.');
    }

    /**
     * Create a new order from a template.
     * POST /api/v1/templates/{id}/use
     */
    public function use(Request $request, int $id): JsonResponse
    {
        $user     = $request->user();
        $template = OrderTemplate::where('user_id', $user->id)->with('savedRecipient')->findOrFail($id);

        $this->kycService->assertCanTrade($user);

        $rate = ExchangeRate::currentRate('AUD', 'USD');
        if (! $rate) {
            return $this->error('Exchange rate not available. Please try again.', 503);
        }

        $feeCalc     = $this->feeService->calculateUsd((float) $template->amount_aud, $rate, $user);
        $expiryHours = (int) \App\Models\SystemSetting::get('order_expiry_hours', 48);

        $recipient = $template->savedRecipient;
        if (! $recipient) {
            return $this->error('This template has no saved recipient. Please update the template.', 422);
        }

        $order = SwapOrder::create([
            'ulid'                     => (string) new Ulid(),
            'user_id'                  => $user->id,
            'order_type'               => $template->order_type,
            'amount_aud'               => $template->amount_aud,
            'amount_usd'               => $feeCalc['amount_usd'],
            'exchange_rate_id'         => $rate->id,
            'platform_fee_aud'         => $feeCalc['fee_aud'],
            'platform_fee_percent'     => $feeCalc['fee_percent'],
            'zim_recipient_name'       => $recipient->recipient_name,
            'zim_recipient_phone'      => $recipient->recipient_phone,
            'zim_delivery_location_id' => $recipient->delivery_location_id,
            'zim_delivery_address'     => $recipient->delivery_address,
            'aud_recipient_name'       => $user->first_name . ' ' . $user->last_name,
            'aud_bank_account_id'      => $template->aud_bank_account_id ?? $user->bankAccounts()->where('is_primary', 1)->value('id'),
            'template_id'              => $template->id,
            'status'                   => SwapOrder::STATUS_OPEN,
            'expires_at'               => now()->addHours($expiryHours),
        ]);

        $template->increment('use_count');
        $template->last_used_at = now();
        $template->save();

        return $this->created(['ulid' => $order->ulid], 'Order created from template.');
    }

    private function format(OrderTemplate $t): array
    {
        return [
            'id'          => $t->id,
            'name'        => $t->name,
            'order_type'  => $t->order_type,
            'amount_aud'  => (float) $t->amount_aud,
            'is_active'   => (bool) $t->is_active,
            'use_count'   => $t->use_count,
            'last_used_at'=> $t->last_used_at?->toIso8601String(),
            'saved_recipient' => $t->savedRecipient ? [
                'id'       => $t->savedRecipient->id,
                'nickname' => $t->savedRecipient->nickname,
                'city'     => $t->savedRecipient->deliveryLocation?->name,
            ] : null,
        ];
    }
}
