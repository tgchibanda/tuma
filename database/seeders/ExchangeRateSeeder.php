<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExchangeRateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('exchange_rates')->insert([
            ['from_currency' => 'AUD', 'to_currency' => 'USD', 'rate' => 0.63000000, 'source' => 'manual', 'is_active' => 1, 'created_at' => now()],
            ['from_currency' => 'USD', 'to_currency' => 'AUD', 'rate' => 1.59000000, 'source' => 'manual', 'is_active' => 1, 'created_at' => now()],
        ]);
        DB::table('rate_history')->insert([
            ['from_currency' => 'AUD', 'to_currency' => 'USD', 'rate' => 0.63, 'recorded_at' => now(), 'source' => 'manual'],
            ['from_currency' => 'USD', 'to_currency' => 'AUD', 'rate' => 1.59, 'recorded_at' => now(), 'source' => 'manual'],
        ]);
    }
}