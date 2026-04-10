<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeliveryLocationSeeder extends Seeder
{
    public function run(): void
    {
        $zw = DB::table('countries')->where('iso_code', 'ZW')->value('id');
        $locations = [
            ['Harare', 'Harare Province', 1],
            ['Chitungwiza', 'Harare Province', 2],
            ['Bulawayo', 'Bulawayo Province', 3],
            ['Mutare', 'Manicaland', 4],
            ['Chipinge', 'Manicaland', 5],
            ['Gweru', 'Midlands', 6],
            ['Kwekwe', 'Midlands', 7],
            ['Kadoma', 'Midlands', 8],
            ['Chinhoyi', 'Mashonaland West', 9],
            ['Marondera', 'Mashonaland East', 10],
            ['Bindura', 'Mashonaland Central', 11],
            ['Masvingo', 'Masvingo', 12],
            ['Chiredzi', 'Masvingo', 13],
            ['Victoria Falls', 'Matabeleland North', 14],
            ['Hwange', 'Matabeleland North', 15],
            ['Beitbridge', 'Matabeleland South', 16],
        ];
        foreach ($locations as [$name, $province, $sort]) {
            DB::table('delivery_locations')->insert(['country_id' => $zw, 'name' => $name, 'slug' => Str::slug($name), 'province' => $province, 'is_active' => 1, 'sort_order' => $sort, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}