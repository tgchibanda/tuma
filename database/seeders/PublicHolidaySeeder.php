<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PublicHolidaySeeder extends Seeder
{
    public function run(): void
    {
        $au = DB::table('countries')->where('iso_code', 'AU')->value('id');
        $zw = DB::table('countries')->where('iso_code', 'ZW')->value('id');
        $year = date('Y');
        $holidays = [
            // Australia
            [$au, 'New Year\'s Day', "{$year}-01-01", false],
            [$au, 'Australia Day', "{$year}-01-26", false],
            [$au, 'Good Friday', "{$year}-04-18", false],
            [$au, 'Easter Monday', "{$year}-04-21", false],
            [$au, 'ANZAC Day', "{$year}-04-25", false],
            [$au, 'Christmas Day', "{$year}-12-25", false],
            [$au, 'Boxing Day', "{$year}-12-26", false],
            // Zimbabwe — affects deliveries
            [$zw, 'New Year\'s Day', "{$year}-01-01", true],
            [$zw, 'Independence Day', "{$year}-04-18", true],
            [$zw, 'Workers Day', "{$year}-05-01", true],
            [$zw, 'Africa Day', "{$year}-05-25", true],
            [$zw, 'Zimbabwe Heroes Day', "{$year}-08-11", true],
            [$zw, 'Defense Forces Day', "{$year}-08-12", true],
            [$zw, 'Unity Day', "{$year}-12-22", true],
            [$zw, 'Christmas Day', "{$year}-12-25", true],
            [$zw, 'Boxing Day', "{$year}-12-26", true],
        ];
        foreach ($holidays as [$country, $name, $date, $affects]) {
            DB::table('public_holidays')->insert(['country_id' => $country, 'name' => $name, 'holiday_date' => $date, 'affects_deliveries' => $affects ? 1 : 0, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}