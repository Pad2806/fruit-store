<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Get all products.
     *
     * @return JsonResponse
     */
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

        // Generate unique UUID
        $uuid = $this->generateUniqueUuid();

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Generate unique filename
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                // Store image in storage/app/public/products
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
            'image' => json_encode($imagePaths), // Store as JSON
        ]);

        // Load relationships for response
        $product->load(['category', 'origin']);

        return response()->json([
            'success' => true,
            'message' => 'Tạo sản phẩm thành công.',
            'data' => new ProductResource($product)
        ], 201);
    }

    public function update(ProductRequest $request, string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm.'
            ], 404);
        }

        $validated = $request->validated();

        // Handle image management
        $currentImages = $product->image ? json_decode($product->image, true) : [];
        
        // Delete specific images if requested
        $deleteImages = $request->input('delete_images', []);
        if (!empty($deleteImages)) {
            foreach ($deleteImages as $imagePath) {
                // Find and remove from array
                $key = array_search($imagePath, $currentImages);
                if ($key !== false) {
                    // Delete file from storage
                    Storage::disk('public')->delete($imagePath);
                    // Remove from array
                    unset($currentImages[$key]);
                }
            }
            // Re-index array
            $currentImages = array_values($currentImages);
        }
        
        // Add new images if uploaded
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $currentImages[] = $path;
            }
        }

        // Build update data
        $updateData = [
            'image' => json_encode($currentImages),
        ];

        // Only update fields that are provided
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
            'message' => 'Cập nhật sản phẩm thành công.',
            'data' => new ProductResource($product)
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm.'
            ], 404);
        }

        $product->delete(); // Soft delete

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công.'
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
                throw new \RuntimeException('Không thể tạo UUID duy nhất sau ' . $maxAttempts . ' lần thử.');
            }
        } while ($exists);

        return $uuid;
    }
}

