<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class HRSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create HR role if it doesn't exist
        $hrRole = Role::firstOrCreate(['name' => 'HR', 'guard_name' => 'web']);

        // Define HR permissions
        $hrPermissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Employee permissions
            'view employees',
            'create employees',
            'edit employees',
            'delete employees',

            // Permission permissions
            'assign roles',
        ];

        // Assign permissions to HR role
        $hrRole->syncPermissions($hrPermissions);

        $this->command->info('HR role created/updated with permissions.');

        // List of HR user emails (you can add actual HR emails here)
        $hrEmails = [
            // Add HR user emails here
             'hrconnect@digirockett.com',
        ];

        foreach ($hrEmails as $email) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Assign HR role to user
                $user->assignRole($hrRole);
                $this->command->info("HR role assigned to {$user->name} ({$user->email})");
            } else {
                $this->command->warn("User with email {$email} not found. Skipping...");
            }
        }

        if (empty($hrEmails)) {
            $this->command->info('No HR user emails defined. HR role created but not assigned to any users.');
        }
    }
}
