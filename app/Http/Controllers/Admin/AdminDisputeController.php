<?php

namespace App\Http\Controllers\Admin;

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

class AdminDisputeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EscrowService $escrowService,
        protected NotificationService $notificationService,
        protected AuditService $auditService
    ) {}

    /**
     * List all disputes, filterable by status. Colour-coded by urgency (hours open).
     * GET /api/v1/admin/disputes
     */
    public function index(Request $request): JsonResponse
    {
        $query = Dispute::with(['swapMatch.sendOrder.user', 'swapMatch.receiveOrder.user', 'raisedBy'])
            ->orderBy('created_at'); // Oldest first = most urgent

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $disputes = $query->paginate(20);

        return $this->paginated($disputes, 'Disputes retrieved.', $disputes->getCollection()->map(fn($d) => [
            'id'           => $d->id,
            'status'       => $d->status,
            'hours_open'   => $d->hours_open,
            'urgency'      => $this->getUrgencyLevel($d->hours_open),
            'reason'       => \Illuminate\Support\Str::limit($d->reason, 100),
            'raised_at'    => $d->created_at->toIso8601String(),
            'resolved_at'  => $d->resolved_at?->toIso8601String(),
            'match_ulid'   => $d->swapMatch?->ulid,
            'match_status' => $d->swapMatch?->status,
            'agreed_aud'   => $d->swapMatch ? (float) $d->swapMatch->agreed_aud : null,
            'sender'       => $d->swapMatch?->sendOrder?->user ? [
                'id'   => $d->swapMatch->sendOrder->user->id,
                'name' => $d->swapMatch->sendOrder->user->first_name . ' ' . $d->swapMatch->sendOrder->user->last_name,
            ] : null,
            'receiver'     => $d->swapMatch?->receiveOrder?->user ? [
                'id'   => $d->swapMatch->receiveOrder->user->id,
                'name' => $d->swapMatch->receiveOrder->user->first_name . ' ' . $d->swapMatch->receiveOrder->user->last_name,
            ] : null,
        ]));
    }

    /**
     * Get full dispute detail with message thread.
     * GET /api/v1/admin/disputes/{id}
     */
    public function show(int $id): JsonResponse
    {
        $dispute = Dispute::with([
            'swapMatch.sendOrder.user',
            'swapMatch.receiveOrder.user',
            'swapMatch.deposit',
            'swapMatch.delivery',
            'messages.sender',
            'raisedBy',
            'resolvedBy',
        ])->findOrFail($id);

        return $this->success([
            'id'               => $dispute->id,
            'status'           => $dispute->status,
            'reason'           => $dispute->reason,
            'resolution_notes' => $dispute->resolution_notes,
            'hours_open'       => $dispute->hours_open,
            'urgency'          => $this->getUrgencyLevel($dispute->hours_open),
            'raised_at'        => $dispute->created_at->toIso8601String(),
            'resolved_at'      => $dispute->resolved_at?->toIso8601String(),
            'raised_by'        => $dispute->raisedBy ? [
                'name'  => $dispute->raisedBy->first_name . ' ' . $dispute->raisedBy->last_name,
                'email' => $dispute->raisedBy->email,
            ] : null,
            'resolved_by'      => $dispute->resolvedBy ? [
                'name' => $dispute->resolvedBy->first_name . ' ' . $dispute->resolvedBy->last_name,
            ] : null,
            'match'            => $dispute->swapMatch ? [
                'ulid'           => $dispute->swapMatch->ulid,
                'status'         => $dispute->swapMatch->status,
                'delivery_method'=> $dispute->swapMatch->delivery_method,
                'agreed_aud'     => (float) $dispute->swapMatch->agreed_aud,
                'agreed_usd'     => (float) $dispute->swapMatch->agreed_usd,
                'deposit_status' => $dispute->swapMatch->deposit?->status,
                'delivery_status'=> $dispute->swapMatch->delivery?->status,
                'proof_url'      => $dispute->swapMatch->deposit?->proof_file
                    ? route('admin.deposit.proof', ['id' => $dispute->swapMatch->deposit->id])
                    : null,
                'delivery_id_photo_url' => $dispute->swapMatch->delivery?->recipient_id_photo
                    ? route('admin.delivery.proof', ['id' => $dispute->swapMatch->delivery->id, 'type' => 'id'])
                    : null,
                'delivery_handover_url' => $dispute->swapMatch->delivery?->handover_amount_photo
                    ? route('admin.delivery.proof', ['id' => $dispute->swapMatch->delivery->id, 'type' => 'handover'])
                    : null,
            ] : null,
            'messages'         => $dispute->messages->map(fn($m) => [
                'id'               => $m->id,
                'message'          => $m->message,
                'attachment'       => $m->attachment,
                'is_admin_message' => (bool) $m->is_admin_message,
                'sender'           => [
                    'id'   => $m->sender->id,
                    'name' => $m->sender->first_name . ' ' . $m->sender->last_name,
                    'role' => $m->sender->role,
                ],
                'created_at'       => $m->created_at->toIso8601String(),
            ]),
            'available_resolutions' => ['sender', 'receiver', 'refund'],
        ], 'Dispute retrieved.');
    }

    /**
     * Resolve a dispute.
     * PUT /api/v1/admin/disputes/{id}/resolve
     * body: { resolution: 'sender'|'receiver'|'refund', notes: '...' }
     *
     * sender   → favour sender (deliverer failed to deliver) — release to sender or no payment to receiver
     * receiver → favour receiver (delivery confirmed) — release AUD to deliverer
     * refund   → refund AUD to sender regardless
     */
    public function resolve(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'resolution' => ['required', 'in:sender,receiver,refund'],
            'notes'      => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $dispute = Dispute::with(['swapMatch.sendOrder', 'swapMatch.receiveOrder', 'swapMatch.deposit'])->findOrFail($id);

        if (in_array($dispute->status, [
            Dispute::STATUS_RESOLVED_SENDER,
            Dispute::STATUS_RESOLVED_RECEIVER,
            Dispute::STATUS_CLOSED,
        ])) {
            return $this->error('This dispute has already been resolved.', 422);
        }

        $match = $dispute->swapMatch;

        try {
            match ($request->resolution) {
                'receiver' => $this->escrowService->releaseFunds($match, $request->user()),
                'refund'   => $this->escrowService->refundDeposit($match, $request->user(), $request->notes),
                'sender'   => $this->resolveFavouringSender($match, $request->user(), $request->notes),
            };
        } catch (\App\Exceptions\TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        $statusMap = [
            'sender'   => Dispute::STATUS_RESOLVED_SENDER,
            'receiver' => Dispute::STATUS_RESOLVED_RECEIVER,
            'refund'   => Dispute::STATUS_REFUNDED,
        ];

        $dispute->update([
            'status'           => $statusMap[$request->resolution],
            'resolution_notes' => $request->notes,
            'resolved_by'      => $request->user()->id,
            'resolved_at'      => now(),
        ]);

        // Notify both parties
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\DisputeResolvedNotification($dispute),
                ['email', 'inapp']
            );
        }

        $this->auditService->log('dispute.resolved', $request->user(), $dispute, [], [
            'resolution' => $request->resolution,
            'notes'      => $request->notes,
        ]);

        return $this->success(null, 'Dispute resolved.');
    }

    /**
     * Admin posts a message in a dispute thread.
     * POST /api/v1/admin/disputes/{id}/messages
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'message'    => ['required_without:attachment', 'nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $dispute = Dispute::findOrFail($id);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = app(\App\Services\EscrowService::class)->storeProofFile(
                $request->file('attachment'),
                'disputes'
            );
        }

        $msg = DisputeMessage::create([
            'dispute_id'       => $dispute->id,
            'sender_id'        => $request->user()->id,
            'message'          => $request->message ?? '',
            'attachment'       => $attachmentPath,
            'is_admin_message' => true,
        ]);

        // Notify both parties
        $match = $dispute->swapMatch()->with(['sendOrder.user', 'receiveOrder.user'])->first();
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\DisputeMessageNotification($dispute, $msg),
                ['email', 'inapp']
            );
        }

        return $this->created([
            'id'         => $msg->id,
            'message'    => $msg->message,
            'created_at' => $msg->created_at->toIso8601String(),
        ], 'Message sent to dispute thread.');
    }

    private function resolveFavouringSender(SwapMatch $match, \App\Models\User $admin, string $reason): void
    {
        // Sender wins: if deposit exists, refund it. Otherwise just cancel the match.
        if ($match->deposit && in_array($match->deposit->status, ['verified', 'pending'])) {
            $this->escrowService->refundDeposit($match, $admin, $reason);
        } else {
            $match->update(['status' => SwapMatch::STATUS_CANCELLED, 'admin_notes' => $reason]);
            $match->sendOrder->update(['status' => 'open']);
            $match->receiveOrder->update(['status' => 'open']);
        }
    }

    private function getUrgencyLevel(int $hoursOpen): string
    {
        if ($hoursOpen >= 48) return 'critical';
        if ($hoursOpen >= 24) return 'high';
        if ($hoursOpen >= 8)  return 'medium';
        return 'low';
    }
}
