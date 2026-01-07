<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'name',
        'detail_desc',
        'sold_quantity',
        'stock_quantity',
        'price',
        'original_id',
        'unit',
        'status',
        'short_desc'
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id', 'id');
    }
}
