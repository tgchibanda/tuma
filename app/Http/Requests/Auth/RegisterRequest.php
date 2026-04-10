<?php
// ============================================================
// FILE: app/Http/Requests/Auth/RegisterRequest.php
// ============================================================
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'first_name'            => ['required', 'string', 'max:100'],
            'last_name'             => ['required', 'string', 'max:100'],
            'email'                 => ['required', 'email', 'max:191', 'unique:users,email'],
            'phone'                 => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],
            'country_id'            => ['required', 'integer', 'exists:countries,id'],
            'referral_code'         => ['nullable', 'string', 'max:20', 'exists:users,referral_code'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'   => 'An account with this email already exists.',
            'phone.unique'   => 'An account with this phone number already exists.',
            'country_id.exists' => 'Please select a valid country.',
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
