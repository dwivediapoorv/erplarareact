import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
    {
        title: 'Create User',
        href: users.create().url,
    },
];

interface Team {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface CreateUserProps {
    teams: Team[];
    roles: Role[];
}

export default function CreateUser({ teams, roles }: CreateUserProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        team_id: '',
        roles: [] as number[],
    });

    const handleRoleToggle = (roleId: number) => {
        const updatedRoles = data.roles.includes(roleId)
            ? data.roles.filter((id) => id !== roleId)
            : [...data.roles, roleId];
        setData('roles', updatedRoles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(users.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create User</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="first_name">
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="last_name">
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.phone} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Team */}
                            <div className="space-y-2">
                                <Label htmlFor="team_id">
                                    Team <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.team_id}
                                    onValueChange={(value) =>
                                        setData('team_id', value)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((team) => (
                                            <SelectItem
                                                key={team.id}
                                                value={team.id.toString()}
                                            >
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.team_id} />
                            </div>
                        </div>

                        {/* Roles Section */}
                        <div className="space-y-3 rounded-lg border p-4">
                            <h3 className="font-semibold">Assign Roles</h3>
                            <p className="text-sm text-muted-foreground">
                                Select one or more roles for this user
                            </p>
                            <div className="grid gap-3 md:grid-cols-2">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.id)}
                                            onCheckedChange={() =>
                                                handleRoleToggle(role.id)
                                            }
                                        />
                                        <Label
                                            htmlFor={`role-${role.id}`}
                                            className="cursor-pointer text-sm font-normal"
                                        >
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.roles} />
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
