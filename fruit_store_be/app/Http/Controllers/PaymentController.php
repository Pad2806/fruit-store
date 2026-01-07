<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\Charge;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function stripeCheckout(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|max:255',
            'total_amount' => 'sometimes|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'recipient_name' => 'required|string|max:255',
            'recipient_email' => 'required|email|max:255',
            'recipient_address' => 'required|string|max:500',
            'recipient_phone_number' => 'required|string|max:11',
            'recipient_city' => 'required|string|max:100',
            'recipient_ward' => 'required|string|max:100',
            'recipient_district' => 'required|string|max:100',
        ]);

        $cart = Cart::where('user_id', $request->user_id)->first();

        if(!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty or does not exist.'], 400);
        }
        $totalAmount = $cart->cartItems->sum(fn($item) =>
            $item->product_price * $item->quantity
        );

        Stripe::setApiKey(config('services.stripe.secret'));

         $paymentIntent = PaymentIntent::create([
                'amount' => (int)$totalAmount,
                'currency' => 'vnd',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'user_id' => $request->user_id,
                    'recipient_name' => $request->recipient_name,
                    'recipient_email' => $request->recipient_email,
                    'recipient_address' => $request->recipient_address,
                    'recipient_phone_number' => $request->recipient_phone_number,
                    'recipient_city' => $request->recipient_city,
                    'recipient_ward' => $request->recipient_ward,
                    'recipient_district' => $request->recipient_district,
                    'shipping_fee' => (string)$request->shipping_fee ?? 0,
                ],
        ]);

        return response()->json([
            'status' => 'success',
            'id' => $paymentIntent->id,
            'client_secret' => $paymentIntent->client_secret
        ], 200);
    }
}
