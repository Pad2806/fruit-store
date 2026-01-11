<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'name',
        'detail_desc',
        'sold_quantity',
        'stock_quantity',
        'price',
        'origin_id',
        'category_id',
        'unit',
        'image',
        'status',
        'short_desc',
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id', 'id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
    public function origin()
    {
        return $this->belongsTo(Origin::class, 'origin_id', 'id');
    }

}
