<?php

namespace App\Http\Requests\Admin\User;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends BaseRequest
{
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
            'role' => 'sometimes|required|string|exists:roles,name',
        ];
    }

    public function message()
    {
        return [
            'name.required' => 'Vui lòng nhập tên',
            'phone_number.required' => 'Vui lòng nhập số điện thoại',
            'address.required' => 'Vui lòng nhập địa chỉ',
            'dob.required' => 'Vui lòng nhập ngày sinh',
            'dob.date' => 'Ngày sinh phải là một ngày hợp lệ',
            'role.required' => 'Vui lòng chọn vai trò',
            'role.exists' => 'Vai trò không hợp lệ',
        ];
    }
}
