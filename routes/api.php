<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\HomeController;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


// Admin Routes
Route::group(['prefix' => 'admin', 'middleware' => ['auth:api', 'role:admin']], function () {
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
});

// Seller Routes
Route::group(['prefix' => 'seller', 'middleware' => ['auth:api', 'role:seller']], function () {
    // Define seller routes here
});

// User Routes
Route::group(['prefix' => 'user', 'middleware' => ['auth:api', 'role:user']], function () {
    // Define user routes here
    // Example: Route::get('/profile', [UserController::class, 'profile']);
});