<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['first_trade', 'First Trade', 'Completed your very first transaction on TuMa', '🥇', 'trade_count', 1],
            ['trades_10', '10 Trades', 'Completed 10 transactions', '🔟', 'trade_count', 10],
            ['trades_50', '50 Trades', 'Completed 50 transactions', '⭐', 'trade_count', 50],
            ['trades_100', 'Century Trader', 'Completed 100 transactions', '💯', 'trade_count', 100],
            ['zero_disputes', 'Zero Disputes', 'No disputes raised on any of your transactions', '🛡', 'zero_disputes', null],
            ['top_rated', 'Top Rated', 'Maintained a 4.8+ average rating across 10+ reviews', '⭐', 'rating_average', 48],
            ['fast_responder', 'Fast Responder', 'Consistently responds to proposals within 1 hour', '⚡', 'response_time', 60],
            ['multi_city', 'Multi-City Deliverer', 'Delivered cash in 5 or more Zimbabwe cities', '🌍', 'multi_city', 5],
            ['referral_5', 'Great Referrer', 'Successfully referred 5 users to TuMa', '🤝', 'referral_count', 5],
            ['verified_business', 'Verified Business', 'Profile verified as a trusted business on TuMa', '✅', 'manual', null],
            ['early_adopter', 'Early Adopter', 'One of TuMa\'s first 100 users', '🌱', 'manual', null],
        ];
        foreach ($badges as [$key, $name, $desc, $icon, $trigger, $val]) {
            DB::table('achievements')->insert(['badge_key' => $key, 'badge_name' => $name, 'badge_description' => $desc, 'badge_icon' => $icon, 'trigger_type' => $trigger, 'trigger_value' => $val, 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}