<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str as Str;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Refund;
use Stripe\Stripe;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        DB::beginTransaction();

        try {
            // if($event->type == 'payment_intent.succeeded'){
            //     $paymentIntent = $event->data->object;
            //     $metadata = $paymentIntent->metadata;

            //     $cart = Cart::with('cartItems')
            //         ->where('user_id', $metadata->user_id)
            //         ->first();

            //     if (!$cart || $cart->cartItems->isEmpty()) {
            //         DB::commit();
            //         return response()->json(['status' => 'no cart items'], 200);
            //     }
            //     if(Order::where('payment_intent_id', $paymentIntent->id)->exists()) {
            //             DB::commit();
            //             return response()->json(['status' => 'success'], 200);
            //     }
            //     $order = Order::create([
            //             'id' => (string) Str::uuid(),
            //             'user_id' => $metadata->user_id,
            //             'payment_intent_id' => $paymentIntent->id,
            //             'total_amount' => $paymentIntent->amount,
            //             'payment_method' => 'banking',
            //             'shipping_fee' => $metadata->shipping_fee ?? 0,
            //             'recipient_name' => $metadata->recipient_name,
            //             'recipient_email' => $metadata->recipient_email,
            //             'recipient_address' => $metadata->recipient_address,
            //             'recipient_phone_number' => $metadata->recipient_phone_number,
            //             'recipient_city' => $metadata->recipient_city,
            //             'recipient_ward' => $metadata->recipient_ward,
            //             'recipient_district' => $metadata->recipient_district,
            //             'status' => 'completed',
            //     ]);

            //     foreach ($cart->cartItems as $cartItem) {
            //             $product = Product::lockForUpdate()
            //                 ->where('id', $cartItem->product_id)
            //                 ->first();

            //             if (!$product) {
            //                 throw new Exception('Product not found');
            //             }

            //             if ($product->stock_quantity < $cartItem->quantity) {
            //                 throw new Exception("Not enough stock for: " . $product->name);
            //             }

            //             $product->decrement('stock_quantity', $cartItem->quantity);
            //             $product->increment('sold_quantity', $cartItem->quantity);

            //             $order->orderDetails()->create([
            //                 'id' => (string) Str::uuid(),
            //                 'product_id' => $cartItem->product_id,
            //                 'product_name' => $cartItem->product_name,
            //                 'product_price' => $cartItem->product_price,
            //                 'quantity' => $cartItem->quantity,
            //                 'unit'=> $cartItem->unit,
            //                 'total_price' => $cartItem->product_price * $cartItem->quantity
            //             ]);
            //     }

            //     $cart->cartItems()->delete();
            // }

            if($event->type == 'payment_intent.payment_failed' || $event->type == 'charge.refunded')
            {
                $charge = $event->data->object;
                $order = Order::where('payment_intent_id', $charge->payment_intent)->first();

                if(!$order){
                    Log::warning('Order not found for refunded/failed payment', [
                        'payment_intent' => $charge->payment_intent
                    ]);
                    DB::commit();
                    return response()->json(['status' => 'no order found'], 200);
                }
                $order->status = 'cancelled';
                $order->save();

                foreach($order->orderDetails as $orderDetail){
                    $product = Product::find($orderDetail->product_id);
                    if($product){
                        $product->increment('stock_quantity', $orderDetail->quantity);
                        $product->decrement('sold_quantity', $orderDetail->quantity);
                    }
                }
                Log::info('Stripe refund processed', [
                            'order_id' => $order->id,
                            'refunded_amount' => $charge->amount_refunded
                        ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            if(isset($paymentIntent) && $paymentIntent->status == 'succeeded'){
                Stripe::setApiKey(config('services.stripe.secret'));
                Refund::create([
                    'payment_intent' => $paymentIntent->id,
                ]);
            }
            Log::error('Stripe webhook error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }

        // if ($event->type == 'payment_intent.succeeded') {

        //     $paymentIntent = $event->data->object;
        //     $metadata = $paymentIntent->metadata;

        //     DB::beginTransaction();
        //     try {
        //         $cart = Cart::with('cartItems')
        //             ->where('user_id', $metadata->user_id)
        //             ->first();
        //         if (!$cart || $cart->cartItems->isEmpty()) {
        //             DB::commit();
        //             return response()->json(['status' => 'no cart items'], 200);
        //         }

        //         if(Order::where('payment_intent_id', $paymentIntent->id)->exists()) {
        //                 DB::commit();
        //                 return response()->json(['status' => 'success'], 200);
        //         }

        //         $order = Order::create([
        //                 'id' => (string) Str::uuid(),
        //                 'user_id' => $metadata->user_id,
        //                 'payment_intent_id' => $paymentIntent->id,
        //                 'total_amount' => $paymentIntent->amount,
        //                 'payment_method' => 'banking',
        //                 'shipping_fee' => $metadata->shipping_fee ?? 0,
        //                 'recipient_name' => $metadata->recipient_name,
        //                 'recipient_email' => $metadata->recipient_email,
        //                 'recipient_address' => $metadata->recipient_address,
        //                 'recipient_phone_number' => $metadata->recipient_phone_number,
        //                 'recipient_city' => $metadata->recipient_city,
        //                 'recipient_ward' => $metadata->recipient_ward,
        //                 'recipient_district' => $metadata->recipient_district,
        //                 'status' => 'completed',
        //         ]);

        //         foreach ($cart->cartItems as $cartItem) {

        //             Stripe::setApiKey(config('services.stripe.secret'));

        //                 $product = Product::lockForUpdate()
        //                     ->where('id', $cartItem->product_id)
        //                     ->first();

        //                 if (!$product) {
        //                     throw new Exception('Product not found');
        //                 }

        //                 if ($product->stock_quantity < $cartItem->quantity) {
        //                     throw new Exception("Not enough stock for: " . $product->name);
        //                 }

        //                 $product->decrement('stock_quantity', $cartItem->quantity);
        //                 $product->increment('sold_quantity', $cartItem->quantity);

        //                 $order->orderDetails()->create([
        //                     'id' => (string) Str::uuid(),
        //                     'product_id' => $cartItem->product_id,
        //                     'product_name' => $cartItem->product_name,
        //                     'product_price' => $cartItem->product_price,
        //                     'quantity' => $cartItem->quantity,
        //                     'unit'=> $cartItem->unit,
        //                     'total_price' => $cartItem->product_price * $cartItem->quantity
        //                 ]);
        //         }

        //         $cart->cartItems()->delete();

        //         DB::commit();
        //     } catch (Exception $e) {
        //         Log::error('Stripe webhook error', [
        //             'message' => $e->getMessage(),
        //             'trace' => $e->getTraceAsString()
        //         ]);
        //         DB::rollBack();
        //         return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        //     }
        // }
        return response()->json(['status' => 'success'], 200);
    }

}
