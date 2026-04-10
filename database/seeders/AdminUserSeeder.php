<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\Uid\Ulid;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $australiaId = DB::table('countries')->where('iso_code', 'AU')->value('id');

        // Generate unique referral code
        do {
            $referralCode = strtoupper(Str::random(8));
        } while (DB::table('users')->where('referral_code', $referralCode)->exists());

        $adminId = DB::table('users')->updateOrInsert(
            ['email' => 'admin@tuma.com'],
            [
                'ulid'              => (string) new Ulid(),
                'first_name'        => 'TuMa',
                'last_name'         => 'Admin',
                'email'             => 'admin@tuma.com',
                'email_verified_at' => now(),
                'phone'             => '+61400000000',
                'phone_verified_at' => now(),
                'password'          => Hash::make('changeme'),
                'country_id'        => $australiaId,
                'role'              => 'admin',
                'kyc_status'        => 'approved',
                'account_status'    => 'active',
                'referral_code'     => $referralCode,
                'onboarding_completed' => 1,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]
        );

        // Get the admin user ID for the notification preferences
        $admin = DB::table('users')->where('email', 'admin@tuma.com')->first();

        if ($admin) {
            // Create notification preferences for admin
            DB::table('user_notification_preferences')->updateOrInsert(
                ['user_id' => $admin->id],
                [
                    'user_id'                    => $admin->id,
                    'email_notifications'        => 1,
                    'inapp_notifications'        => 1,
                    'sms_notifications'          => 0,
                    'whatsapp_notifications'     => 0,
                    'push_notifications'         => 1,
                    'notify_rate_alerts'         => 1,
                    'notify_match_proposals'     => 1,
                    'notify_chat_messages'       => 1,
                    'notify_transaction_updates' => 1,
                    'notify_marketing'           => 0,
                    'created_at'                 => now(),
                    'updated_at'                 => now(),
                ]
            );
        }

        $this->command->info('  ✓ Admin user seeded (admin@tuma.com / changeme)');
        $this->command->warn('  ⚠ IMPORTANT: Change the admin password immediately after first login!');
    }
}
