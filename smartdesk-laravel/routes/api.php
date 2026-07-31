<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PriorityController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\TicketCommentController;

// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Tickets
    Route::get('/agents', [TicketController::class, 'agents']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    Route::put('/tickets/{id}/assign', [TicketController::class, 'assign']);
    Route::put('/tickets/{id}/close', [TicketController::class, 'close']);
    Route::put('/tickets/{id}/return', [TicketController::class, 'returnTicket']);
    Route::get('/tickets/{ticketId}/comments', [TicketCommentController::class, 'index']);
    Route::post('/tickets/{ticketId}/comments', [TicketCommentController::class, 'store']);

    // Ticket form and filter options
    Route::get('/priorities', [PriorityController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/statuses', [StatusController::class, 'index']);
});

// Admin test
Route::middleware(['auth:sanctum', 'role:Admin'])->get('/admin-test', function () {
    return response()->json([
        'message' => 'Welcome Admin!'
    ]);
});
