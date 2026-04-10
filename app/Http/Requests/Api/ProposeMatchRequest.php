<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProposeMatchRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'proposed_aud' => ['required', 'numeric', 'min:1'],
            'proposed_usd' => ['required', 'numeric', 'min:1'],
            'message'      => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'proposed_aud.required' => 'Please specify the AUD amount you are proposing.',
            'proposed_usd.required' => 'Please specify the USD cash amount you will deliver.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'data'    => null,
            'errors'  => $validator->errors(),
        ], 422));
    }
}
