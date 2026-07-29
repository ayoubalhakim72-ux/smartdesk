<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'title' => 'sometimes|string|max:255',

            'description' => 'sometimes|string',

            'priorityid' => 'sometimes|exists:priorities,id',

            'categoryid' => 'sometimes|exists:categories,id',

            'statusid' => 'sometimes|exists:statuses,id',

            'assignedto' => 'sometimes|nullable|exists:users,id',

        ];
    }
}