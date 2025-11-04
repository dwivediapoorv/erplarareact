<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Admin role
        $adminRole = Role::where('name', 'Admin')->first();

        if (!$adminRole) {
            $this->command->error('Admin role not found! Please run RoleAndPermissionSeeder first.');
            return;
        }

        // List of admin user emails
        $adminEmails = [
            'apoorv@digirockett.com',
            'shubh@digirockett.com',
            'sunny@digirockett.com',
        ];

        foreach ($adminEmails as $email) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Assign Admin role to user
                $user->assignRole($adminRole);
                $this->command->info("Admin role assigned to {$user->name} ({$user->email})");
            } else {
                $this->command->warn("User with email {$email} not found. Skipping...");
            }
        }
    }
}
