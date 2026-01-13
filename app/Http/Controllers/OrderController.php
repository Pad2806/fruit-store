<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CreateRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
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
    public function store(CreateRequest $request)
    {
       $data = $request->validated();
       $cart = Cart::where('user_id', $data['user_id'])->first();

       if (!$cart) {
           return response()->json(['message' => 'Cart not found.'], 404);
       }

       if($cart->cartItems->isEmpty()) {
           return response()->json(['message' => 'Cart is empty.'], 400);
       }

       $data['id'] = (string) Str::uuid();

       if($data['payment_method'] === 'cod') {
           $data['status'] = 'pending';
           $data['payment_status'] = 'pending';
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

            $cart = Cart::with('cartItems')->where('user_id', $metadata->user_id)->first();

            if(!$cart || $cart->cartItems->isEmpty()) {
                return response()->json(['status'=>'cancelled','message'=>'Cart empty'],200);
            }

            $order = Order::where('payment_intent_id',$paymentIntentId)->first();
            if($order){
                return response()->json(['status'=>$order->status,'order_id'=>$order->id],200);
            }

            DB::beginTransaction();

            $order = Order::create([
                        'id' => (string) Str::uuid(),
                        'user_id' => $metadata->user_id,
                        'payment_intent_id' => $paymentIntent->id,
                        'total_amount' => $paymentIntent->amount,
                        'payment_method' => 'banking',
                        'payment_status' => 'paid',
                        'shipping_fee' => $metadata->shipping_fee ?? 0,
                        'recipient_name' => $metadata->recipient_name,
                        'recipient_email' => $metadata->recipient_email,
                        'recipient_address' => $metadata->recipient_address,
                        'recipient_phone_number' => $metadata->recipient_phone_number,
                        'recipient_city' => $metadata->recipient_city,
                        'recipient_ward' => $metadata->recipient_ward,
                        'recipient_district' => $metadata->recipient_district,
                        'note' => $metadata->note,
                        'datetime_order' => $metadata->datetime_order ?? now()->toString(),
                        'status' => 'confirmed',
            ]);

            $this->createOrderDetailsFromCart($order, $cart);
            DB::commit();

            return response()->json(['status'=>'completed','order_id'=>$order->id],200);

        } catch(Exception $e){
            DB::rollBack();
            if(isset($paymentIntent) && $paymentIntent->status==='succeeded'){
                \Stripe\Refund::create(['payment_intent'=>$paymentIntentId]);
            }
            return response()->json(['status'=>'refunded','message'=>$e->getMessage()],200);
        }
    }

    public function show(Order $order)
    {
        $order = Order::where('id', $order->id)
            ->with('orderDetails')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json($order, 200);
    }

    public function cancel(Order $order)
    {
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Order is already cancelled.'], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Order cancelled successfully.'], 200);
    }

    protected function createOrderDetailsFromCart(Order $order,Cart $cart)
    {
        foreach ($cart->cartItems as $cartItem) {

           $product = Product::lockForUpdate()->find($cartItem->product_id);

            if(!$product){
                throw new Exception('Product not found');
            }

            if($product->stock_quantity < $cartItem->quantity){
                throw new Exception("Not enough stock for {$product->name}");
            }

            $product->decrement('stock_quantity',$cartItem->quantity);
            $product->increment('sold_quantity',$cartItem->quantity);

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

