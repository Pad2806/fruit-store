<?php

namespace App\Http\Requests\CartItem;

use App\Http\Requests\BaseRequest;
use Faker\Provider\Base;
use Illuminate\Foundation\Http\FormRequest;

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
            'user_id' => 'required|string|max:255',
        ];
    }
}
