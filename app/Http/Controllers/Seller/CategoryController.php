<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 5);
        $search = $request->input('search', '');

        $query = Category::query();

        // Search by name or description
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by created_at descending (newest first)
        $query->orderBy('created_at', 'desc');

        $categories = $query->paginate($perPage);

        return response()->json([
            'data' => CategoryResource::collection($categories),
            'pagination' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'from' => $categories->firstItem(),
                'to' => $categories->lastItem(),
            ]
        ]);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Generate unique UUID
        $uuid = $this->generateUniqueUuid();

        $category = Category::create([
            'id' => $uuid,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh mục thành công.',
            'data' => new CategoryResource($category)
        ], 201);
    }

    public function update(CategoryRequest $request, string $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục.'
            ], 404);
        }

        $validated = $request->validated();
        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công.',
            'data' => new CategoryResource($category)
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục.'
            ], 404);
        }

        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa danh mục vì còn sản phẩm thuộc danh mục này.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công.'
        ]);
    }

    private function generateUniqueUuid(): string
    {
        $maxAttempts = 10;
        $attempts = 0;

        do {
            $uuid = (string) Str::uuid();
            $exists = Category::where('id', $uuid)->exists();
            $attempts++;

            if ($attempts >= $maxAttempts) {
                throw new \RuntimeException('Không thể tạo UUID duy nhất sau ' . $maxAttempts . ' lần thử.');
            }
        } while ($exists);

        return $uuid;
    }
}
