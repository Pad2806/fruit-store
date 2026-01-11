<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // Parse images from JSON string to array
        $images = $this->image ? json_decode($this->image, true) : [];
        
        // Ensure $images is always an array
        if (!is_array($images)) {
            $images = [];
        }
        
        // Convert relative paths to full URLs
        $imageUrls = array_map(function ($path) {
            return asset('storage/' . $path);
        }, $images);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_desc' => $this->short_desc,
            'detail_desc' => $this->detail_desc,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'sold_quantity' => $this->sold_quantity,
            'unit' => $this->unit,
            'status' => $this->status,
            'images' => $imageUrls,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'origin' => new OriginResource($this->whenLoaded('origin')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
