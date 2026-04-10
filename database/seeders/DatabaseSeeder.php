<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            DeliveryLocationSeeder::class,
            ExchangeRateSeeder::class,
            SystemSettingSeeder::class,
            AdminUserSeeder::class,
            AchievementSeeder::class,
            PublicHolidaySeeder::class,
            TransactionFeedSeeder::class,
            NoticeboardSeeder::class,
        ]);
    }
}
