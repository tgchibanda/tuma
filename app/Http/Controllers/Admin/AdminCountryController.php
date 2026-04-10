<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Country;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCountryController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    public function index(): JsonResponse
    {
        $countries = Country::orderBy('name')->get()->map(fn($c) => [
            'id'              => $c->id,
            'name'            => $c->name,
            'iso_code'        => $c->iso_code,
            'currency_code'   => $c->currency_code,
            'currency_symbol' => $c->currency_symbol,
            'currency_name'   => $c->currency_name,
            'flag_emoji'      => $c->flag_emoji,
            'is_active'       => (bool) $c->is_active,
        ]);

        return $this->success($countries, 'Countries retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'iso_code'        => ['required', 'string', 'size:2', 'unique:countries,iso_code'],
            'currency_code'   => ['required', 'string', 'size:3'],
            'currency_symbol' => ['required', 'string', 'max:5'],
            'currency_name'   => ['required', 'string', 'max:100'],
            'flag_emoji'      => ['nullable', 'string', 'max:10'],
        ]);

        $country = Country::create($request->only([
            'name', 'iso_code', 'currency_code', 'currency_symbol', 'currency_name', 'flag_emoji',
        ]));

        $this->auditService->log('country.created', $request->user(), $country);

        return $this->created($country, 'Country created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $country = Country::findOrFail($id);
        $request->validate([
            'name'            => ['sometimes', 'string', 'max:100'],
            'currency_symbol' => ['sometimes', 'string', 'max:5'],
            'currency_name'   => ['sometimes', 'string', 'max:100'],
            'flag_emoji'      => ['nullable', 'string', 'max:10'],
        ]);

        $old = $country->toArray();
        $country->update($request->only(['name', 'currency_symbol', 'currency_name', 'flag_emoji']));
        $this->auditService->log('country.updated', $request->user(), $country, $old, $country->toArray());

        return $this->success($country, 'Country updated.');
    }

    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $country           = Country::findOrFail($id);
        $country->is_active = ! $country->is_active;
        $country->save();

        $this->auditService->log('country.toggled', $request->user(), $country);

        return $this->success($country, $country->is_active ? 'Country activated.' : 'Country deactivated.');
    }
}
