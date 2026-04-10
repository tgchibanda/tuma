<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // ── Trade count badges ────────────────────────────────────────
            [
                'badge_key'         => 'first_trade',
                'badge_name'        => 'First Trade',
                'badge_description' => 'Completed your very first TuMa transaction.',
                'badge_icon'        => '🎉',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 1,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'trades_5',
                'badge_name'        => '5 Trades',
                'badge_description' => 'Completed 5 successful transactions on TuMa.',
                'badge_icon'        => '⭐',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 5,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'trades_10',
                'badge_name'        => '10 Trades',
                'badge_description' => 'Completed 10 successful transactions. You know the ropes!',
                'badge_icon'        => '🔟',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 10,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'trades_25',
                'badge_name'        => '25 Trades',
                'badge_description' => 'A quarter century of successful transactions.',
                'badge_icon'        => '🥈',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 25,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'trades_50',
                'badge_name'        => '50 Trades',
                'badge_description' => 'Halfway to 100 — a true TuMa power user.',
                'badge_icon'        => '🥇',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 50,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'trades_100',
                'badge_name'        => '100 Trades',
                'badge_description' => 'One hundred completed trades. An absolute legend.',
                'badge_icon'        => '💯',
                'trigger_type'      => 'trade_count',
                'trigger_value'     => 100,
                'is_active'         => 1,
            ],

            // ── Rating badges ─────────────────────────────────────────────
            [
                'badge_key'         => 'top_rated',
                'badge_name'        => 'Top Rated',
                'badge_description' => 'Maintained an average rating of 4.8 or above across 5+ trades.',
                'badge_icon'        => '🌟',
                'trigger_type'      => 'rating_average',
                'trigger_value'     => 5,  // 4.8 stored as int 5 (checked in BadgeService)
                'is_active'         => 1,
            ],

            // ── Trust badges ──────────────────────────────────────────────
            [
                'badge_key'         => 'zero_disputes',
                'badge_name'        => 'Zero Disputes',
                'badge_description' => 'Completed 5+ trades with no disputes raised. Trustworthy trader.',
                'badge_icon'        => '🛡️',
                'trigger_type'      => 'zero_disputes',
                'trigger_value'     => null,
                'is_active'         => 1,
            ],

            // ── Speed badges ──────────────────────────────────────────────
            [
                'badge_key'         => 'fast_responder',
                'badge_name'        => 'Fast Responder',
                'badge_description' => 'Consistently responds to match proposals within 1 hour.',
                'badge_icon'        => '⚡',
                'trigger_type'      => 'response_time',
                'trigger_value'     => 60, // minutes
                'is_active'         => 1,
            ],

            // ── Geographic badges ─────────────────────────────────────────
            [
                'badge_key'         => 'multi_city_3',
                'badge_name'        => 'Multi-City Deliverer',
                'badge_description' => 'Successfully delivered cash to 3 different Zimbabwe cities.',
                'badge_icon'        => '🌍',
                'trigger_type'      => 'multi_city',
                'trigger_value'     => 3,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'multi_city_5',
                'badge_name'        => 'Zimbabwe Explorer',
                'badge_description' => 'Successfully delivered cash to 5 or more Zimbabwe cities.',
                'badge_icon'        => '🗺️',
                'trigger_type'      => 'multi_city',
                'trigger_value'     => 5,
                'is_active'         => 1,
            ],

            // ── Community badges ──────────────────────────────────────────
            [
                'badge_key'         => 'referral_1',
                'badge_name'        => 'First Referral',
                'badge_description' => 'Successfully referred your first friend to TuMa.',
                'badge_icon'        => '🤝',
                'trigger_type'      => 'referral_count',
                'trigger_value'     => 1,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'referral_5',
                'badge_name'        => 'Community Builder',
                'badge_description' => 'Referred 5 or more friends to TuMa.',
                'badge_icon'        => '👥',
                'trigger_type'      => 'referral_count',
                'trigger_value'     => 5,
                'is_active'         => 1,
            ],

            // ── Loyalty badges ────────────────────────────────────────────
            [
                'badge_key'         => 'member_90_days',
                'badge_name'        => 'Loyal Member',
                'badge_description' => 'Been a TuMa member for 90 days.',
                'badge_icon'        => '📅',
                'trigger_type'      => 'account_age',
                'trigger_value'     => 90,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'member_1_year',
                'badge_name'        => 'One Year Strong',
                'badge_description' => 'Been a TuMa member for a full year.',
                'badge_icon'        => '🎂',
                'trigger_type'      => 'account_age',
                'trigger_value'     => 365,
                'is_active'         => 1,
            ],

            // ── Special / manual badges ────────────────────────────────────
            [
                'badge_key'         => 'verified_business',
                'badge_name'        => 'Verified Business',
                'badge_description' => 'Identity and business verified by the TuMa team.',
                'badge_icon'        => '✅',
                'trigger_type'      => 'manual',
                'trigger_value'     => null,
                'is_active'         => 1,
            ],
            [
                'badge_key'         => 'early_adopter',
                'badge_name'        => 'Early Adopter',
                'badge_description' => 'One of the first users to join TuMa.',
                'badge_icon'        => '🚀',
                'trigger_type'      => 'manual',
                'trigger_value'     => null,
                'is_active'         => 1,
            ],
        ];

        foreach ($achievements as $achievement) {
            DB::table('achievements')->updateOrInsert(
                ['badge_key' => $achievement['badge_key']],
                array_merge($achievement, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('  ✓ Achievements seeded (' . count($achievements) . ' badge definitions)');
    }
}
