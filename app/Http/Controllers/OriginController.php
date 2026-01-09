<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\OriginRequest;
use App\Http\Resources\OriginResource;
use Illuminate\Http\JsonResponse;
use App\Models\Origin;
use Illuminate\Support\Str;

class OriginController extends Controller
{
    public function index(): JsonResponse
    {
        $origins = Origin::all();
        return response()->json([
            'data' => $origins
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
