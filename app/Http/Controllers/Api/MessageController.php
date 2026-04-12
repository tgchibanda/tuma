<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\TransactionMessage;
use App\Services\EscrowService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected NotificationService $notificationService,
        protected EscrowService $escrowService
    ) {}

    /**
     * Get chat messages for a match.
     * GET /api/v1/matches/{ulid}/messages
     * Paginated at 30 per page, newest first.
     */
    public function index(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        $messages = TransactionMessage::where('swap_match_id', $match->id)
            ->with('sender')
            ->orderByDesc('created_at')
            ->paginate(30);

        $formatted = $messages->getCollection()->map(fn($m) => [
            'id'          => $m->id,
            'message'     => $m->message,
            'attachment'  => $m->attachment
                ? url('/api/v1/files/chat/' . urlencode(basename($m->attachment)))
                : null,
            'is_read'     => (bool) $m->is_read,
            'is_mine'     => $m->sender_id === $userId,
            'sender'      => [
                'ulid'         => $m->sender->ulid,
                'display_name' => $m->sender->display_first_name,
                'avatar_url'   => $m->sender->avatar_url,
            ],
            'created_at'  => $m->created_at->toIso8601String(),
            'created_human'=> $m->created_at->diffForHumans(),
        ]);

        // Auto-mark unread messages from the OTHER party as read
        TransactionMessage::where('swap_match_id', $match->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return $this->paginated($messages, 'Messages retrieved.', $formatted);
    }

    /**
     * Send a chat message.
     * POST /api/v1/matches/{ulid}/messages
     */
    public function store(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'message'    => ['required_without:attachment', 'nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        // Chat is closed for completed/cancelled/refunded matches
        $terminalStatuses = ['completed', 'cancelled', 'refunded', 'expired'];
        if (in_array($match->status, $terminalStatuses)) {
            return $this->error(
                'This transaction is ' . $match->status . '. The chat has been closed.',
                422
            );
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $this->escrowService->storeProofFile(
                $request->file('attachment'),
                'chat'
            );
        }

        $message = TransactionMessage::create([
            'swap_match_id' => $match->id,
            'sender_id'     => $userId,
            'message'       => $request->message ?? '',
            'attachment'    => $attachmentPath,
            'is_read'       => false,
            'created_at'    => now(), // explicit — model has $timestamps = false
        ]);

        // Notify the other party (in-app only — email would be too noisy for chat)
        $otherUser = $userId === $match->sendOrder->user_id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $otherUser,
            new \App\Notifications\NewChatMessageNotification($match, $message),
            ['inapp']
        );

        // TransactionMessage has $timestamps=false — created_at is set by DB default.
        // Call refresh() to pull the DB-populated value back into the model instance.
        $message->refresh();
        $ts = $message->created_at ?? now();

        return $this->created([
            'id'           => $message->id,
            'message'      => $message->message,
            'attachment'   => $message->attachment
                ? url('/api/v1/files/chat/' . urlencode(basename($message->attachment)))
                : null,
            'is_mine'      => true,
            'created_at'   => $ts->toIso8601String(),
            'created_human'=> $ts->diffForHumans(),
        ], 'Message sent.');
    }

    /**
     * Mark messages as read.
     * POST /api/v1/matches/{ulid}/messages/read
     */
    public function markRead(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        $updated = TransactionMessage::where('swap_match_id', $match->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return $this->success(['marked_read' => $updated], 'Messages marked as read.');
    }

    /**
     * Get unread message count for a match.
     * GET /api/v1/matches/{ulid}/messages/unread-count
     */
    public function unreadCount(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        $count = TransactionMessage::where('swap_match_id', $match->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->count();

        return $this->success(['unread_count' => $count], 'Unread count retrieved.');
    }

    private function findMatchForUser(string $ulid, int $userId): SwapMatch
    {
        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->first();
        if (! $match) abort(404, 'Match not found.');
        if ($match->sendOrder?->user_id !== $userId && $match->receiveOrder?->user_id !== $userId) abort(403, 'Access denied.');
        return $match;
    }
}
