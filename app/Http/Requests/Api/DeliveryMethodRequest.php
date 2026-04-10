<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class DeliveryMethodRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'method'             => ['required', 'in:secure,risk'],
            'risk_payout_method' => [
                'required_if:method,risk',
                'nullable',
                'in:platform_then_bank,direct_bank',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'method.in'                    => 'Delivery method must be secure or risk.',
            'risk_payout_method.required_if'=> 'Please select a payout method for risk delivery.',
            'risk_payout_method.in'         => 'Payout method must be platform_then_bank or direct_bank.',
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
