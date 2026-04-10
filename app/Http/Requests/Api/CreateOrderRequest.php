<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth handled by middleware
    }

    public function rules(): array
    {
        return [
            'order_type'               => ['required', 'in:send_to_zim,receive_from_zim'],
            'amount_aud'               => ['required', 'numeric', 'min:1'],
            'zim_recipient_name'       => ['required', 'string', 'max:150'],
            'zim_recipient_phone'      => ['required', 'string', 'max:30'],
            'zim_delivery_location_id' => ['required', 'integer', 'exists:delivery_locations,id'],
            'zim_delivery_address'     => ['nullable', 'string', 'max:500'],
            'zim_delivery_notes'       => ['nullable', 'string', 'max:500'],
            'aud_bank_account_id'      => ['required', 'integer', 'exists:bank_accounts,id'],
            // Optional: pre-fill from a saved recipient
            'saved_recipient_id'       => ['nullable', 'integer', 'exists:saved_recipients,id'],
            // Optional: save as a new recipient
            'save_recipient'           => ['nullable', 'boolean'],
            'recipient_nickname'       => ['nullable', 'string', 'max:100', 'required_if:save_recipient,true'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_type.in'                       => 'Order type must be send_to_zim or receive_from_zim.',
            'zim_delivery_location_id.exists'     => 'Please select a valid Zimbabwe delivery location.',
            'aud_bank_account_id.exists'           => 'Please select a valid Australian bank account.',
            'amount_aud.min'                       => 'Amount must be greater than zero.',
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
