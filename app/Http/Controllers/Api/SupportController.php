<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $tickets = SupportTicket::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->paginate(10);

        return $this->paginated($tickets, 'Tickets retrieved.', $tickets->getCollection()->map(fn($t) => [
            'id'         => $t->id,
            'ref'        => 'TKT-' . str_pad($t->id, 5, '0', STR_PAD_LEFT),
            'subject'    => $t->subject,
            'category'   => $t->category,
            'status'     => $t->status,
            'priority'   => $t->priority,
            'created_at' => $t->created_at->toIso8601String(),
            'updated_at' => $t->updated_at->toIso8601String(),
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'subject'  => ['required', 'string', 'max:200'],
            'category' => ['required', 'in:general,payment,account,transaction,technical,other'],
            'message'  => ['required', 'string', 'max:2000'],
            'match_ulid' => ['nullable', 'string'],
        ]);

        $ticket = SupportTicket::create([
            'user_id'    => $request->user()->id,
            'subject'    => $request->subject,
            'category'   => $request->category,
            'status'     => 'open',
            'priority'   => 'normal',
            'match_ulid' => $request->match_ulid,
        ]);

        SupportTicketMessage::create([
            'ticket_id'   => $ticket->id,
            'sender_id'   => $request->user()->id,
            'sender_role' => 'user',
            'message'     => $request->message,
        ]);

        return $this->created([
            'id'  => $ticket->id,
            'ref' => 'TKT-' . str_pad($ticket->id, 5, '0', STR_PAD_LEFT),
        ], 'Support ticket created. We will respond within 24 hours.');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $ticket = SupportTicket::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('messages.sender')
            ->firstOrFail();

        return $this->success([
            'id'         => $ticket->id,
            'ref'        => 'TKT-' . str_pad($ticket->id, 5, '0', STR_PAD_LEFT),
            'subject'    => $ticket->subject,
            'category'   => $ticket->category,
            'status'     => $ticket->status,
            'priority'   => $ticket->priority,
            'match_ulid' => $ticket->match_ulid,
            'messages'   => $ticket->messages->map(fn($m) => [
                'id'          => $m->id,
                'message'     => $m->message,
                'sender_role' => $m->sender_role,
                'sender_name' => $m->sender_role === 'support' ? 'eZimConnect Support' : $m->sender?->display_first_name,
                'created_at'  => $m->created_at->toIso8601String(),
            ]),
            'created_at' => $ticket->created_at->toIso8601String(),
        ], 'Ticket retrieved.');
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $request->validate(['message' => ['required', 'string', 'max:2000']]);

        $ticket = SupportTicket::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($ticket->status === 'closed') {
            return $this->error('This ticket is closed. Please open a new ticket.', 422);
        }

        SupportTicketMessage::create([
            'ticket_id'   => $ticket->id,
            'sender_id'   => $request->user()->id,
            'sender_role' => 'user',
            'message'     => $request->message,
        ]);

        $ticket->update(['status' => 'awaiting_support', 'updated_at' => now()]);

        return $this->created(null, 'Reply sent.');
    }
}
