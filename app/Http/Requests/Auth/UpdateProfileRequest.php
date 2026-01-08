<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'phone_number' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'dob' => 'sometimes|required|date',
            // NO email validation
            // NO password validation
        ];
    }
    
    public function messages()
    {
        return [
            'name.required' => 'Vui lòng nhập tên',
            'phone_number.required' => 'Vui lòng nhập số điện thoại',
            'address.required' => 'Vui lòng nhập địa chỉ',
            'dob.required' => 'Vui lòng nhập ngày sinh',
            'dob.date' => 'Ngày sinh phải là một ngày hợp lệ',
        ];
    }
}
