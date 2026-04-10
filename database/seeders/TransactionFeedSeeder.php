<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionFeedSeeder extends Seeder
{
    public function run(): void
    {
        $senders   = [['T', 'Tendai', 'Melbourne'], ['F', 'Farai', 'Sydney'], ['B', 'Blessing', 'Brisbane'], ['R', 'Rudo', 'Perth'], ['S', 'Simba', 'Adelaide'], ['C', 'Chido', 'Melbourne'], ['T', 'Tinashe', 'Sydney'], ['M', 'Munyaradzi', 'Brisbane'], ['N', 'Nyasha', 'Perth'], ['P', 'Panashe', 'Melbourne']];
        $receivers = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Marondera', 'Chinhoyi', 'Masvingo', 'Kwekwe', 'Bindura', 'Chitungwiza'];
        $rate = 0.63;
        $entries = [];
        for ($i = 0; $i < 30; $i++) {
            $sender   = $senders[array_rand($senders)];
            $receiver = $receivers[array_rand($receivers)];
            $aud      = round(rand(150, 900) + (rand(0, 99) / 100), 2);
            $usd      = round($aud * $rate * (1 - 0.015), 2);
            $daysAgo  = rand(1, 60);
            $completedAt = Carbon::now()->subDays($daysAgo)->subHours(rand(0, 23));
            $firstName = $sender[1];
            $masked = $firstName[0] . str_repeat('*', max(1, strlen($firstName) - 2)) . substr($firstName, -1);
            $entries[] = [
                'swap_match_id'    => null,
                'display_sender'   => "{$masked} from {$sender[2]}",
                'display_receiver' => 'Recipient in ' . $receiver,
                'amount_aud'       => $aud,
                'amount_usd'       => $usd,
                'delivery_location' => $receiver,
                'completed_at'     => $completedAt,
                'is_demo'          => 1,
                'is_visible'       => 1,
                'created_at'       => $completedAt,
            ];
        }
        DB::table('public_transaction_feed')->insert($entries);
    }
}