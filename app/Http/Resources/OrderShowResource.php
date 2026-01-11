<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderShowResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'recipient_name' => $this->recipient_name,
            'recipient_email' => $this->recipient_email,
            'recipient_phone_number' => $this->recipient_phone_number,
            'recipient_address' => $this->recipient_address,
            'recipient_city' => $this->recipient_city,
            'recipient_district' => $this->recipient_district,
            'recipient_ward' => $this->recipient_ward,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'total_amount' => $this->total_amount,
            'shipping_fee' => $this->shipping_fee,
            'status' => $this->status,
            'note' => $this->note,
            'datetime_order' => $this->datetime_order,
            'details' => OrderDetailResource::collection($this->whenLoaded('details')),
        ];
    }
}
