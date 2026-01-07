<?php

namespace App\Http\Requests\Admin\User;

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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'dob' => 'required|date',
            'role' => 'required|string|exists:roles,name',
        ];
    }

    public function message()
    {
        return [
            'name.required' => 'Vui lòng nhập tên',
            'email.required' => 'Vui lòng nhập email',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
            'password.confirmed' => 'Mật khẩu không khớp',
            'phone_number.required' => 'Vui lòng nhập số điện thoại',
            'address.required' => 'Vui lòng nhập địa chỉ',
            'dob.required' => 'Vui lòng nhập ngày sinh',
            'dob.date' => 'Ngày sinh phải là một ngày hợp lệ',
            'role.required' => 'Vui lòng chọn vai trò',
            'role.exists' => 'Vai trò không hợp lệ',
        ];
    }
}
