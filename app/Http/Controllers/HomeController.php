<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('status', 'active');

        switch ($request->get('sort')) {
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

        $limit  = (int) $request->get('limit', max(10, 100));
        $offset = (int) $request->get('offset', 0);

        $products = $query
            ->offset($offset)
            ->limit($limit)
            ->get();

        $data = $products->map(function ($product) {
            // Parse images from JSON string using raw attribute to bypass accessor
            $images = [];
            $rawImage = $product->getRawOriginal('image');
            
            if ($rawImage) {
                $decoded = json_decode($rawImage, true);
                if (is_array($decoded)) {
                    $images = array_map(fn($img) => asset('storage/' . $img), $decoded);
                }
            }
            
            return [
                'id'     => $product->id,
                'name'   => $product->name,
                'price'  => number_format($product->price, 0, ',', '.') . 'đ',
                'images' => $images,
            ];
        });

        return response()->json([
            'data'  => $data,
            'count' => $data->count()
        ]);
    }


    public function show($id)
    {
        $product = Product::where('status', 'active')
            ->where('id', $id)
            ->firstOrFail();

        $images = [];
        $rawImage = $product->getRawOriginal('image');

        if ($rawImage) {
            $decoded = json_decode($rawImage, true);
            if (is_array($decoded)) {
                $images = $decoded;
            } else {
                $images = explode(',', $rawImage);
            }

            $images = array_slice($images, 0, 5);
            $images = array_map(fn($img) => asset('storage/' . trim($img)), $images);
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
                // Get first image from JSON array using raw attribute
                $firstImage = null;
                $rawImage = $p->getRawOriginal('image');
                
                if ($rawImage) {
                    $decoded = json_decode($rawImage, true);
                    if (is_array($decoded) && count($decoded) > 0) {
                        $firstImage = asset('storage/' . $decoded[0]);
                    }
                }
                
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'image' => $firstImage,
                ];
            });
    }
}
