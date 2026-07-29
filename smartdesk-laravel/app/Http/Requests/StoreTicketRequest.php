<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priorityid' => 'required|exists:priorities,id',
            'categoryid' => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'description.required' => 'Description is required.',
            'priorityid.required' => 'Priority is required.',
            'priorityid.exists' => 'Invalid priority.',
            'categoryid.required' => 'Category is required.',
            'categoryid.exists' => 'Invalid category.',
        ];
    }
}