<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_price' => $this->product_price,
            'product_image' => $this->product ? $this->product->image : null,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
            'total_price' => $this->total_price,
        ];
    }
}
