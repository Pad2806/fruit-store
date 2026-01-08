<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyCodeRequest extends FormRequest
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
            'code' => 'required|numeric|digits:6',
            'email' => 'required|string|max:255|email',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Vui lòng nhập mã xác nhận',
            'code.numeric' => 'Mã xác nhận phải là số',
            'code.digits' => 'Mã xác nhận phải có 6 chữ số',
            'email.required' => 'Vui lòng nhập email',
            'email.email' => 'Email không hợp lệ',
        ];
    }
}
