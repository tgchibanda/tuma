<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Dispute;
use App\Models\DisputeMessage;
use App\Models\SwapMatch;
use App\Services\AuditService;
use App\Services\EscrowService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected NotificationService $notificationService,
        protected AuditService $auditService,
        protected EscrowService $escrowService
    ) {}

    /**
     * Raise a dispute on a match.
     * POST /api/v1/matches/{ulid}/dispute
     */
    public function raise(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'min:20', 'max:2000'],
        ]);

        $userId = $request->user()->id;
        $match  = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->first();

        if (! $match) return $this->notFound('Match not found.');
        if ($match->sendOrder?->user_id !== $userId && $match->receiveOrder?->user_id !== $userId) return $this->forbidden('Access denied.');

        // Can only dispute from awaiting_delivery onwards
        $allowedStatuses = [
            SwapMatch::STATUS_AWAITING_DELIVERY,
            SwapMatch::STATUS_AWAITING_RISK_DELIVERY,
            SwapMatch::STATUS_DELIVERY_UPLOADED,
            SwapMatch::STATUS_RISK_DELIVERY_UPLOADED,
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION,
            SwapMatch::STATUS_CONFIRMED,
            SwapMatch::STATUS_AWAITING_RISK_DEPOSIT,
        ];

        if (! in_array($match->status, $allowedStatuses)) {
            return $this->error(
                "Disputes can only be raised from the delivery stage onwards.",
                422
            );
        }

        if (Dispute::where('swap_match_id', $match->id)->exists()) {
            return $this->error('A dispute already exists for this transaction.', 422);
        }

        $dispute = Dispute::create([
            'swap_match_id' => $match->id,
            'raised_by'     => $userId,
            'reason'        => $request->reason,
            'status'        => Dispute::STATUS_OPEN,
        ]);

        $match->update(['status' => SwapMatch::STATUS_DISPUTED]);

        // Notify both parties + admins
        $otherUser = $userId === $match->sendOrder->user_id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $otherUser,
            new \App\Notifications\DisputeRaisedNotification($dispute),
            ['email', 'inapp']
        );

        \App\Models\User::where('role', 'admin')->get()->each(function ($admin) use ($dispute) {
            $this->notificationService->notify(
                $admin,
                new \App\Notifications\DisputeRaisedNotification($dispute),
                ['email', 'inapp']
            );
        });

        $this->auditService->log('dispute.raised', $request->user(), $dispute);

        return $this->created($this->formatDispute($dispute), 'Dispute raised. Admin will review shortly.');
    }

    /**
     * List the authenticated user's disputes.
     * GET /api/v1/disputes
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $disputes = Dispute::whereHas('swapMatch', function ($q) use ($userId) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $userId))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $userId));
        })
        ->with(['swapMatch.sendOrder', 'swapMatch.receiveOrder'])
        ->orderByDesc('created_at')
        ->paginate(15);

        return $this->paginated(
            $disputes,
            'Disputes retrieved.',
            $disputes->getCollection()->map(fn($d) => $this->formatDispute($d))
        );
    }

    /**
     * Get dispute detail with message thread.
     * GET /api/v1/disputes/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $userId  = $request->user()->id;
        $dispute = $this->findDisputeForUser($id, $userId);

        $dispute->load(['swapMatch.sendOrder', 'swapMatch.receiveOrder', 'messages.sender', 'raisedBy']);

        $data            = $this->formatDispute($dispute, detailed: true);
        $data['messages']= $dispute->messages->map(fn($m) => [
            'id'              => $m->id,
            'message'         => $m->message,
            'attachment'      => $m->attachment,
            'is_admin_message'=> (bool) $m->is_admin_message,
            'is_mine'         => $m->sender_id === $userId,
            'sender'          => [
                'display_name' => $m->sender->display_first_name,
                'avatar_url'   => $m->sender->avatar_url,
            ],
            'created_at'      => $m->created_at->toIso8601String(),
            'created_human'   => $m->created_at->diffForHumans(),
        ]);

        return $this->success($data, 'Dispute retrieved.');
    }

    /**
     * Send a message in a dispute thread.
     * POST /api/v1/disputes/{id}/messages
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'message'    => ['required_without:attachment', 'nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $userId  = $request->user()->id;
        $dispute = $this->findDisputeForUser($id, $userId);

        if (in_array($dispute->status, [Dispute::STATUS_RESOLVED_SENDER, Dispute::STATUS_RESOLVED_RECEIVER, Dispute::STATUS_CLOSED])) {
            return $this->error('This dispute has been resolved and is closed.', 422);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $this->escrowService->storeProofFile(
                $request->file('attachment'),
                'disputes'
            );
        }

        $msg = DisputeMessage::create([
            'dispute_id'       => $dispute->id,
            'sender_id'        => $userId,
            'message'          => $request->message ?? '',
            'attachment'       => $attachmentPath,
            'is_admin_message' => false,
        ]);

        // Notify admins
        \App\Models\User::where('role', 'admin')->get()->each(function ($admin) use ($dispute, $msg) {
            $this->notificationService->notify(
                $admin,
                new \App\Notifications\DisputeMessageNotification($dispute, $msg),
                ['inapp']
            );
        });

        return $this->created([
            'id'         => $msg->id,
            'message'    => $msg->message,
            'attachment' => $msg->attachment,
            'created_at' => $msg->created_at->toIso8601String(),
        ], 'Message sent.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function findDisputeForUser(int $id, int $userId): Dispute
    {
        $dispute = Dispute::with(['swapMatch.sendOrder', 'swapMatch.receiveOrder'])->find($id);

        if (! $dispute) abort(404, 'Dispute not found.');

        $match = $dispute->swapMatch;
        if ($match->sendOrder->user_id !== $userId && $match->receiveOrder->user_id !== $userId) {
            abort(403, 'Access denied.');
        }

        return $dispute;
    }

    private function formatDispute(Dispute $dispute, bool $detailed = false): array
    {
        $data = [
            'id'             => $dispute->id,
            'status'         => $dispute->status,
            'reason'         => $dispute->reason,
            'resolution_notes'=> $dispute->resolution_notes,
            'raised_at'      => $dispute->created_at->toIso8601String(),
            'hours_open'     => $dispute->hours_open,
            'resolved_at'    => $dispute->resolved_at?->toIso8601String(),
            'match_ulid'     => $dispute->swapMatch?->ulid,
        ];

        if ($detailed) {
            $data['match'] = $dispute->swapMatch ? [
                'ulid'       => $dispute->swapMatch->ulid,
                'agreed_aud' => (float) $dispute->swapMatch->agreed_aud,
                'agreed_usd' => (float) $dispute->swapMatch->agreed_usd,
                'status'     => $dispute->swapMatch->status,
            ] : null;
        }

        return $data;
    }
}
