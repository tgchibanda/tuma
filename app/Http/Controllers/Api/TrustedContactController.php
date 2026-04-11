<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\TrustedContact;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrustedContactController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $contacts = TrustedContact::where('user_id', $request->user()->id)
            ->with('trustedUser')
            ->orderByDesc('added_at')
            ->get()
            ->map(fn($c) => [
                'id'           => $c->id,
                'note'         => $c->note,
                'added_at'     => $c->added_at?->toIso8601String(),
                'trusted_user' => $c->trustedUser ? [
                    'ulid'         => $c->trustedUser->ulid,
                    'display_name' => $c->trustedUser->display_first_name . ' ' . ($c->trustedUser->last_name[0] ?? '') . '.',
                    'total_trades' => $c->trustedUser->total_trades,
                    'rating'       => $c->trustedUser->rating ? (float) $c->trustedUser->rating : null,
                    'trust_score'  => $c->trustedUser->trust_score,
                ] : null,
            ]);

        return $this->success($contacts, 'Trusted contacts retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'trusted_user_ulid' => ['required', 'string'],
            'note'              => ['nullable', 'string', 'max:255'],
        ]);

        $trustedUser = User::where('ulid', $request->trusted_user_ulid)
            ->where('account_status', 'active')
            ->firstOrFail();

        if ($trustedUser->id === $request->user()->id) {
            return $this->error('You cannot add yourself as a trusted contact.', 422);
        }

        $existing = TrustedContact::where('user_id', $request->user()->id)
            ->where('trusted_user_id', $trustedUser->id)
            ->exists();

        if ($existing) {
            return $this->error('This user is already in your trusted contacts.', 422);
        }

        $contact = TrustedContact::create([
            'user_id'         => $request->user()->id,
            'trusted_user_id' => $trustedUser->id,
            'added_at'        => now(),
            'note'            => $request->note,
        ]);

        return $this->created(['id' => $contact->id], 'Contact added.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        TrustedContact::where('user_id', $request->user()->id)
            ->findOrFail($id)
            ->delete();

        return $this->success(null, 'Contact removed.');
    }
}
