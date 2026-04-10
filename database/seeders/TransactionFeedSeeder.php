<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionFeedSeeder extends Seeder
{
    public function run(): void
    {
        // Zimbabwean first names — realistic for the diaspora community
        $zimNames = [
            'Tendai', 'Chido', 'Farai', 'Tatenda', 'Blessing',
            'Rudo', 'Tinashe', 'Simba', 'Tafadzwa', 'Munashe',
            'Nyasha', 'Tapiwa', 'Rutendo', 'Takudzwa', 'Chiedza',
            'Thandeka', 'Sibongile', 'Nkosi', 'Nomsa', 'Zanele',
            'Kudzai', 'Tariro', 'Mavis', 'Chenai', 'Tinotenda',
        ];

        // Australian cities where senders live
        $auCities = [
            'Melbourne', 'Sydney', 'Brisbane', 'Perth',
            'Adelaide', 'Melbourne', 'Sydney', 'Melbourne', // weighted towards major cities
        ];

        // Zimbabwe delivery cities (must match what we seeded)
        $zimCities = [
            'Harare', 'Harare', 'Harare', 'Bulawayo', 'Mutare',
            'Gweru', 'Harare', 'Bulawayo', 'Masvingo', 'Chitungwiza',
            'Harare', 'Kwekwe', 'Marondera', 'Harare', 'Chinhoyi',
        ];

        // Realistic AUD amounts — mostly $200–$800 range
        $audAmounts = [
            150, 200, 250, 300, 300, 350, 400, 400, 450,
            500, 500, 500, 550, 600, 650, 700, 750, 800,
            200, 300, 350, 450, 500, 600, 400, 300, 250,
            800, 150, 600,
        ];

        $exchangeRate = 0.63;
        $feePercent   = 0.015; // 1.5%

        $records = [];

        // Spread 30 records over the past 60 days
        // More recent = more records (platform is growing)
        $dayOffsets = array_merge(
            [55, 52, 49, 47, 44],    // 5 records: 44–55 days ago
            [40, 38, 36, 33, 30],    // 5 records: 30–40 days ago
            [28, 25, 22, 20, 18],    // 5 records: 18–28 days ago
            [15, 13, 11, 9, 8],      // 5 records: 8–15 days ago
            [6, 5, 4, 3, 2],         // 5 records: 2–6 days ago
            [1, 1, 0, 0, 0],         // 5 records: today and yesterday
        );

        shuffle($zimNames); // Randomise name assignment

        for ($i = 0; $i < 30; $i++) {
            $audAmount = $audAmounts[$i];
            $feeAud    = round($audAmount * $feePercent, 2);
            $netAud    = $audAmount - $feeAud;
            $usdAmount = round($netAud * $exchangeRate, 2);

            // Small random rate variation per record
            $rateVariation = (mt_rand(-3, 3)) / 100;
            $usdAmount     = round($netAud * ($exchangeRate + $rateVariation), 2);

            $senderName   = $zimNames[$i % count($zimNames)];
            $receiverName = $zimNames[($i + 7) % count($zimNames)];
            $auCity       = $auCities[$i % count($auCities)];
            $zimCity      = $zimCities[$i % count($zimCities)];

            // Randomise hours within the day
            $hoursOffset  = mt_rand(0, 23);
            $minutesOffset= mt_rand(0, 59);
            $completedAt  = now()
                ->subDays($dayOffsets[$i])
                ->setHour($hoursOffset)
                ->setMinute($minutesOffset)
                ->setSecond(0);

            $records[] = [
                'swap_match_id'    => null,
                'display_sender'   => $this->anonymiseName($senderName) . ' from ' . $auCity,
                'display_receiver' => $this->anonymiseName($receiverName) . ' in ' . $zimCity,
                'amount_aud'       => $audAmount,
                'amount_usd'       => $usdAmount,
                'delivery_location'=> $zimCity,
                'completed_at'     => $completedAt,
                'is_demo'          => 1,
                'is_visible'       => 1,
                'created_at'       => $completedAt,
            ];
        }

        // Insert in chronological order (oldest first)
        usort($records, fn($a, $b) => $a['completed_at'] <=> $b['completed_at']);

        foreach ($records as $record) {
            DB::table('public_transaction_feed')->insert($record);
        }

        // Calculate and show total stats
        $totalAud = array_sum(array_column($records, 'amount_aud'));
        $totalUsd = array_sum(array_column($records, 'amount_usd'));

        $this->command->info('  ✓ Transaction feed seeded (30 demo records over 60 days)');
        $this->command->info("    Total AUD: \${$totalAud} | Total USD: \${$totalUsd}");
    }

    /**
     * Anonymise a name for public display.
     * "Tendai" → "T***i"
     * "Ru" → "R**"
     */
    private function anonymiseName(string $name): string
    {
        $len = strlen($name);

        if ($len <= 2) {
            return $name[0] . str_repeat('*', max(2, $len - 1));
        }

        $first  = $name[0];
        $last   = $name[$len - 1];
        $stars  = str_repeat('*', max(3, $len - 2));

        return $first . $stars . $last;
    }
}
