import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, Users, Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

interface Permission {
    id: number;
    name: string;
    label: string;
}

interface Role {
    id: number;
    name: string;
    permissions: number[];
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: number[];
    permissions: number[];
}

interface PermissionGroups {
    [key: string]: Permission[];
}

interface PermissionsIndexProps {
    permissionGroups: PermissionGroups;
    roles: Role[];
    users: User[];
}

export default function PermissionsIndex({
    permissionGroups,
    roles,
    users,
}: PermissionsIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [selectedRole, setSelectedRole] = useState<number | null>(
        roles.length > 0 ? roles[0].id : null
    );
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [rolePermissions, setRolePermissions] = useState<number[]>([]);
    const [userPermissions, setUserPermissions] = useState<number[]>([]);
    const [userRoles, setUserRoles] = useState<number[]>([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
    const [editingRoleName, setEditingRoleName] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Update role permissions when selected role changes
    useEffect(() => {
        if (selectedRole) {
            const role = roles.find((r) => r.id === selectedRole);
            setRolePermissions(role?.permissions || []);
        }
    }, [selectedRole, roles]);

    // Update user permissions and roles when selected user changes
    useEffect(() => {
        if (selectedUser) {
            const user = users.find((u) => u.id === selectedUser);
            setUserPermissions(user?.permissions || []);
            setUserRoles(user?.roles || []);
        }
    }, [selectedUser, users]);

    const handleRolePermissionToggle = (permissionId: number) => {
        setRolePermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleUserPermissionToggle = (permissionId: number) => {
        setUserPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleUserRoleToggle = (roleId: number) => {
        setUserRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSaveRolePermissions = () => {
        if (!selectedRole) return;

        router.patch(
            `/permissions/roles/${selectedRole}`,
            {
                permissions: rolePermissions,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleSaveUserPermissions = () => {
        if (!selectedUser) return;

        router.patch(
            `/permissions/users/${selectedUser}/permissions`,
            {
                permissions: userPermissions,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleSaveUserRoles = () => {
        if (!selectedUser) return;

        router.patch(
            `/permissions/users/${selectedUser}/roles`,
            {
                roles: userRoles,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleCreateRole = () => {
        if (!newRoleName.trim()) return;

        router.post(
            '/permissions/roles',
            {
                name: newRoleName,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewRoleName('');
                },
            }
        );
    };

    const handleStartEditRole = (role: Role) => {
        setEditingRoleId(role.id);
        setEditingRoleName(role.name);
    };

    const handleCancelEditRole = () => {
        setEditingRoleId(null);
        setEditingRoleName('');
    };

    const handleSaveRoleName = () => {
        if (!editingRoleId || !editingRoleName.trim()) return;

        router.put(
            `/permissions/roles/${editingRoleId}/name`,
            {
                name: editingRoleName,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingRoleId(null);
                    setEditingRoleName('');
                },
            }
        );
    };

    const handleDeleteRole = (roleId: number) => {
        if (!confirm('Are you sure you want to delete this role?')) return;

        router.delete(`/permissions/roles/${roleId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedRole === roleId && roles.length > 0) {
                    const remainingRoles = roles.filter((r) => r.id !== roleId);
                    setSelectedRole(
                        remainingRoles.length > 0 ? remainingRoles[0].id : null
                    );
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {showError && flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Permissions Management
                    </h1>
                </div>

                <Tabs defaultValue="roles" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="roles">
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Roles
                        </TabsTrigger>
                        <TabsTrigger value="users">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Users
                        </TabsTrigger>
                    </TabsList>

                    {/* Role Permissions Tab */}
                    <TabsContent value="roles" className="space-y-4">
                        {/* Create New Role Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Role</CardTitle>
                                <CardDescription>
                                    Add a new role to the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter role name"
                                        value={newRoleName}
                                        onChange={(e) =>
                                            setNewRoleName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCreateRole();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleCreateRole}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Role
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Manage Existing Roles Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Roles</CardTitle>
                                <CardDescription>
                                    Edit role names or delete roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center gap-2 rounded-lg border p-3"
                                    >
                                        {editingRoleId === role.id ? (
                                            <>
                                                <Input
                                                    value={editingRoleName}
                                                    onChange={(e) =>
                                                        setEditingRoleName(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSaveRoleName();
                                                        } else if (
                                                            e.key === 'Escape'
                                                        ) {
                                                            handleCancelEditRole();
                                                        }
                                                    }}
                                                    className="flex-1"
                                                    autoFocus
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleSaveRoleName}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancelEditRole}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="flex-1 font-medium">
                                                    {role.name}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleStartEditRole(role)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {role.name !== 'super-admin' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteRole(
                                                                role.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Role Permissions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Role Permissions</CardTitle>
                                <CardDescription>
                                    Select a role and assign permissions to it
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Select Role</Label>
                                    <Select
                                        value={selectedRole?.toString()}
                                        onValueChange={(value) =>
                                            setSelectedRole(parseInt(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.id.toString()}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedRole && (
                                    <>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {Object.entries(
                                                permissionGroups
                                            ).map(([group, permissions]) => (
                                                <div
                                                    key={group}
                                                    className="space-y-3 rounded-lg border p-4"
                                                >
                                                    <h3 className="font-semibold">
                                                        {group} Permissions
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {permissions.map(
                                                            (permission) => (
                                                                <div
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        id={`role-${permission.id}`}
                                                                        checked={rolePermissions.includes(
                                                                            permission.id
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            handleRolePermissionToggle(
                                                                                permission.id
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`role-${permission.id}`}
                                                                        className="cursor-pointer text-sm font-normal"
                                                                    >
                                                                        {
                                                                            permission.label
                                                                        }
                                                                    </Label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleSaveRolePermissions}
                                        >
                                            Save Role Permissions
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* User Permissions Tab */}
                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Permissions & Roles</CardTitle>
                                <CardDescription>
                                    Select a user and assign roles or specific
                                    permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Select User</Label>
                                    <Select
                                        value={selectedUser?.toString() || ''}
                                        onValueChange={(value) =>
                                            setSelectedUser(parseInt(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id.toString()}
                                                >
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedUser && (
                                    <>
                                        {/* User Roles Section */}
                                        <div className="space-y-3 rounded-lg border p-4">
                                            <h3 className="font-semibold">
                                                Assign Roles
                                            </h3>
                                            <div className="space-y-2">
                                                {roles.map((role) => (
                                                    <div
                                                        key={role.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`user-role-${role.id}`}
                                                            checked={userRoles.includes(
                                                                role.id
                                                            )}
                                                            onCheckedChange={() =>
                                                                handleUserRoleToggle(
                                                                    role.id
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`user-role-${role.id}`}
                                                            className="cursor-pointer text-sm font-normal"
                                                        >
                                                            {role.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                onClick={handleSaveUserRoles}
                                                size="sm"
                                            >
                                                Save Roles
                                            </Button>
                                        </div>

                                        {/* User Direct Permissions Section */}
                                        <div className="space-y-3">
                                            <h3 className="font-semibold">
                                                Direct Permissions (Optional)
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Assign specific permissions in
                                                addition to role permissions
                                            </p>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {Object.entries(
                                                    permissionGroups
                                                ).map(
                                                    ([group, permissions]) => (
                                                        <div
                                                            key={group}
                                                            className="space-y-3 rounded-lg border p-4"
                                                        >
                                                            <h4 className="font-semibold text-sm">
                                                                {group}{' '}
                                                                Permissions
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {permissions.map(
                                                                    (
                                                                        permission
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                permission.id
                                                                            }
                                                                            className="flex items-center space-x-2"
                                                                        >
                                                                            <Checkbox
                                                                                id={`user-perm-${permission.id}`}
                                                                                checked={userPermissions.includes(
                                                                                    permission.id
                                                                                )}
                                                                                onCheckedChange={() =>
                                                                                    handleUserPermissionToggle(
                                                                                        permission.id
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Label
                                                                                htmlFor={`user-perm-${permission.id}`}
                                                                                className="cursor-pointer text-sm font-normal"
                                                                            >
                                                                                {
                                                                                    permission.label
                                                                                }
                                                                            </Label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Button
                                                onClick={
                                                    handleSaveUserPermissions
                                                }
                                            >
                                                Save User Permissions
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
