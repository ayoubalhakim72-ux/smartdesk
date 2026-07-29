<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PriorityController;
// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::get('/dashboard', [DashboardController::class, 'index']);
    // Tickets
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    Route::put('/tickets/{id}/assign', [TicketController::class, 'assign']);

    Route::get('/priorities', [PriorityController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::put('/tickets/{id}', [TicketController::class, 'update']);
});

// Admin test
Route::middleware(['auth:sanctum', 'role:Admin'])->get('/admin-test', function () {
    return response()->json([
        'message' => 'Welcome Admin!'
    ]);
});