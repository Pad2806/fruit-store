<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'user_id',
        'recipient_name',
        'recipient_phone_number',
        'recipient_email',
        'recipient_address',
        'recipient_city',
        'recipient_district',
        'recipient_ward',
        'payment_intent_id',
        'payment_method',
        'payment_status',
        'datetime_order',
        'total_amount',
        'shipping_fee',
        'status',
        'note',
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'id');
    }

    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
