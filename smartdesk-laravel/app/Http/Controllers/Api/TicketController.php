<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Models\Ticket;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateTicketRequest;

class TicketController extends Controller
{
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
        case 'Manager':
            break;

        case 'Employee':
            $query->where('createdby', $user->id);
            break;

        case 'IT Support Agent':
            $query->where('assignedto', $user->id);
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

    if (request()->filled('from')) {
        $query->whereDate('creation_date', '>=', request('from'));
    }

    if (request()->filled('to')) {
        $query->whereDate('creation_date', '<=', request('to'));
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
public function assign(UpdateTicketRequest $request, $id)
{
    $user = Auth::user();
    $user->load('role');

    if(!in_array($user->role->role,['Admin','IT Support Agent'])){

        return response()->json([
            'message'=>'Unauthorized.'
        ],403);

    }

    $ticket = Ticket::find($id);

    if(!$ticket){

        return response()->json([
            'message'=>'Ticket not found.'
        ],404);

    }

    if($user->role->role == 'Admin'){

        $ticket->assignedto = $request->assignedto;

    }else{

        $ticket->assignedto = $user->id;

    }

    $ticket->update_date = now();

    $ticket->save();

    return response()->json([

        'message'=>'Ticket assigned successfully.',

        'ticket'=>$ticket->fresh([
            'creator',
            'assignedUser',
            'priority',
            'status',
            'category'
        ])

    ]);
}
}

