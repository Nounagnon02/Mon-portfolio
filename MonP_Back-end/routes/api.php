<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\SkillController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes (for portfolio display)
Route::get('/pages/{pageName}', [PageController::class, 'show']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Dashboard Routes (Currently Public - TODO: Add Authentication)
|--------------------------------------------------------------------------
| WARNING: These routes are currently public for development.
| In production, implement proper authentication (Laravel Sanctum/Fortify)
| and move these routes back to the protected group.
*/

// Pages Management (Dashboard)
Route::get('/pages', [PageController::class, 'index']);
Route::post('/pages', [PageController::class, 'store']);
Route::put('/pages/{page}', [PageController::class, 'update']);
Route::delete('/pages/{page}', [PageController::class, 'destroy']);

// Projects Management (Dashboard)
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::put('/projects/{project}', [ProjectController::class, 'update']);
Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

// Experiences Management (Dashboard)
Route::get('/experiences/{experience}', [ExperienceController::class, 'show']);
Route::post('/experiences', [ExperienceController::class, 'store']);
Route::put('/experiences/{experience}', [ExperienceController::class, 'update']);
Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);

// Contacts Management (Dashboard)
Route::get('/contacts', [ContactController::class, 'index']);
Route::get('/contacts/{contact}', [ContactController::class, 'show']);
Route::put('/contacts/{contact}', [ContactController::class, 'update']);
Route::put('/contacts/{contact}/read', [ContactController::class, 'markAsRead']);
Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

// Skills Management (Dashboard)
Route::post('/skills', [SkillController::class, 'store']);
Route::put('/skills/{skill}', [SkillController::class, 'update']);
Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

// Image Upload (Dashboard)
Route::post('/upload-image', [ImageUploadController::class, 'upload']);
Route::delete('/delete-image', [ImageUploadController::class, 'delete']);
