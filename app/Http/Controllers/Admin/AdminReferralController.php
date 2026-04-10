<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Referral;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReferralController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Referral::with(['referrer', 'referred'])->orderByDesc('created_at');

        if ($request->filled('status')) $query->where('status', $request->status);

        $referrals = $query->paginate(20);

        return $this->paginated($referrals, 'Referrals retrieved.', $referrals->getCollection()->map(fn($r) => [
            'id'              => $r->id,
            'status'          => $r->status,
            'referral_code'   => $r->referral_code,
            'qualified_at'    => $r->qualified_at?->toIso8601String(),
            'reward_applied_at'=> $r->reward_applied_at?->toIso8601String(),
            'referrer_discount'=> (float) $r->referrer_discount_percent,
            'referred_discount'=> (float) $r->referred_discount_percent,
            'created_at'      => $r->created_at->toIso8601String(),
            'referrer'        => $r->referrer ? ['id' => $r->referrer->id, 'name' => $r->referrer->first_name . ' ' . $r->referrer->last_name, 'email' => $r->referrer->email] : null,
            'referred'        => $r->referred  ? ['id' => $r->referred->id,  'name' => $r->referred->first_name  . ' ' . $r->referred->last_name,  'email' => $r->referred->email]  : null,
        ]));
    }
}
