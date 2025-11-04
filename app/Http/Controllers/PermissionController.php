<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display the permission management page.
     */
    public function index(): Response
    {
        // Get all permissions grouped by resource
        $allPermissions = Permission::all();

        $permissionGroups = [
            'User' => ['view users', 'create users', 'edit users', 'delete users'],
            'Team' => ['view teams', 'create teams', 'edit teams', 'delete teams'],
            'Project' => ['view projects', 'create projects', 'edit projects', 'delete projects'],
            'Task' => ['view tasks', 'create tasks', 'edit tasks', 'delete tasks', 'complete tasks', 'approve tasks'],
            'Service' => ['view services', 'create services', 'edit services', 'delete services'],
            'MOM' => ['view minutes-of-meetings', 'create minutes-of-meetings', 'edit minutes-of-meetings', 'delete minutes-of-meetings'],
            'Payroll' => ['view payrolls', 'create payrolls', 'edit payrolls', 'delete payrolls'],
            'Payment' => ['view payments', 'create payments', 'edit payments', 'delete payments'],
            'Client Interaction' => ['view client-interactions', 'create client-interactions', 'edit client-interactions', 'delete client-interactions'],
            'Permission' => ['manage permissions', 'assign roles'],
        ];

        // Format permissions with their IDs
        $formattedPermissions = [];
        foreach ($permissionGroups as $group => $permissionNames) {
            $formattedPermissions[$group] = [];
            foreach ($permissionNames as $permName) {
                $permission = $allPermissions->firstWhere('name', $permName);
                if ($permission) {
                    // Extract the action prefix (view, create, edit, etc.)
                    $prefix = $this->getResourcePrefix($permName);
                    $label = $prefix ? ucfirst(trim($prefix)) : ucwords(str_replace('-', ' ', $permName));

                    $formattedPermissions[$group][] = [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'label' => $label,
                    ];
                }
            }
        }

        // Get all roles with their permissions
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('id')->toArray(),
            ];
        });

        // Get all users with their roles and permissions
        $users = User::with(['roles', 'permissions'])
            ->where('is_active', true)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('id')->toArray(),
                    'permissions' => $user->permissions->pluck('id')->toArray(),
                ];
            });

        return Inertia::render('permissions/index', [
            'permissionGroups' => $formattedPermissions,
            'roles' => $roles,
            'users' => $users,
        ]);
    }

    /**
     * Update role permissions.
     */
    public function updateRolePermissions(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('permissions.index')->with('success', 'Role permissions updated successfully.');
    }

    /**
     * Update user permissions.
     */
    public function updateUserPermissions(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        // Sync the direct permissions for this user
        $user->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('permissions.index')->with('success', 'User permissions updated successfully.');
    }

    /**
     * Assign roles to user.
     */
    public function assignRoles(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => ['array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        $user->syncRoles($validated['roles'] ?? []);

        return redirect()->route('permissions.index')->with('success', 'User roles updated successfully.');
    }

    /**
     * Get resource prefix from permission name.
     */
    private function getResourcePrefix(string $permissionName): string
    {
        $prefixes = ['view ', 'create ', 'edit ', 'delete ', 'complete ', 'approve ', 'manage ', 'assign '];
        foreach ($prefixes as $prefix) {
            if (str_starts_with($permissionName, $prefix)) {
                return $prefix;
            }
        }
        return '';
    }
}
