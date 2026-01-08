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
        $orders = Order::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with('details')
            ->where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        return new OrderResource($order);
    }
}
