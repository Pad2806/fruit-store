<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function origin()
    {
        return $this->belongsTo(Origin::class);
    }
}
