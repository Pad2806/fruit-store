<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\CreateRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Support\Str;

class CartController extends Controller
{
    function show(Cart $cart)
    {
        $cart = Cart::where('id', $cart->id)
        ->with('cartItems.product')
        ->withCount('cartItems')
        ->first();
        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user.'], 404);
        }
        return $cart;
    }

    public function store(CreateRequest $request)
    {
        $data = $request->validated();
        $data['id'] = (string) Str::uuid();
        $cart = Cart::create($data);

        return new CartResource($cart);
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();
        return response()->json(['message' => 'Cart deleted successfully.'], 200);
    }

}
