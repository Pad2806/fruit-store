<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'recipient_name' => $this->recipient_name,
            'recipient_phone_number' => $this->recipient_phone_number,
            'total_products' => $this->total_products ?? 0,
            'total_quantity' => (int) ($this->total_quantity ?? 0),
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'datetime_order' => $this->datetime_order,
        ];
    }
}
