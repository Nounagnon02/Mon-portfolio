<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PagsController;
use App\Http\Controllers\ProjetctsController;
use App\Http\Controllers\ContactsController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::get('/pages/{pageName}', [PageController::class, 'show']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pages', [PageController::class, 'store']);
    Route::put('/pages/{page}', [PageController::class, 'update']);
    
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::put('/contacts/{contact}/read', [ContactController::class, 'markAsRead']);
});

Route::apiResource('pags', PagsController::class);
Route::get('pags/name/{name}', [PagsController::class, 'show']);
Route::apiResource('projetcts', ProjetctsController::class);
Route::apiResource('contactss', ContactsController::class);

// Image upload routes
Route::post('/upload-image', [App\Http\Controllers\ImageUploadController::class, 'upload']);
Route::delete('/delete-image', [App\Http\Controllers\ImageUploadController::class, 'delete']);
