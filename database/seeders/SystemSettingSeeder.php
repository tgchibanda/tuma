<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['platform_fee_percent', '1.5', 'Platform fee percentage charged on agreed AUD amount'],
            ['order_expiry_hours', '48', 'Hours before unmatched order auto-expires'],
            ['min_order_amount_aud', '50', 'Minimum order size in AUD'],
            ['max_order_amount_aud', '5000', 'Maximum order size in AUD'],
            ['new_user_limit_aud', '300', 'Max AUD for users with fewer than 5 trades'],
            ['mid_user_limit_aud', '1500', 'Max AUD for users with 5-19 trades'],
            ['confirmation_window_hours', '24', 'Hours recipient has to confirm cash before dispute auto-raised'],
            ['negotiation_round_hours', '2', 'Hours each party has to respond per negotiation round'],
            ['max_negotiation_rounds', '5', 'Max back-and-forth rounds before auto-cancel'],
            ['risk_deposit_window_hours', '24', 'Hours sender has to deposit after confirming risk delivery'],
            ['delivery_method_timeout_hours', '2', 'Hours to choose delivery method before match auto-cancels'],
            ['risk_delivery_enabled', 'true', 'Master toggle for risk delivery option'],
            ['secure_delivery_enabled', 'true', 'Master toggle for secure delivery option'],
            ['zim_contact_verification_enabled', 'false', 'Enable SMS verification of Zimbabwe recipient phone numbers'],
            ['tuma_bank_name', 'National Australia Bank', 'SwapRemit bank name for deposits'],
            ['tuma_account_name', 'TuMa Pty Ltd Trust Account', 'Account name for deposits'],
            ['tuma_bsb', '000-000', 'BSB for Australian deposits'],
            ['tuma_account_number', '000000000', 'Account number for Australian deposits'],
            ['order_boost_fee_aud', '2.00', 'Cost to boost an order to top of browse list'],
            ['order_boost_duration_hours', '24', 'How long a boost lasts'],
            ['order_boost_enabled', 'true', 'Master toggle for order boost feature'],
            ['referral_discount_percent', '50', 'Percentage fee discount for referrer and referred on first trade'],
            ['referral_reward_enabled', 'true', 'Enable referral reward programme'],
            ['reengage_inactive_days', '30', 'Days of inactivity before re-engagement email'],
            ['reengage_recipient_days', '45', 'Days since last send to saved recipient before reminder'],
            ['welcome_email_sequence_enabled', 'true', 'Send 3-email welcome sequence to new users'],
            ['max_orders_per_hour', '3', 'Fraud flag: max orders a user can create in 1 hour'],
            ['auto_review_after_reports', '3', 'Auto-flag account for review after this many reports'],
            ['risk_score_auto_hold_threshold', '80', 'Risk score above which transaction is auto-held'],
            ['rate_history_retention_days', '90', 'Days to keep rate history records'],
            ['rate_chart_default_days', '7', 'Default days shown on rate chart'],
            ['leaderboard_enabled', 'true', 'Show public leaderboard'],
            ['directory_enabled', 'true', 'Show always-available user directory'],
            ['recurring_orders_enabled', 'true', 'Allow recurring order creation'],
            ['rate_alerts_enabled', 'true', 'Allow users to set rate alerts'],
            ['chat_enabled', 'true', 'Enable in-transaction chat'],
            ['push_notifications_enabled', 'true', 'Enable web push notifications'],
            ['sms_notifications_enabled', 'false', 'Enable SMS notifications'],
            ['whatsapp_notifications_enabled', 'false', 'Enable WhatsApp notifications'],
            ['maintenance_mode', 'false', 'Put platform in maintenance mode'],
            ['maintenance_message', 'TuMa is undergoing scheduled maintenance. Please check back soon.', 'Message shown during maintenance'],
        ];
        foreach ($settings as [$key, $value, $desc]) {
            DB::table('system_settings')->insert(['key' => $key, 'value' => $value, 'description' => $desc, 'updated_at' => now()]);
        }
    }
}