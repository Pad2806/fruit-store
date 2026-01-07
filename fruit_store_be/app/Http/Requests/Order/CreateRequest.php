<?php

namespace App\Http\Requests\Order;

use App\Http\Requests\BaseRequest;

class CreateRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'recipient_name' => 'required|string|max:255',
            'recipient_email' => 'required|string|email|max:255',
            'recipient_address' => 'required|string|max:500',
            'recipient_city' => 'required|string|max:255',
            'recipient_ward' => 'required|string|max:255',
            'recipient_district' => 'required|string|max:255',
            'recipient_phone_number' => 'required|string|max:12',
            'payment_method' => 'required|string|in:cod,banking',
            'total_amount' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
        ];
    }
}
