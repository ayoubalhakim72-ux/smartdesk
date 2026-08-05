<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')
            ->orderBy('firstname')
            ->orderBy('id')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function roles()
    {
        return response()->json(
            Role::query()->orderBy('role')->get(['id', 'role'])
        );
    }

    public function show($id)
    {
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'roleid' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $user = User::create([
            'firstname' => $validated['firstname'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'roleid' => $validated['roleid'],
            'creationdate' => now(),
            'isbanned' => false,
            'banreason' => null,
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user->load('role'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json([
                'message' => 'Use the Profile page to update your own account.',
            ], 403);
        }

        $validated = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'roleid' => ['required', 'integer', 'exists:roles,id'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->fill([
            'firstname' => $validated['firstname'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'roleid' => $validated['roleid'],
        ]);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->tokens()->delete();
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->load('role'),
        ]);
    }

    public function setBan(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json([
                'message' => 'You cannot ban your own account.',
            ], 403);
        }

        $validated = $request->validate([
            'isbanned' => ['required', 'boolean'],
            'banreason' => ['nullable', 'string', 'max:500'],
        ]);

        $user->isbanned = $validated['isbanned'];
        $user->banreason = $validated['isbanned']
            ? ($validated['banreason'] ?? null)
            : null;
        $user->save();

        if ($user->isbanned) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->isbanned
                ? 'User banned successfully.'
                : 'User unbanned successfully.',
            'user' => $user->load('role'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        $hasRelatedTicketData = DB::table('tickets')
            ->where('createdby', $user->id)
            ->orWhere('assignedto', $user->id)
            ->exists()
            || DB::table('ticket_comments')->where('userid', $user->id)->exists()
            || DB::table('ticket_attachments')->where('userid', $user->id)->exists()
            || DB::table('notifications')->where('userid', $user->id)->exists()
            || DB::table('tickets_history')
                ->where('assignedby', $user->id)
                ->orWhere('assignedto', $user->id)
                ->exists()
            || DB::table('activity_logs')->where('user_id', $user->id)->exists();

        if ($hasRelatedTicketData) {
            return response()->json([
                'message' => 'This account has related ticket data and cannot be deleted. Ban it instead to preserve the ticket history.',
            ], 409);
        }

        try {
            DB::transaction(function () use ($user) {
                $user->tokens()->delete();
                $user->delete();
            });
        } catch (QueryException $exception) {
            if ((string) $exception->getCode() === '23000') {
                return response()->json([
                    'message' => 'This account has related ticket data and cannot be deleted. Ban it instead to preserve the ticket history.',
                ], 409);
            }

            throw $exception;
        }

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
