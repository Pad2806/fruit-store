<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $orders = Order::with(['details.product'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with(['details.product'])
            ->where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        return new OrderResource($order);
    }
    public function cancel($id)
    {
        $order = Order::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Order is already cancelled'], 400);
        }

        // Check if created_at is within 10 minutes
        // Use false to get signed value. If created_at is in future (negative diff), we allow it.
        // We only block if now is MORE than 10 minutes AFTER created_at.
        if ($order->created_at->diffInMinutes(now(), false) > 10) {
            return response()->json(['message' => 'Cannot cancel order after 10 minutes'], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Order cancelled successfully']);
    }
}
