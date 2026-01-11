<?php

namespace App\Http\Controllers\Seller;
use App\Http\Controllers\Controller;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'origin'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Products retrieved successfully',
            'data' => ProductResource::collection($products),
        ]);
    }

    public function getByCategory(string $categoryId): JsonResponse
    {
        $products = Product::with(['category', 'origin'])
            ->where('category_id', $categoryId)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Products retrieved successfully',
            'data' => ProductResource::collection($products),
        ]);
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $validated = $request->validated();


        $uuid = $this->generateUniqueUuid();

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
 
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $imagePaths[] = $path;
            }
        }

        $product = Product::create([
            'id' => $uuid,
            'name' => $validated['name'],
            'detail_desc' => $validated['detail_desc'] ?? null,
            'short_desc' => $validated['short_desc'] ?? null,
            'sold_quantity' => $validated['sold_quantity'] ?? 0,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'price' => $validated['price'],
            'origin_id' => $validated['origin_id'],
            'category_id' => $validated['category_id'],
            'unit' => $validated['unit'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'image' => json_encode($imagePaths),
        ]);


        $product->load(['category', 'origin']);

        return response()->json([
            'success' => true,
            'message' => 'Create product successfully.',
            'data' => new ProductResource($product)
        ], 201);
    }

    public function update(ProductRequest $request, string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Not found product.'
            ], 404);
        }

        $validated = $request->validated();


        $currentImages = $product->image ? json_decode($product->image, true) : [];
        

        $deleteImages = $request->input('delete_images', []);
        if (!empty($deleteImages)) {
            foreach ($deleteImages as $imagePath) {
        
                $key = array_search($imagePath, $currentImages);
                if ($key !== false) {    
                    Storage::disk('public')->delete($imagePath);

                    unset($currentImages[$key]);
                }
            }

            $currentImages = array_values($currentImages);
        }
        

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $currentImages[] = $path;
            }
        }

        $updateData = [
            'image' => json_encode($currentImages),
        ];


        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        if (isset($validated['detail_desc'])) {
            $updateData['detail_desc'] = $validated['detail_desc'];
        }
        if (isset($validated['short_desc'])) {
            $updateData['short_desc'] = $validated['short_desc'];
        }
        if (isset($validated['sold_quantity'])) {
            $updateData['sold_quantity'] = $validated['sold_quantity'];
        }
        if (isset($validated['stock_quantity'])) {
            $updateData['stock_quantity'] = $validated['stock_quantity'];
        }
        if (isset($validated['price'])) {
            $updateData['price'] = $validated['price'];
        }
        if (isset($validated['origin_id'])) {
            $updateData['origin_id'] = $validated['origin_id'];
        }
        if (isset($validated['category_id'])) {
            $updateData['category_id'] = $validated['category_id'];
        }
        if (isset($validated['unit'])) {
            $updateData['unit'] = $validated['unit'];
        }
        if (isset($validated['status'])) {
            $updateData['status'] = $validated['status'];
        }

        $product->update($updateData);
        $product->load(['category', 'origin']);

        return response()->json([
            'success' => true,
            'message' => 'Update product successfully.',
            'data' => new ProductResource($product)
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Not found product.'
            ], 404);
        }

        $product->delete(); // Soft delete

        return response()->json([
            'success' => true,
            'message' => 'Delete product successfully.'
        ]);
    }

    private function generateUniqueUuid(): string
    {
        $maxAttempts = 10;
        $attempts = 0;

        do {
            $uuid = (string) Str::uuid();
            $exists = Product::where('id', $uuid)->exists();
            $attempts++;

            if ($attempts >= $maxAttempts) {
                throw new \RuntimeException('Cannot create unique UUID after ' . $maxAttempts . ' attempts.');
            }
        } while ($exists);

        return $uuid;
    }
}

