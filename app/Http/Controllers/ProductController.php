<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Lấy tất cả sản phẩm
    public function index()
    {
        $products = Product::select('id', 'name', 'price', 'image')->get()->map(function($product) {
            // Nếu image lưu path tương đối, tạo URL đầy đủ
            $product->image = asset('storage/' . $product->image); // hoặc 'images/products/' nếu lưu ở public/images/products
            // Chuyển giá về định dạng chuỗi hiển thị trên FE
            $product->price = number_format($product->price, 0, ',', '.') . 'đ';
            return $product;
        });

        return response()->json($products);
    }
}
