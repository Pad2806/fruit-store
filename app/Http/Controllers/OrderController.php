<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderShowResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $orders = Order::withCount('details as total_products')
            ->withSum('details as total_quantity', 'quantity')
            ->orderBy('datetime_order', 'desc')
            ->get();

        return OrderResource::collection($orders)->additional([
            'success' => true,
            'message' => 'Orders retrieved successfully',
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with('details')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order retrieved successfully',
            'data' => new OrderShowResource($order),
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $request->validate([
            'status' => 'required|string|in:pending,confirmed,shipping,completed,cancelled',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
            ],
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }
}
