<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class NegotiateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'action'       => ['required', 'in:accept,counter'],
            'proposed_aud' => ['required_if:action,counter', 'nullable', 'numeric', 'min:1'],
            'proposed_usd' => ['required_if:action,counter', 'nullable', 'numeric', 'min:1'],
            'message'      => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.in'            => 'Action must be accept or counter.',
            'proposed_aud.required_if' => 'Please provide an AUD amount for your counter-offer.',
            'proposed_usd.required_if' => 'Please provide a USD amount for your counter-offer.',
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
