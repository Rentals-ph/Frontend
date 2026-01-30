<?php

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/properties/featured', [PropertyController::class, 'featured']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Protected property routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
});

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);

// Agent routes
Route::post('/agents/register', [AgentController::class, 'register']);
Route::post('/agents/login', [AgentController::class, 'login']);
Route::post('/auth/login', [AgentController::class, 'login']); // Alias for frontend compatibility
Route::middleware('auth:sanctum')->get('/agents/me', [AgentController::class, 'show']);

// Admin routes
Route::post('/admin/login', [AdminController::class, 'login']);

// Admin routes (protected by authentication)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Agent management
    Route::get('/agents', [AdminController::class, 'getAllAgents']);
    Route::get('/agents/pending', [AdminController::class, 'getPendingAgents']);
    Route::get('/agents/{id}', [AdminController::class, 'getAgentDetails']);
    Route::post('/agents/{id}/approve', [AdminController::class, 'approveAgent']);
    Route::post('/agents/{id}/reject', [AdminController::class, 'rejectAgent']);
    
    // User CRUD
    Route::get('/users', [AdminController::class, 'getAllUsers']);
    Route::get('/users/{id}', [AdminController::class, 'getUserDetails']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
});

