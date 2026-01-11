<?php

use App\Http\Controllers\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\CategoryController; 
use App\Http\Controllers\Seller\OriginController;
use App\Http\Controllers\Seller\SellerOrderController;


use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;

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
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('verify-code', [AuthController::class, 'verifyCode']);
Route::post('resend-code', [AuthController::class, 'resendCode']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::get('auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::get('/products', [HomeController::class, 'index']);
Route::get('/products/{id}', [HomeController::class, 'show']);
Route::get('/search/suggestions', [HomeController::class, 'searchSuggestions']);

Route::middleware([StartSession::class])->group(function () {
    Route::post('chatbot', [ChatBotController::class, 'chat']);
    Route::post('chatbot/reset', [ChatBotController::class, 'reset']);
});


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('users', [AuthController::class, 'getProfile']);
    Route::post('update-profile', [AuthController::class, 'updateProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum', 'role:admin']], function () {
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
});

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'role:seller']], function () {
    // Product routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/category/{categoryId}', [ProductController::class, 'getByCategory']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{id}', [ProductController::class, 'update']); 
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
    Route::get('/orders', [SellerOrderController::class, 'index']);
    Route::get('/orders/{id}', [SellerOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
    Route::delete('/orders/{id}', [SellerOrderController::class, 'destroy']);
});

Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum', 'role:user']], function () {
    // Define user routes here
    // Example: Route::get('/profile', [UserController::class, 'profile']);
    Route::get('orders', [App\Http\Controllers\User\OrderController::class, 'index']);
    Route::get('orders/{id}', [App\Http\Controllers\User\OrderController::class, 'show']);
    Route::post('orders/{id}/cancel', [App\Http\Controllers\User\OrderController::class, 'cancel']);

    Route::group(['prefix' => 'carts'], function () {
        Route::post('', [CartController::class, 'store']);
        Route::delete('{cart}', [CartController::class, 'destroy']);
        Route::get('{cart}', [CartController::class, 'show']);
    });

    Route::group(['prefix' => 'cart-items'], function () {
        Route::post('{product}', [CartItemController::class, 'store']);
        Route::put('{cartItem}', [CartItemController::class, 'updateQuantity']);
        Route::delete('{cartItem}', [CartItemController::class, 'destroy']);
    });

    Route::group(['prefix' => 'orders'], function () {
        Route::post('/confirm', [OrderController::class, 'confirm']);
        Route::post('', [OrderController::class, 'store']);
        Route::get('{order}', [OrderController::class, 'show']);
        Route::post('{order}/cancel', [OrderController::class, 'cancel']);
    });

    Route::post('/checkout/stripe', [PaymentController::class, 'stripeCheckout']);
    Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);

});













