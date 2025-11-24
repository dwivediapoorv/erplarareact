<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\ReportingManagerSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in order (teams first, then services, roles/permissions, then users, assign admin/hr roles, then projects)
        $this->call([
            TeamSeeder::class,
            ServicesSeeder::class,
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            AdminUserSeeder::class,
            HRSeeder::class,
            ProjectSeeder::class,
            ReportingManagerSeeder::class
        ]);
    }
}
