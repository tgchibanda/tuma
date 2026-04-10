<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    use ApiResponse;

    /**
     * List all active countries.
     * GET /api/v1/countries
     */
    public function index(): JsonResponse
    {
        $countries = Country::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'name'            => $c->name,
                'iso_code'        => $c->iso_code,
                'currency_code'   => $c->currency_code,
                'currency_symbol' => $c->currency_symbol,
                'currency_name'   => $c->currency_name,
                'flag_emoji'      => $c->flag_emoji,
            ]);

        return $this->success($countries, 'Countries retrieved.');
    }
}
