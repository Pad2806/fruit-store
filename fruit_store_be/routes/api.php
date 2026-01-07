<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;
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
    Route::post('{user}', [OrderController::class, 'store']);
});

Route::post('/checkout/stripe', [PaymentController::class, 'stripeCheckout']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);
