<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\OriginRequest;
use App\Http\Resources\OriginResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Origin;
use Illuminate\Support\Str;

class OriginController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 5);
        $search = $request->input('search', '');

        $query = Origin::query();

        // Search by name or description
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by created_at descending (newest first)
        $query->orderBy('created_at', 'desc');

        $origins = $query->paginate($perPage);

        return response()->json([
            'data' => OriginResource::collection($origins),
            'pagination' => [
                'current_page' => $origins->currentPage(),
                'last_page' => $origins->lastPage(),
                'per_page' => $origins->perPage(),
                'total' => $origins->total(),
                'from' => $origins->firstItem(),
                'to' => $origins->lastItem(),
            ]
        ]);
    }

    public function store(OriginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Generate unique UUID
        $uuid = $this->generateUniqueUuid();

        $origin = Origin::create([
            'id' => $uuid,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo xuất xứ thành công.',
            'data' => new OriginResource($origin)
        ], 201);
    }

    public function update(OriginRequest $request, string $id): JsonResponse
    {
        $origin = Origin::find($id);

        if (!$origin) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy xuất xứ.'
            ], 404);
        }

        $validated = $request->validated();
        $origin->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật xuất xứ thành công.',
            'data' => new OriginResource($origin)
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $origin = Origin::find($id);

        if (!$origin) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy xuất xứ.'
            ], 404);
        }

        if ($origin->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa xuất xứ vì còn sản phẩm thuộc xuất xứ này.'
            ], 422);
        }

        $origin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa xuất xứ thành công.'
        ]);
    }

    private function generateUniqueUuid(): string
    {
        $maxAttempts = 10;
        $attempts = 0;

        do {
            $uuid = (string) Str::uuid();
            $exists = Origin::where('id', $uuid)->exists();
            $attempts++;

            if ($attempts >= $maxAttempts) {
                throw new \RuntimeException('Không thể tạo UUID duy nhất sau ' . $maxAttempts . ' lần thử.');
            }
        } while ($exists);

        return $uuid;
    }
}
