<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Get all IT support agents for the assignment page.
     */
    public function agents()
    {
        $user = Auth::user();
        $user->load('role');

        if (!$user->role || $user->role->role !== 'Admin') {
            return response()->json([
                'message' => 'Only administrators can view IT support agents.'
            ], 403);
        }

        $agents = User::whereHas('role', function ($query) {
                $query->where('role', 'IT Support Agent');
            })
            ->select('id', 'firstname', 'username', 'email')
            ->orderBy('firstname')
            ->get();

        return response()->json([
            'agents' => $agents
        ]);
    }

    /**
     * Get tickets based on user role.
     */
    public function index()
    {
        $user = Auth::user();
    $user->load('role');

    $query = Ticket::with([
        'creator',
        'assignedUser',
        'priority',
        'status',
        'category'
    ]);

    switch ($user->role->role) {

        case 'Admin':
              if (request('assigned') === 'unassigned') {
            $query->whereNull('assignedto');
        }

        break;
        case 'Manager':
            break;

        case 'Employee':
            $query->where('createdby', $user->id);
            break;

        case 'IT Support Agent':
             if (request('assigned') === 'unassigned') {
            $query->whereNull('assignedto');
        } else {
            $query->where('assignedto', $user->id);
        }

        break;

        default:
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
    }

    if (request()->filled('statusid')) {
        $query->where('statusid', request('statusid'));
    }

    if (request()->filled('priorityid')) {
        $query->where('priorityid', request('priorityid'));
    }

    if (request()->filled('categoryid')) {
        $query->where('categoryid', request('categoryid'));
    }

    if (request()->filled('date')) {
        $query->whereDate('creation_date', request('date'));
    }

    if (request('sort') === 'newest') {
        $query->orderByDesc('creation_date')
            ->orderByDesc('id');
    }

    return response()->json([
        'tickets' => $query->get()
    ]);
    }

    /**
     * Create a new ticket.
     */
    public function store(StoreTicketRequest $request)
    {
        $user = Auth::user();

        $user->load('role');

        // Only Admin and Employee can create tickets
        if (!in_array($user->role->role, ['Admin', 'Employee'])) {

            return response()->json([
                'message' => 'You are not allowed to create tickets.'
            ], 403);
        }

        // Find Open status
        $openStatus = Status::where('status', 'Open')->first();

        if (!$openStatus) {
            return response()->json([
                'message' => 'Open status not found.'
            ], 500);
        }

        $ticket = Ticket::create([

            'priorityid' => $request->priorityid,

            'statusid' => $openStatus->id,

            'categoryid' => $request->categoryid,

            'createdby' => $user->id,

            'assignedto' => null,

            'creation_date' => now(),

            'update_date' => null,

            'closed_date' => null,

            'title' => $request->title,

            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Ticket created successfully.',
            'ticket' => $ticket
        ], 201);
    }

    
    
    public function show($id)
{
    $user = Auth::user();
    $user->load('role');

    $ticket = Ticket::with([
        'creator',
        'assignedUser',
        'priority',
        'status',
        'category'
    ])->find($id);

    if (!$ticket) {
        return response()->json([
            'message' => 'Ticket not found.'
        ], 404);
    }

    switch ($user->role->role) {

        case 'Admin':
        case 'Manager':
            break;

        case 'Employee':
            if ($ticket->createdby != $user->id) {
                return response()->json([
                    'message' => 'Unauthorized.'
                ], 403);
            }
            break;

        case 'IT Support Agent':
            if ($ticket->assignedto != $user->id) {
                return response()->json([
                    'message' => 'Unauthorized.'
                ], 403);
            }
            break;

        default:
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
    }

    return response()->json($ticket);
}
public function update(UpdateTicketRequest $request, $id)
{
    $user = Auth::user();
    $user->load('role');

    $ticket = Ticket::find($id);

    if (!$ticket) {
        return response()->json([
            'message' => 'Ticket not found.'
        ],404);
    }

    switch ($user->role->role) {

        case 'Admin':

            $ticket->update([
                'title' => $request->title ?? $ticket->title,
                'description' => $request->description ?? $ticket->description,
                'priorityid' => $request->priorityid ?? $ticket->priorityid,
                'categoryid' => $request->categoryid ?? $ticket->categoryid,
                'statusid' => $request->statusid ?? $ticket->statusid,
                'assignedto' => $request->assignedto ?? $ticket->assignedto,
                'update_date' => now(),
            ]);

            break;

        case 'Employee':

            if ($ticket->createdby != $user->id) {

                return response()->json([
                    'message'=>'Unauthorized.'
                ],403);

            }

            if ($ticket->assignedto !== null) {

                return response()->json([
                    'message'=>'Assigned tickets can no longer be edited.'
                ],403);

            }

            $openStatus = Status::where('status','Open')->first();

            if ($ticket->statusid != $openStatus->id) {

                return response()->json([
                    'message'=>'Only Open tickets can be edited.'
                ],403);

            }

            $ticket->update([
                'title' => $request->title ?? $ticket->title,
                'description' => $request->description ?? $ticket->description,
                'priorityid' => $request->priorityid ?? $ticket->priorityid,
                'categoryid' => $request->categoryid ?? $ticket->categoryid,
                'update_date' => now(),
            ]);

            break;

        case 'IT Support Agent':

            if ($ticket->assignedto != $user->id) {

                return response()->json([
                    'message'=>'Unauthorized.'
                ],403);

            }

            if ($request->filled('statusid')) {

                $ticket->statusid = $request->statusid;

                $closedStatus = Status::where('status','Closed')->first();

                if($closedStatus && $request->statusid == $closedStatus->id){

                    $ticket->closed_date = now();

                }

                $ticket->update_date = now();

                $ticket->save();
            }

            break;

        case 'Manager':

            return response()->json([
                'message'=>'Managers cannot edit tickets.'
            ],403);

        default:

            return response()->json([
                'message'=>'Unauthorized.'
            ],403);

    }

    return response()->json([
        'message'=>'Ticket updated successfully.',
        'ticket'=>$ticket->fresh([
            'creator',
            'assignedUser',
            'priority',
            'status',
            'category'
        ])
    ]);
}
public function destroy($id)
{
    $user = Auth::user();
    $user->load('role');

    if($user->role->role != 'Admin'){

        return response()->json([
            'message'=>'Only administrators can delete tickets.'
        ],403);

    }

    $ticket = Ticket::find($id);

    if(!$ticket){

        return response()->json([
            'message'=>'Ticket not found.'
        ],404);

    }

    $ticket->delete();

    return response()->json([
        'message'=>'Ticket deleted successfully.'
    ]);
}
public function assign(Request $request, $id)
{
    $user = Auth::user();
    $user->load('role');

    if (!$user->role) {
        return response()->json([
            'message' => 'User role not found.'
        ], 403);
    }

    $role = $user->role->role;

    if (!in_array($role, ['Admin', 'IT Support Agent'])) {
        return response()->json([
            'message' => 'Unauthorized.'
        ], 403);
    }

    $ticket = Ticket::find($id);

    if (!$ticket) {
        return response()->json([
            'message' => 'Ticket not found.'
        ], 404);
    }

    // Only unassigned tickets can be claimed or assigned
    if ($ticket->assignedto !== null) {
        return response()->json([
            'message' => 'This ticket is already assigned.'
        ], 409);
    }

    if ($role === 'Admin') {
        $request->validate([
            'assignedto' => [
                'required',
                'integer',
                'exists:users,id'
            ]
        ]);

        $agent = User::with('role')->find($request->assignedto);

        if (
            !$agent ||
            !$agent->role ||
            $agent->role->role !== 'IT Support Agent'
        ) {
            return response()->json([
                'message' => 'The selected user must be an IT Support Agent.'
            ], 422);
        }

        $ticket->assignedto = $agent->id;
    } else {
        // IT Support Agent claims the ticket for themselves
        $ticket->assignedto = $user->id;
    }

    $ticket->update_date = now();
    $ticket->save();

    return response()->json([
        'message' => $role === 'Admin'
            ? 'Ticket assigned successfully.'
            : 'Ticket claimed successfully.',

        'ticket' => $ticket->fresh([
            'creator',
            'assignedUser',
            'priority',
            'status',
            'category'
        ])
    ], 200);
}
}

