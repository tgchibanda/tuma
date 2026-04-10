<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Order matters — foreign key dependencies must be seeded first.
     *
     * 1.  SystemSettingSeeder       — no dependencies
     * 2.  CountrySeeder             — no dependencies
     * 3.  DeliveryLocationSeeder    — requires countries
     * 4.  ExchangeRateSeeder        — no dependencies
     * 5.  AchievementSeeder         — no dependencies
     * 6.  AdminUserSeeder           — requires countries
     * 7.  PublicHolidaySeeder       — requires countries
     * 8.  NoticeBoardSeeder         — requires admin user
     * 9.  TransactionFeedSeeder     — no hard dependencies (is_demo = true)
     * 10. DemoUserSeeder            — requires countries, delivery_locations (optional)
     */
    public function run(): void
    {
        $this->call([
            SystemSettingSeeder::class,
            CountrySeeder::class,
            DeliveryLocationSeeder::class,
            ExchangeRateSeeder::class,
            AchievementSeeder::class,
            AdminUserSeeder::class,
            PublicHolidaySeeder::class,
            NoticeBoardSeeder::class,
            TransactionFeedSeeder::class,
        ]);

        $this->command->info('');
        $this->command->info('✓ TuMa database seeded successfully.');
        $this->command->info('  Admin login: admin@tuma.com / changeme');
        $this->command->info('');
    }
}
