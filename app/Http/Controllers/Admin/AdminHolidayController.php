<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\PublicHoliday;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminHolidayController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /** Admin list — all countries, all holidays */
    public function index(): JsonResponse
    {
        $holidays = PublicHoliday::with('country')->orderBy('holiday_date')->paginate(50);
        return $this->paginated($holidays, 'Holidays retrieved.', $holidays->getCollection()->map(fn($h) => [
            'id'                 => $h->id,
            'name'               => $h->name,
            'holiday_date'       => $h->holiday_date->toDateString(),
            'description'        => $h->description,
            'affects_deliveries' => (bool) $h->affects_deliveries,
            'country'            => $h->country?->name,
            'country_id'         => $h->country_id,
        ]));
    }

    /** Public list — upcoming holidays for active countries */
    public function indexPublic(): JsonResponse
    {
        $holidays = PublicHoliday::with('country')
            ->where('holiday_date', '>=', today())
            ->where('holiday_date', '<=', today()->addDays(30))
            ->orderBy('holiday_date')
            ->get()
            ->map(fn($h) => [
                'name'               => $h->name,
                'holiday_date'       => $h->holiday_date->toDateString(),
                'description'        => $h->description,
                'affects_deliveries' => (bool) $h->affects_deliveries,
                'country'            => $h->country?->name,
                'days_away'          => today()->diffInDays($h->holiday_date),
            ]);

        return $this->success($holidays, 'Upcoming holidays retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'country_id'         => ['required', 'integer', 'exists:countries,id'],
            'name'               => ['required', 'string', 'max:150'],
            'holiday_date'       => ['required', 'date'],
            'description'        => ['nullable', 'string', 'max:500'],
            'affects_deliveries' => ['nullable', 'boolean'],
        ]);

        $holiday = PublicHoliday::create([
            'country_id'         => $request->country_id,
            'name'               => $request->name,
            'holiday_date'       => $request->holiday_date,
            'description'        => $request->description,
            'affects_deliveries' => $request->boolean('affects_deliveries', true),
        ]);

        $this->auditService->log('holiday.created', $request->user(), $holiday);
        return $this->created($holiday, 'Holiday created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $holiday = PublicHoliday::findOrFail($id);
        $holiday->update($request->only(['name', 'holiday_date', 'description', 'affects_deliveries']));
        return $this->success($holiday, 'Holiday updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $holiday = PublicHoliday::findOrFail($id);
        $this->auditService->log('holiday.deleted', $request->user(), $holiday);
        $holiday->delete();
        return $this->success(null, 'Holiday deleted.');
    }
}
