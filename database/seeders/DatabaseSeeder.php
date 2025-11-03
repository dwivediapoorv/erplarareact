<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in order (teams first, then services, then users, then projects)
        $this->call([
            TeamSeeder::class,
            ServicesSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
