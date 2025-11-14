<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions grouped by resource
        $permissionGroups = [
            'User' => [
                'view users',
                'create users',
                'edit users',
                'delete users',
            ],
            'Team' => [
                'view teams',
                'create teams',
                'edit teams',
                'delete teams',
            ],
            'Project' => [
                'view projects',
                'create projects',
                'edit projects',
                'delete projects',
            ],
            'Task' => [
                'view tasks',
                'create tasks',
                'edit tasks',
                'delete tasks',
                'complete tasks',
                'approve tasks',
            ],
            'Service' => [
                'view services',
                'create services',
                'edit services',
                'delete services',
            ],
            'MOM' => [
                'view minutes-of-meetings',
                'create minutes-of-meetings',
                'edit minutes-of-meetings',
                'delete minutes-of-meetings',
            ],
            'Payroll' => [
                'view payrolls',
                'create payrolls',
                'edit payrolls',
                'delete payrolls',
            ],
            'Payment' => [
                'view payments',
                'create payments',
                'edit payments',
                'delete payments',
            ],
            'Client Interaction' => [
                'view client-interactions',
                'create client-interactions',
                'edit client-interactions',
                'delete client-interactions',
            ],
            'Holiday' => [
                'view holidays',
                'create holidays',
                'edit holidays',
                'delete holidays',
            ],
            'Salary Slip' => [
                'view salary-slips',
                'generate salary-slips',
                'delete salary-slips',
            ],
            'Permission' => [
                'manage permissions',
                'assign roles',
            ],
        ];

        // Create all permissions
        foreach ($permissionGroups as $group => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
            }
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'Employee', 'guard_name' => 'web']);

        // Assign all permissions to Admin
        $adminRole->syncPermissions(Permission::all());

        // Assign specific permissions to Manager
        $managerPermissions = [
            'view teams',
            'view projects', 'create projects', 'edit projects',
            'view tasks', 'create tasks', 'edit tasks', 'complete tasks', 'approve tasks',
            'view services',
            'view minutes-of-meetings', 'create minutes-of-meetings', 'edit minutes-of-meetings',
            'view client-interactions', 'create client-interactions', 'edit client-interactions',
        ];
        $managerRole->syncPermissions($managerPermissions);

        // Assign basic permissions to Employee
        $employeePermissions = [
            'view projects',
            'view tasks', 'complete tasks',
            'view minutes-of-meetings',
            'view client-interactions',
        ];
        $employeeRole->syncPermissions($employeePermissions);
    }
}
