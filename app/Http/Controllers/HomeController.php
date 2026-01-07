<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::select('id', 'name', 'price', 'image')->get()->map(function($product) {
            $product->image = asset('storage/' . $product->image); 
            $product->price = number_format($product->price, 0, ',', '.') . 'đ';
            return $product;
        });

        return response()->json($products);
    }
}
