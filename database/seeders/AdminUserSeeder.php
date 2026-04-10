<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\UserNotificationPreference;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $au = \DB::table('countries')->where('iso_code', 'AU')->value('id');
        $admin = User::create([
            'ulid'              => (string)\Symfony\Component\Uid\Ulid::generate(),
            'first_name'        => 'TuMa',
            'last_name'         => 'Admin',
            'email'             => 'admin@tuma.com',
            'phone'             => '+61400000000',
            'password'          => Hash::make('changeme'),
            'country_id'        => $au,
            'role'              => 'admin',
            'kyc_status'        => 'approved',
            'account_status'    => 'active',
            'referral_code'     => 'TUMAADMIN',
            'email_verified_at' => now(),
        ]);
        UserNotificationPreference::create(['user_id' => $admin->id, 'email_notifications' => 1, 'inapp_notifications' => 1, 'sms_notifications' => 0, 'whatsapp_notifications' => 0, 'push_notifications' => 1]);
    }
}