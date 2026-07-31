<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    public function index(Request $request, $ticketId)
    {
        $ticket = Ticket::with([
            'creator:id,firstname,username,email',
            'assignedUser:id,firstname,username,email'
        ])->find($ticketId);

        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found.'
            ], 404);
        }

        if (!$this->canParticipate($request->user(), $ticket)) {
            return response()->json([
                'message' => 'Only the ticket creator, assigned IT Support Agent, and administrators can access this conversation.'
            ], 403);
        }

        $comments = TicketComment::with('user.role')
            ->where('ticketid', $ticket->id)
            ->orderBy('date')
            ->orderBy('id')
            ->get()
            ->map(fn (TicketComment $comment) => $this->formatComment($comment));

        return response()->json([
            'ticket' => $ticket,
            'comments' => $comments
        ]);
    }

    public function store(Request $request, $ticketId)
    {
        $ticket = Ticket::find($ticketId);

        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found.'
            ], 404);
        }

        if (!$this->canParticipate($request->user(), $ticket)) {
            return response()->json([
                'message' => 'Only the ticket creator, assigned IT Support Agent, and administrators can participate in this conversation.'
            ], 403);
        }

        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:5000'],
            'parentid' => ['nullable', 'integer']
        ]);

        if (!empty($validated['parentid'])) {
            $parentExists = TicketComment::where('ticketid', $ticket->id)
                ->where('id', $validated['parentid'])
                ->exists();

            if (!$parentExists) {
                return response()->json([
                    'message' => 'The selected parent comment does not belong to this ticket.'
                ], 422);
            }
        }

        $comment = TicketComment::create([
            'ticketid' => $ticket->id,
            'userid' => $request->user()->id,
            'parentid' => $validated['parentid'] ?? null,
            'comment' => trim($validated['comment']),
            'date' => now()
        ]);

        $comment->load('user.role');

        return response()->json([
            'message' => empty($comment->parentid)
                ? 'Comment sent successfully.'
                : 'Reply sent successfully.',
            'comment' => $this->formatComment($comment)
        ], 201);
    }

    private function canParticipate(User $user, Ticket $ticket): bool
    {
        $user->loadMissing('role');
        $role = $user->role?->role;

        if ($role === 'Admin') {
            return true;
        }

        if ($role === 'Employee') {
            return (int) $ticket->createdby === (int) $user->id;
        }

        if ($role === 'IT Support Agent') {
            return $ticket->assignedto !== null
                && (int) $ticket->assignedto === (int) $user->id;
        }

        return false;
    }

    private function formatComment(TicketComment $comment): array
    {
        return [
            'id' => $comment->id,
            'ticketid' => $comment->ticketid,
            'parentid' => $comment->parentid,
            'comment' => $comment->comment,
            'date' => $comment->date?->toISOString(),
            'user' => [
                'id' => $comment->user->id,
                'firstname' => $comment->user->firstname,
                'username' => $comment->user->username,
                'email' => $comment->user->email,
                'role' => $comment->user->role?->role
            ]
        ];
    }
}
