<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSupportController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = SupportTicket::with(['user', 'assignee'])
            ->orderByDesc('updated_at');

        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('priority')) $query->where('priority', $request->priority);
        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function($q) use ($s) {
                $q->where('subject', 'like', $s)
                  ->orWhereHas('user', fn($u) => $u->where('first_name','like',$s)->orWhere('email','like',$s));
            });
        }

        $tickets = $query->paginate(20);

        return $this->paginated($tickets, 'Tickets retrieved.', $tickets->getCollection()->map(fn($t) => [
            'id'       => $t->id,
            'ref'      => 'TKT-' . str_pad($t->id, 5, '0', STR_PAD_LEFT),
            'subject'  => $t->subject,
            'category' => $t->category,
            'status'   => $t->status,
            'priority' => $t->priority,
            'user'     => $t->user ? ['id'=>$t->user->id,'name'=>$t->user->first_name.' '.$t->user->last_name,'email'=>$t->user->email] : null,
            'match_ulid'  => $t->match_ulid,
            'created_at'  => $t->created_at->toIso8601String(),
            'updated_at'  => $t->updated_at->toIso8601String(),
        ]));
    }

    public function show(int $id): JsonResponse
    {
        $ticket = SupportTicket::with(['user', 'messages.sender'])->findOrFail($id);

        return $this->success([
            'id'       => $ticket->id,
            'ref'      => 'TKT-' . str_pad($ticket->id, 5, '0', STR_PAD_LEFT),
            'subject'  => $ticket->subject,
            'category' => $ticket->category,
            'status'   => $ticket->status,
            'priority' => $ticket->priority,
            'match_ulid'  => $ticket->match_ulid,
            'admin_notes' => $ticket->admin_notes,
            'user'     => $ticket->user ? ['id'=>$ticket->user->id,'name'=>$ticket->user->first_name.' '.$ticket->user->last_name,'email'=>$ticket->user->email] : null,
            'messages' => $ticket->messages->map(fn($m) => [
                'id'          => $m->id,
                'message'     => $m->message,
                'sender_role' => $m->sender_role,
                'sender_name' => $m->sender_role === 'support' ? 'eZimConnect Support' : ($m->sender?->first_name ?? 'User'),
                'created_at'  => $m->created_at->toIso8601String(),
            ]),
            'created_at'  => $ticket->created_at->toIso8601String(),
        ], 'Ticket retrieved.');
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $request->validate(['message' => ['required', 'string', 'max:2000']]);
        $ticket = SupportTicket::findOrFail($id);

        SupportTicketMessage::create([
            'ticket_id'   => $ticket->id,
            'sender_id'   => $request->user()->id,
            'sender_role' => 'support',
            'message'     => $request->message,
        ]);

        $ticket->update(['status' => 'awaiting_user', 'updated_at' => now()]);

        return $this->success(null, 'Reply sent to user.');
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status'      => ['required', 'in:open,awaiting_support,awaiting_user,resolved,closed'],
            'priority'    => ['nullable', 'in:low,normal,high,urgent'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $updates = ['status' => $request->status];
        if ($request->filled('priority'))    $updates['priority']    = $request->priority;
        if ($request->filled('admin_notes')) $updates['admin_notes'] = $request->admin_notes;
        if ($request->status === 'resolved') $updates['resolved_at'] = now();

        $ticket->update($updates);

        return $this->success(null, 'Ticket updated.');
    }
}
