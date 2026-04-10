<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class VerifyPhoneRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['phone' => ['required', 'string', 'max:30']]; }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false, 'message' => 'Validation failed',
            'data' => null, 'errors' => $validator->errors(),
        ], 422));
    }
}
