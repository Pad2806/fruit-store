<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OriginController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/category/{categoryId}', [ProductController::class, 'getByCategory']);
Route::post('/products', [ProductController::class, 'store']);
Route::post('/products/{id}', [ProductController::class, 'update']); // Use POST for file upload
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

//category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Origin routes
Route::get('/origins', [OriginController::class, 'index']);
Route::post('/origins', [OriginController::class, 'store']);
Route::put('/origins/{id}', [OriginController::class, 'update']);
Route::delete('/origins/{id}', [OriginController::class, 'destroy']);

// Order routes
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
