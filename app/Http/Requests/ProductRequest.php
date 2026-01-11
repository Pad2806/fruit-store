<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
        $rules = [
            'name' => 'required|string|max:255',
            'detail_desc' => 'nullable|string',
            'short_desc' => 'nullable|string',
            'sold_quantity' => 'nullable|integer|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'origin_id' => 'required|string|exists:origins,id',
            'category_id' => 'required|string|exists:categories,id',
            'unit' => 'nullable|string|max:50',
            'status' => 'nullable|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Max 5MB per image
        ];
        
        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được âm.',
            'origin_id.required' => 'Xuất xứ là bắt buộc.',
            'origin_id.exists' => 'Xuất xứ không tồn tại.',
            'category_id.required' => 'Danh mục là bắt buộc.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'stock_quantity.integer' => 'Số lượng tồn kho phải là số nguyên.',
            'stock_quantity.min' => 'Số lượng tồn kho không được âm.',
            'sold_quantity.integer' => 'Số lượng đã bán phải là số nguyên.',
            'sold_quantity.min' => 'Số lượng đã bán không được âm.',
            'status.in' => 'Trạng thái phải là active hoặc inactive.',
            'images.array' => 'Hình ảnh phải là mảng file.',
            'images.*.image' => 'File phải là hình ảnh.',
            'images.*.mimes' => 'Hình ảnh phải có định dạng: jpeg, png, jpg, gif, webp.',
            'images.*.max' => 'Mỗi hình ảnh không được vượt quá 5MB.',
        ];
    }
}

