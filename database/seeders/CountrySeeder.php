<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            [
                'name'            => 'Australia',
                'iso_code'        => 'AU',
                'currency_code'   => 'AUD',
                'currency_symbol' => '$',
                'currency_name'   => 'Australian Dollar',
                'flag_emoji'      => '🇦🇺',
                'is_active'       => 1,
            ],
            [
                'name'            => 'Zimbabwe',
                'iso_code'        => 'ZW',
                'currency_code'   => 'USD',
                'currency_symbol' => 'US$',
                'currency_name'   => 'US Dollar',
                'flag_emoji'      => '🇿🇼',
                'is_active'       => 1,
            ],
        ];

        foreach ($countries as $country) {
            DB::table('countries')->updateOrInsert(
                ['iso_code' => $country['iso_code']],
                array_merge($country, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('  ✓ Countries seeded (Australia, Zimbabwe)');
    }
}
