<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class NegotiateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /**
     * Normalise counter_aud → proposed_aud before validation.
     * Frontend sends counter_aud/counter_usd; validation expects proposed_aud/proposed_usd.
     */
    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('counter_aud') && ! $this->has('proposed_aud')) {
            $merge['proposed_aud'] = $this->counter_aud;
        }
        if ($this->has('counter_usd') && ! $this->has('proposed_usd')) {
            $merge['proposed_usd'] = $this->counter_usd;
        }
        if (! empty($merge)) {
            $this->merge($merge);
        }
    }

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
            'action.in'                => 'Action must be accept or counter.',
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
