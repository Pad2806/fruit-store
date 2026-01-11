<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OriginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'description' => 'nullable|string|max:1000',
        ];

        // Nếu là POST (create) thì name bắt buộc
        // Nếu là PUT/PATCH (update) thì name chỉ bắt buộc khi có truyền vào
        if ($this->isMethod('POST')) {
            $rules['name'] = 'required|string|max:255';
        } else {
            $rules['name'] = 'sometimes|required|string|max:255';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên xuất xứ là bắt buộc.',
            'name.max' => 'Tên xuất xứ không được vượt quá 255 ký tự.',
            'description.max' => 'Mô tả không được vượt quá 1000 ký tự.',
        ];
    }
}
