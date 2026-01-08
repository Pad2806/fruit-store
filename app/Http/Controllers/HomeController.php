<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function todayProducts(Request $request)
    {
        $query = Product::where('status', 'active');

        // SORT
        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $limit = $request->get('limit', 6);

        $products = $query
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image' => asset('storage/products/' . $product->image),
                ];
            });

        return response()->json([
            'data' => $products
        ]);
    }


    public function show($id)
    {
        $product = Product::where('status', 'active')
            ->where('id', $id)
            ->firstOrFail();

        $images = [];

        if ($product->image) {
            $decoded = json_decode($product->image, true);
            if (is_array($decoded)) {
                $images = $decoded;
            } else {
                $images = explode(',', $product->image);
            }

            $images = array_slice($images, 0, 5);
            $images = array_map(fn($img) => asset('storage/products/' . trim($img)), $images);
        }

        $mainImage = $images[0] ?? null;
        $subImages = array_slice($images, 1); 

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'main_image' => $mainImage,
            'sub_images' => $subImages,
            'short_desc' => $product->short_desc,
            'detail_desc' => $product->detail_desc,
            'unit' => $product->unit,
            'in_stock' => $product->stock_quantity > 0,
        ]);
    }

    public function searchSuggestions(Request $request)
    {
        $keyword = $request->keyword;

        if (!$keyword) {
            return response()->json([]);
        }

        return Product::where('status', 'active')
            ->where('name', 'LIKE', "%$keyword%")
            ->select('id', 'name', 'image')
            ->limit(6)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'image' => asset('storage/products/' . $p->image),
                ];
            });
    }


}
