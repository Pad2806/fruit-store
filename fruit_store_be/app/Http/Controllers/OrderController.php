<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CreateRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Exception;
use Faker\Provider\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class OrderController extends Controller
{
    public function store(CreateRequest $request, User $user)
    {
       $data = $request->validated();
       $cart = Cart::where('user_id', $user->id)->first();

       if (!$cart) {
           return response()->json(['message' => 'Cart not found.'], 404);
       }

       if($cart->cartItems->isEmpty()) {
           return response()->json(['message' => 'Cart is empty.'], 400);
       }

       $data['id'] = (string) Str::uuid();
       $data['user_id'] = $user->id;

       if($data['payment_method'] === 'banking') {
           DB::transaction(function () use ($cart, $data, &$order) {
               $data['status'] = 'pending';
               $order = Order::create($data);
                $this->createOrderDetailsFromCart($order, $cart);

                $paymentSuccessful = true;
                if(!$paymentSuccessful) {
                    throw new \Exception('Payment failed.');
                }
               // Here you can add additional logic for banking payment processing if needed
               // if payment successful, update order status
               // $order->status = 'processing';
               // $order->save();
               // if payment fails, you can throw an exception to rollback the transaction
               // delete the order and order details created above
           });
       }else {
           $data['status'] = 'pending';
           $order = Order::create($data);
           $this->createOrderDetailsFromCart($order, $cart);
       }

       return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order->load('orderDetails')
        ], 201);
    }

    public function confirm(Request $request)
    {
       $paymentIntentId = $request->payment_intent_id;
       Stripe::setApiKey(config('services.stripe.secret'));

       try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            $metadata = $paymentIntent->metadata;
            $order = Order::where('payment_intent_id', $paymentIntentId)->first();
            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not created.'
                ], 404);
            }
            return response()->json([
                'status' => $order->status,
                'message' => 'Order created successfully.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    protected function createOrderDetailsFromCart(Order $order,Cart $cart)
    {
        foreach ($cart->cartItems as $cartItem) {
            $order->orderDetails()->create([
                'id' => (string) Str::uuid(),
                'product_id' => $cartItem->product_id,
                'product_name' => $cartItem->product_name,
                'product_price' => $cartItem->product_price,
                'quantity' => $cartItem->quantity,
                'unit' => $cartItem->unit,
                'total_price' => (float) $cartItem->product_price * $cartItem->quantity,
            ]);
        }

        $cart->cartItems()->delete();
    }

}
