<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class VerifyPinRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['pin' => ['required', 'string', 'digits:4']]; }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false, 'message' => 'Validation failed',
            'data' => null, 'errors' => $validator->errors(),
        ], 422));
    }
}
