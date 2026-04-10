<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeliveryLocationSeeder extends Seeder
{
    public function run(): void
    {
        // Get Zimbabwe country ID
        $zimbabweId = DB::table('countries')->where('iso_code', 'ZW')->value('id');

        if (! $zimbabweId) {
            $this->command->error('  ✗ Zimbabwe country not found. Run CountrySeeder first.');
            return;
        }

        $locations = [
            // ── Harare Province ───────────────────────────────────────────
            [
                'name'       => 'Harare',
                'province'   => 'Harare Province',
                'sort_order' => 1,
            ],
            [
                'name'       => 'Chitungwiza',
                'province'   => 'Harare Province',
                'sort_order' => 2,
            ],

            // ── Bulawayo Province ─────────────────────────────────────────
            [
                'name'       => 'Bulawayo',
                'province'   => 'Bulawayo Province',
                'sort_order' => 3,
            ],

            // ── Manicaland ────────────────────────────────────────────────
            [
                'name'       => 'Mutare',
                'province'   => 'Manicaland',
                'sort_order' => 4,
            ],
            [
                'name'       => 'Chipinge',
                'province'   => 'Manicaland',
                'sort_order' => 5,
            ],

            // ── Midlands ──────────────────────────────────────────────────
            [
                'name'       => 'Gweru',
                'province'   => 'Midlands',
                'sort_order' => 6,
            ],
            [
                'name'       => 'Kwekwe',
                'province'   => 'Midlands',
                'sort_order' => 7,
            ],
            [
                'name'       => 'Kadoma',
                'province'   => 'Midlands',
                'sort_order' => 8,
            ],

            // ── Mashonaland West ──────────────────────────────────────────
            [
                'name'       => 'Chinhoyi',
                'province'   => 'Mashonaland West',
                'sort_order' => 9,
            ],

            // ── Mashonaland East ──────────────────────────────────────────
            [
                'name'       => 'Marondera',
                'province'   => 'Mashonaland East',
                'sort_order' => 10,
            ],

            // ── Mashonaland Central ───────────────────────────────────────
            [
                'name'       => 'Bindura',
                'province'   => 'Mashonaland Central',
                'sort_order' => 11,
            ],

            // ── Masvingo ──────────────────────────────────────────────────
            [
                'name'       => 'Masvingo',
                'province'   => 'Masvingo',
                'sort_order' => 12,
            ],
            [
                'name'       => 'Chiredzi',
                'province'   => 'Masvingo',
                'sort_order' => 13,
            ],

            // ── Matabeleland North ────────────────────────────────────────
            [
                'name'       => 'Victoria Falls',
                'province'   => 'Matabeleland North',
                'sort_order' => 14,
            ],
            [
                'name'       => 'Hwange',
                'province'   => 'Matabeleland North',
                'sort_order' => 15,
            ],

            // ── Matabeleland South ────────────────────────────────────────
            [
                'name'       => 'Beitbridge',
                'province'   => 'Matabeleland South',
                'sort_order' => 16,
            ],
        ];

        foreach ($locations as $location) {
            $slug = Str::slug($location['name']);

            DB::table('delivery_locations')->updateOrInsert(
                [
                    'country_id' => $zimbabweId,
                    'slug'       => $slug,
                ],
                [
                    'country_id'  => $zimbabweId,
                    'name'        => $location['name'],
                    'slug'        => $slug,
                    'province'    => $location['province'],
                    'sort_order'  => $location['sort_order'],
                    'is_active'   => 1,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }

        $this->command->info('  ✓ Delivery locations seeded (' . count($locations) . ' Zimbabwe cities)');
    }
}
