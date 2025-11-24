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
            'Employee' => [
                'view employees',
                'create employees',
                'edit employees',
                'delete employees',
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
            'Leave Request' => [
                'view leave-requests',
                'create leave-requests',
                'edit leave-requests',
                'delete leave-requests',
                'approve leave-requests',
            ],
            'Salary Slip' => [
                'view salary-slips',
                'create salary-slips',
                'edit salary-slips',
                'delete salary-slips',
                'generate salary-slips',
            ],
            'Holiday' => [
                'view holidays',
                'create holidays',
                'edit holidays',
                'delete holidays',
            ],
            'Content Flow' => [
                'view content-flows',
                'create content-flows',
                'edit content-flows',
                'delete content-flows',
            ],
            'Permission' => [
                'manage permissions',
                'assign roles',
            ],
            'Lead' => [
                'view leads',
                'create leads',
                'edit leads',
                'delete leads',
                'upload leads',
                'assign leads',
            ],
            'Call Log' => [
                'view call-logs',
                'create call-logs',
                'edit call-logs',
                'delete call-logs',
            ],
            'Meeting' => [
                'view meetings',
                'create meetings',
                'edit meetings',
                'delete meetings',
                'reschedule meetings',
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
        $scrubbingTeamRole = Role::firstOrCreate(['name' => 'Scrubbing Team', 'guard_name' => 'web']);
        $wfmRole = Role::firstOrCreate(['name' => 'WFM', 'guard_name' => 'web']);
        $callingTeamRole = Role::firstOrCreate(['name' => 'Calling Team', 'guard_name' => 'web']);

        // Assign all permissions to Admin
        $adminRole->syncPermissions(Permission::all());

        // Assign specific permissions to Manager
        $managerPermissions = [
            'view employees',
            'view teams',
            'view projects', 'create projects', 'edit projects',
            'view tasks', 'create tasks', 'edit tasks', 'complete tasks', 'approve tasks',
            'view services',
            'view minutes-of-meetings', 'create minutes-of-meetings', 'edit minutes-of-meetings',
            'view client-interactions', 'create client-interactions', 'edit client-interactions',
            'view leave-requests', 'approve leave-requests',
            'view salary-slips',
            'view holidays',
            'view content-flows', 'create content-flows', 'edit content-flows',
        ];
        $managerRole->syncPermissions($managerPermissions);

        // Assign basic permissions to Employee
        $employeePermissions = [
            'view projects',
            'view tasks', 'complete tasks',
            'view minutes-of-meetings',
            'view client-interactions',
            'view leave-requests', 'create leave-requests',
            'view salary-slips',
            'view holidays',
            'view content-flows',
        ];
        $employeeRole->syncPermissions($employeePermissions);

        // Assign permissions to Scrubbing Team (can upload leads)
        $scrubbingTeamPermissions = [
            'view leads',
            'create leads',
            'upload leads',
        ];
        $scrubbingTeamRole->syncPermissions($scrubbingTeamPermissions);

        // Assign permissions to WFM (can view and assign leads)
        $wfmPermissions = [
            'view leads',
            'edit leads',
            'assign leads',
            'view call-logs',
            'view meetings',
        ];
        $wfmRole->syncPermissions($wfmPermissions);

        // Assign permissions to Calling Team (can view assigned leads, log calls, schedule meetings)
        $callingTeamPermissions = [
            'view leads',
            'edit leads',
            'view call-logs',
            'create call-logs',
            'edit call-logs',
            'view meetings',
            'create meetings',
            'edit meetings',
            'reschedule meetings',
        ];
        $callingTeamRole->syncPermissions($callingTeamPermissions);
    }
}
