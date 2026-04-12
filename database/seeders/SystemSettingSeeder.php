<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── Core transaction settings ─────────────────────────────────
            [
                'key'         => 'platform_fee_percent',
                'value'       => '1.5',
                'description' => 'Platform fee percentage taken from AUD amount on agreement (e.g. 1.5 = 0.5%)',
            ],
            [
                'key'         => 'order_expiry_hours',
                'value'       => '48',
                'description' => 'Hours before an unmatched open order automatically expires',
            ],
            [
                'key'         => 'min_order_amount_aud',
                'value'       => '50',
                'description' => 'Minimum order size in AUD',
            ],
            [
                'key'         => 'max_order_amount_aud',
                'value'       => '5000',
                'description' => 'Maximum order size in AUD (also governed by KYC tier)',
            ],
            [
                'key'         => 'new_user_limit_aud',
                'value'       => '300',
                'description' => 'Maximum order AUD for users with fewer than 5 completed trades (Tier 1)',
            ],
            [
                'key'         => 'confirmation_window_hours',
                'value'       => '24',
                'description' => 'Hours recipient has to confirm cash delivery before a dispute is auto-raised',
            ],

            // ── Negotiation settings ──────────────────────────────────────
            [
                'key'         => 'negotiation_round_hours',
                'value'       => '2',
                'description' => 'Hours each party has to respond to a proposal before the match is auto-cancelled',
            ],
            [
                'key'         => 'max_negotiation_rounds',
                'value'       => '5',
                'description' => 'Maximum back-and-forth negotiation rounds before match is auto-cancelled',
            ],

            // ── Bank account details ──────────────────────────────────────
            [
                'key'         => 'tuma_bank_name',
                'value'       => 'National Australia Bank',
                'description' => 'Name of the bank holding TuMa escrow account — shown in deposit instructions',
            ],
            [
                'key'         => 'tuma_account_name',
                'value'       => 'TuMa Pty Ltd Trust Account',
                'description' => 'Account name for TuMa escrow — shown in deposit instructions',
            ],
            [
                'key'         => 'tuma_bsb',
                'value'       => '000-000',
                'description' => 'BSB code for TuMa escrow account — shown in deposit instructions',
            ],
            [
                'key'         => 'tuma_account_number',
                'value'       => '000000000',
                'description' => 'Account number for TuMa escrow — shown in deposit instructions',
            ],

            // ── Risk / delivery method settings ───────────────────────────
            [
                'key'         => 'risk_deposit_window_hours',
                'value'       => '24',
                'description' => 'Hours sender has to deposit AUD after confirming risk delivery before dispute is auto-raised',
            ],
            [
                'key'         => 'risk_delivery_enabled',
                'value'       => 'true',
                'description' => 'Master toggle: allow users to choose Risk delivery method (deliverer goes first)',
            ],
            [
                'key'         => 'secure_delivery_enabled',
                'value'       => 'true',
                'description' => 'Master toggle: allow users to choose Secure delivery method (AUD deposited first)',
            ],
            [
                'key'         => 'delivery_method_timeout_hours',
                'value'       => '2',
                'description' => 'Hours parties have to agree on delivery method before match is auto-cancelled',
            ],
            [
                'key'         => 'zim_contact_verification_enabled',
                'value'       => 'false',
                'description' => 'Whether to send an SMS OTP to Zimbabwe recipient phone to verify it is real',
            ],

            // ── Referral programme ────────────────────────────────────────
            [
                'key'         => 'referral_discount_percent',
                'value'       => '50',
                'description' => 'Percentage fee discount applied to both referrer and referred user on first completed trade',
            ],
            [
                'key'         => 'referral_reward_enabled',
                'value'       => 'true',
                'description' => 'Master toggle for the referral reward programme',
            ],

            // ── Order boost settings ──────────────────────────────────────
            [
                'key'         => 'order_boost_fee_aud',
                'value'       => '2.00',
                'description' => 'Fee in AUD charged to boost an order to the top of browse results',
            ],
            [
                'key'         => 'order_boost_duration_hours',
                'value'       => '24',
                'description' => 'How many hours an order boost lasts',
            ],
            [
                'key'         => 'order_boost_enabled',
                'value'       => 'true',
                'description' => 'Master toggle for order boost feature',
            ],

            // ── Re-engagement email settings ──────────────────────────────
            [
                'key'         => 'reengage_inactive_days',
                'value'       => '30',
                'description' => 'Days of inactivity before a re-engagement email is sent to a user',
            ],
            [
                'key'         => 'reengage_recipient_days',
                'value'       => '45',
                'description' => 'Days since a recipient last received money before a reminder email is sent',
            ],
            [
                'key'         => 'welcome_email_sequence_enabled',
                'value'       => 'true',
                'description' => 'Whether to send the day-3 and day-7 welcome email sequence to new users',
            ],

            // ── Fraud detection ───────────────────────────────────────────
            [
                'key'         => 'max_orders_per_hour',
                'value'       => '3',
                'description' => 'Maximum orders a user can create per hour before being flagged for fraud review',
            ],
            [
                'key'         => 'auto_flag_tier_limit_orders',
                'value'       => 'true',
                'description' => 'Whether to flag orders where amount is exactly at the KYC tier limit',
            ],
            [
                'key'         => 'auto_review_after_reports',
                'value'       => '3',
                'description' => 'Number of unique user reports before an account is automatically flagged for admin review',
            ],

            // ── Rate chart ────────────────────────────────────────────────
            [
                'key'         => 'rate_chart_default_days',
                'value'       => '7',
                'description' => 'Default number of days shown on the exchange rate history chart',
            ],
            [
                'key'         => 'rate_history_retention_days',
                'value'       => '90',
                'description' => 'How many days of rate history to keep in the rate_history table',
            ],

            // ── Feature flags ─────────────────────────────────────────────
            [
                'key'         => 'leaderboard_enabled',
                'value'       => 'true',
                'description' => 'Show the optional public leaderboard page',
            ],
            [
                'key'         => 'directory_enabled',
                'value'       => 'true',
                'description' => 'Show the business/always-available user directory page',
            ],
            [
                'key'         => 'recurring_orders_enabled',
                'value'       => 'true',
                'description' => 'Allow users to create recurring order schedules',
            ],
            [
                'key'         => 'rate_alerts_enabled',
                'value'       => 'true',
                'description' => 'Allow users to set rate alert notifications',
            ],
            [
                'key'         => 'chat_enabled',
                'value'       => 'true',
                'description' => 'Allow in-transaction chat between matched users',
            ],
            [
                'key'         => 'push_notifications_enabled',
                'value'       => 'true',
                'description' => 'Enable web push notifications (requires VAPID keys configured)',
            ],
            [
                'key'         => 'sms_notifications_enabled',
                'value'       => 'false',
                'description' => 'Enable SMS notifications (requires SMS provider configured in services config)',
            ],
            [
                'key'         => 'whatsapp_notifications_enabled',
                'value'       => 'false',
                'description' => 'Enable WhatsApp notifications (requires WhatsApp Business API configured)',
            ],

            // ── Maintenance mode ──────────────────────────────────────────
            [
                'key'         => 'maintenance_mode',
                'value'       => 'false',
                'description' => 'Put the platform into maintenance mode — no new orders can be created',
            ],
            [
                'key'         => 'maintenance_message',
                'value'       => 'TuMa is undergoing scheduled maintenance. We will be back shortly.',
                'description' => 'Message shown to users when maintenance_mode is true',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->updateOrInsert(
                ['key' => $setting['key']],
                [
                    'value'      => $setting['value'],
                    'description'=> $setting['description'],
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('  ✓ System settings seeded (' . count($settings) . ' settings)');
    }
}
