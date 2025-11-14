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

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface CreateUserProps {
    teams: Team[];
    roles: Role[];
    employees: Employee[];
}

export default function CreateUser({ teams, roles, employees }: CreateUserProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        ein: '',
        designation: '',
        gender: '',
        team_id: '',
        roles: [] as number[],
        date_of_joining: '',
        date_of_exit: '',
        salary: '',
        reporting_manager_id: '',
        aadhar_number: '',
        pan_number: '',
        uan_number: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
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

                            {/* Employee ID (EIN) */}
                            <div className="space-y-2">
                                <Label htmlFor="ein">Employee ID (EIN)</Label>
                                <Input
                                    id="ein"
                                    type="text"
                                    value={data.ein}
                                    onChange={(e) =>
                                        setData('ein', e.target.value)
                                    }
                                    placeholder="e.g., EMP001"
                                />
                                <InputError message={errors.ein} />
                            </div>

                            {/* Designation */}
                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    type="text"
                                    value={data.designation}
                                    onChange={(e) =>
                                        setData('designation', e.target.value)
                                    }
                                    placeholder="e.g., Software Engineer"
                                />
                                <InputError message={errors.designation} />
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData('gender', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
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

                            {/* Date of Joining */}
                            <div className="space-y-2">
                                <Label htmlFor="date_of_joining">Date of Joining</Label>
                                <Input
                                    id="date_of_joining"
                                    type="date"
                                    value={data.date_of_joining}
                                    onChange={(e) => setData('date_of_joining', e.target.value)}
                                />
                                <InputError message={errors.date_of_joining} />
                            </div>

                            {/* Date of Exit */}
                            <div className="space-y-2">
                                <Label htmlFor="date_of_exit">Date of Exit</Label>
                                <Input
                                    id="date_of_exit"
                                    type="date"
                                    value={data.date_of_exit}
                                    onChange={(e) => setData('date_of_exit', e.target.value)}
                                />
                                <InputError message={errors.date_of_exit} />
                            </div>

                            {/* Salary */}
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    step="0.01"
                                    value={data.salary}
                                    onChange={(e) => setData('salary', e.target.value)}
                                    placeholder="0.00"
                                />
                                <InputError message={errors.salary} />
                            </div>

                            {/* Reporting Manager */}
                            <div className="space-y-2">
                                <Label htmlFor="reporting_manager_id">Reporting Manager</Label>
                                <Select
                                    value={data.reporting_manager_id}
                                    onValueChange={(value) => setData('reporting_manager_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reporting manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                {emp.first_name} {emp.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.reporting_manager_id} />
                            </div>

                            {/* Aadhar Number */}
                            <div className="space-y-2">
                                <Label htmlFor="aadhar_number">Aadhar Card Number</Label>
                                <Input
                                    id="aadhar_number"
                                    type="text"
                                    value={data.aadhar_number}
                                    onChange={(e) => setData('aadhar_number', e.target.value)}
                                    placeholder="XXXX-XXXX-XXXX"
                                />
                                <InputError message={errors.aadhar_number} />
                            </div>

                            {/* PAN Number */}
                            <div className="space-y-2">
                                <Label htmlFor="pan_number">PAN Card Number</Label>
                                <Input
                                    id="pan_number"
                                    type="text"
                                    value={data.pan_number}
                                    onChange={(e) => setData('pan_number', e.target.value)}
                                    placeholder="ABCDE1234F"
                                />
                                <InputError message={errors.pan_number} />
                            </div>

                            {/* UAN Number */}
                            <div className="space-y-2">
                                <Label htmlFor="uan_number">UAN Number</Label>
                                <Input
                                    id="uan_number"
                                    type="text"
                                    value={data.uan_number}
                                    onChange={(e) => setData('uan_number', e.target.value)}
                                    placeholder="XXXXXXXXXXXX"
                                />
                                <InputError message={errors.uan_number} />
                            </div>

                            {/* Account Holder Name */}
                            <div className="space-y-2">
                                <Label htmlFor="account_holder_name">Account Holder Name</Label>
                                <Input
                                    id="account_holder_name"
                                    type="text"
                                    value={data.account_holder_name}
                                    onChange={(e) => setData('account_holder_name', e.target.value)}
                                />
                                <InputError message={errors.account_holder_name} />
                            </div>

                            {/* Account Number */}
                            <div className="space-y-2">
                                <Label htmlFor="account_number">Bank Account Number</Label>
                                <Input
                                    id="account_number"
                                    type="text"
                                    value={data.account_number}
                                    onChange={(e) => setData('account_number', e.target.value)}
                                />
                                <InputError message={errors.account_number} />
                            </div>

                            {/* IFSC Code */}
                            <div className="space-y-2">
                                <Label htmlFor="ifsc_code">IFSC Code</Label>
                                <Input
                                    id="ifsc_code"
                                    type="text"
                                    value={data.ifsc_code}
                                    onChange={(e) => setData('ifsc_code', e.target.value)}
                                    placeholder="ABCD0123456"
                                />
                                <InputError message={errors.ifsc_code} />
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
