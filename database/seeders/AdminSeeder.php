<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the admin user
        $user = User::create([
            'name' => 'Apoorv Dwivedi',
            'email' => 'apoorv@digirockett.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create the corresponding employee record
        Employee::create([
            'user_id' => $user->id,
            'first_name' => 'Apoorv',
            'last_name' => 'Dwivedi',
            'phone' => '+919711574747',
            'team_id' => '1', // Assign to a team if necessary
        ]);
    }
}
