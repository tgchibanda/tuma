<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExchangeRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            [
                'from_currency' => 'AUD',
                'to_currency'   => 'USD',
                'rate'          => '0.63000000',
                'source'        => 'manual',
                'is_active'     => 1,
            ],
            [
                'from_currency' => 'USD',
                'to_currency'   => 'AUD',
                'rate'          => '1.59000000',
                'source'        => 'manual',
                'is_active'     => 1,
            ],
        ];

        foreach ($rates as $rate) {
            // Deactivate any existing active rate for this pair first
            DB::table('exchange_rates')
                ->where('from_currency', $rate['from_currency'])
                ->where('to_currency', $rate['to_currency'])
                ->where('is_active', 1)
                ->update(['is_active' => 0]);

            // Insert new active rate
            DB::table('exchange_rates')->insert(array_merge($rate, [
                'created_at' => now(),
            ]));

            // Also record in rate_history
            DB::table('rate_history')->insert([
                'from_currency' => $rate['from_currency'],
                'to_currency'   => $rate['to_currency'],
                'rate'          => $rate['rate'],
                'recorded_at'   => now(),
                'source'        => 'manual',
            ]);
        }

        // Seed some historical rate data for the chart (last 30 days)
        $this->seedRateHistory();

        $this->command->info('  ✓ Exchange rates seeded (AUD/USD: 0.63, USD/AUD: 1.59)');
    }

    private function seedRateHistory(): void
    {
        // Realistic AUD/USD rate fluctuation over the past 30 days
        $baseRate   = 0.630;
        $historicalRates = [];

        for ($daysAgo = 30; $daysAgo >= 1; $daysAgo--) {
            // Small random daily fluctuation ±0.008
            $fluctuation = (mt_rand(-8, 8)) / 1000;
            $rate        = round(max(0.580, min(0.680, $baseRate + $fluctuation)), 8);
            $baseRate    = $rate; // Walk from previous day

            $historicalRates[] = [
                'from_currency' => 'AUD',
                'to_currency'   => 'USD',
                'rate'          => number_format($rate, 8, '.', ''),
                'recorded_at'   => now()->subDays($daysAgo)->startOfDay(),
                'source'        => 'historical',
            ];

            // Inverse rate
            $historicalRates[] = [
                'from_currency' => 'USD',
                'to_currency'   => 'AUD',
                'rate'          => number_format(round(1 / $rate, 8), 8, '.', ''),
                'recorded_at'   => now()->subDays($daysAgo)->startOfDay(),
                'source'        => 'historical',
            ];
        }

        DB::table('rate_history')->insert($historicalRates);
        $this->command->info('  ✓ Rate history seeded (30 days of historical data)');
    }
}
