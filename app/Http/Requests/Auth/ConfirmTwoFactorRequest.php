<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ConfirmTwoFactorRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['code' => ['required', 'string', 'digits:6']]; }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false, 'message' => 'Validation failed',
            'data' => null, 'errors' => $validator->errors(),
        ], 422));
    }
}
