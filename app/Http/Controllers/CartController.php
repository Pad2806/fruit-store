<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function show()
    {
        if(!Auth::check()){
            return response([
                'message' => 'Unauthenticated'
            ], 401);
        }
 
 
        $cart = Cart::where('user_id', Auth::id())
        ->with('cartItems.product')
        ->withCount('cartItems')
        ->first();
        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user.'], 404);
        }
        return $cart;
    }
 
    public function store()
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
 
        $data = [
            'id' => (string) Str::uuid(),
            'user_id'=> Auth::id()
        ];
        $cart = Cart::create($data);
 
        return new CartResource($cart);
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cart->delete();

        return response()->json([
            'message' => 'Cart deleted successfully'
        ]);
    }
}
