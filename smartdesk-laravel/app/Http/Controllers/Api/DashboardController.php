<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->load('role');

        $query = Ticket::query();

        // Role-based filtering
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

        $tickets = (clone $query)->get();

        $openId = Status::where('status', 'Open')->value('id');
        $closedId = Status::where('status', 'Closed')->value('id');

        return response()->json([

            'statistics' => [

                'open' => $tickets->where('statusid', $openId)->count(),

                'assigned' => $tickets->whereNotNull('assignedto')->count(),

                'closed' => $tickets->where('statusid', $closedId)->count(),

                'total' => $tickets->count(),

            ],

            'recentTickets' => (clone $query)
                ->with([
                    'priority',
                    'status',
                    'category',
                    'creator',
                    'assignedUser'
                ])
                ->latest('creation_date')
                ->take(5)
                ->get()

        ]);
    }
}