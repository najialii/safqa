<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);



Route::apiResource('items', ItemController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('safqas', SafqaController::class);

Route::get('/safqas/sent', [SafqaController::class, 'sent']);
Route::get('/safqas/received', [SafqaController::class, 'received']);
Route::post('/safqas/{id}/accept', [SafqaController::class, 'accept']);
Route::post('/safqas/{id}/reject', [SafqaController::class, 'reject']);
