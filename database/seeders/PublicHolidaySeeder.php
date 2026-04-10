<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PublicHolidaySeeder extends Seeder
{
    public function run(): void
    {
        $australiaId = DB::table('countries')->where('iso_code', 'AU')->value('id');
        $zimbabweId  = DB::table('countries')->where('iso_code', 'ZW')->value('id');

        if (! $australiaId || ! $zimbabweId) {
            $this->command->error('  ✗ Countries not found. Run CountrySeeder first.');
            return;
        }

        $year     = date('Y');
        $nextYear = $year + 1;

        $holidays = [
            // ── Australia (national) ──────────────────────────────────────
            [
                'country_id'         => $australiaId,
                'name'               => "New Year's Day",
                'holiday_date'       => "{$year}-01-01",
                'description'        => 'National public holiday',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => 'Australia Day',
                'holiday_date'       => "{$year}-01-26",
                'description'        => 'National public holiday',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => 'Good Friday',
                'holiday_date'       => $this->getGoodFriday($year),
                'description'        => 'Easter public holiday',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => 'Easter Monday',
                'holiday_date'       => $this->getEasterMonday($year),
                'description'        => 'Easter public holiday',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => "ANZAC Day",
                'holiday_date'       => "{$year}-04-25",
                'description'        => 'National public holiday',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => 'Christmas Day',
                'holiday_date'       => "{$year}-12-25",
                'description'        => 'National public holiday — bank transfers may be delayed',
                'affects_deliveries' => 0,
            ],
            [
                'country_id'         => $australiaId,
                'name'               => 'Boxing Day',
                'holiday_date'       => "{$year}-12-26",
                'description'        => 'National public holiday',
                'affects_deliveries' => 0,
            ],
            // Next year New Year
            [
                'country_id'         => $australiaId,
                'name'               => "New Year's Day",
                'holiday_date'       => "{$nextYear}-01-01",
                'description'        => 'National public holiday',
                'affects_deliveries' => 0,
            ],

            // ── Zimbabwe ──────────────────────────────────────────────────
            [
                'country_id'         => $zimbabweId,
                'name'               => "New Year's Day",
                'holiday_date'       => "{$year}-01-01",
                'description'        => 'Public holiday — cash deliveries may be affected',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Zimbabwe Independence Day',
                'holiday_date'       => "{$year}-04-18",
                'description'        => 'National public holiday — deliveries may be slower in some cities',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Workers Day',
                'holiday_date'       => "{$year}-05-01",
                'description'        => 'Public holiday — cash agents may have reduced hours',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Africa Day',
                'holiday_date'       => "{$year}-05-25",
                'description'        => 'Public holiday',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => "Heroes' Day",
                'holiday_date'       => "{$year}-08-11",
                'description'        => 'National public holiday — deliveries may be delayed',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => "Defence Forces Day",
                'holiday_date'       => "{$year}-08-12",
                'description'        => 'Public holiday — deliveries may be delayed',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Unity Day',
                'holiday_date'       => "{$year}-12-22",
                'description'        => 'Public holiday',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Christmas Day',
                'holiday_date'       => "{$year}-12-25",
                'description'        => 'Public holiday — most delivery agents unavailable',
                'affects_deliveries' => 1,
            ],
            [
                'country_id'         => $zimbabweId,
                'name'               => 'Boxing Day',
                'holiday_date'       => "{$year}-12-26",
                'description'        => 'Public holiday — reduced delivery availability',
                'affects_deliveries' => 1,
            ],
            // Next year
            [
                'country_id'         => $zimbabweId,
                'name'               => "New Year's Day",
                'holiday_date'       => "{$nextYear}-01-01",
                'description'        => 'Public holiday — cash deliveries may be affected',
                'affects_deliveries' => 1,
            ],
        ];

        foreach ($holidays as $holiday) {
            DB::table('public_holidays')->updateOrInsert(
                [
                    'country_id'   => $holiday['country_id'],
                    'holiday_date' => $holiday['holiday_date'],
                    'name'         => $holiday['name'],
                ],
                array_merge($holiday, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('  ✓ Public holidays seeded (' . count($holidays) . ' holidays for AU + ZW)');
    }

    private function getGoodFriday(int $year): string
    {
        $easter = easter_date($year);
        return date('Y-m-d', $easter - 2 * 86400);
    }

    private function getEasterMonday(int $year): string
    {
        $easter = easter_date($year);
        return date('Y-m-d', $easter + 86400);
    }
}
