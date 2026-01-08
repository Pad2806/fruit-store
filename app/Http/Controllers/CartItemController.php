<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItem\CreateRequest;
use App\Http\Requests\CartItem\UpdateRequest;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Str;

class CartItemController extends Controller
{
    function store(Product $product, CreateRequest $request)
    {
        $data = $request->validated();
        $cart = Cart::firstOrCreate(
            ['user_id' => $data['user_id']],
            ['id' => (string) Str::uuid()]
        );

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            return $this->updateQuantityInternal($cartItem, $cartItem->quantity + 1);
        }

        $cartItemData = [
            'id' => (string) Str::uuid(),
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_price' => $product->price,
            'quantity' => 1,
            'unit' => $product->unit,
        ];
        $cartItem =CartItem::create($cartItemData);

        return new CartItemResource($cartItem);
    }

    function updateQuantity(CartItem $cartItem, UpdateRequest $request)
    {
        $data = $request->validated();

        return $this->updateQuantityInternal($cartItem, $data['quantity']);
    }

    function updateQuantityInternal(CartItem $cartItem, int $quantity)
    {
        $cartItem->quantity = $quantity;
        $cartItem->save();

        return new CartItemResource($cartItem);
    }

    function destroy(CartItem $cartItem)
    {
        $cartItem->delete();
        return response()->json(['message' => 'Cart item deleted successfully.'], 200);
    }
}
