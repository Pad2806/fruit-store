<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id',
        'user_id',
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'cart_id', 'id');
    }
}
