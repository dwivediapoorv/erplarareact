import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/data-table';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    team_label: string;
    date_of_joining: string | null;
    date_of_exit: string | null;
    salary: string | null;
    reporting_manager: string | null;
    aadhar_number: string | null;
    pan_number: string | null;
    uan_number: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
}

interface UsersIndexProps {
    users: User[];
    columnPreferences?: Record<string, boolean> | null;
}

export default function UsersIndex({ users: usersList, columnPreferences }: UsersIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const columns: Column<User>[] = [
        {
            key: 'name',
            label: 'Name',
            render: (user) => (
                <Link
                    href={users.show(user.id).url}
                    className="font-medium hover:underline"
                >
                    {user.name}
                </Link>
            ),
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'phone',
            label: 'Phone',
            defaultVisible: true,
            render: (user) => user.phone || 'N/A',
        },
        {
            key: 'team_label',
            label: 'Team',
            defaultVisible: true,
        },
        {
            key: 'date_of_joining',
            label: 'Date of Joining',
            defaultVisible: false,
            render: (user) => user.date_of_joining || 'N/A',
        },
        {
            key: 'date_of_exit',
            label: 'Date of Exit',
            defaultVisible: false,
            render: (user) => user.date_of_exit || 'N/A',
        },
        {
            key: 'salary',
            label: 'Salary',
            defaultVisible: false,
            render: (user) => user.salary ? `₹${user.salary}` : 'N/A',
        },
        {
            key: 'reporting_manager',
            label: 'Reporting Manager',
            defaultVisible: false,
            render: (user) => user.reporting_manager || 'N/A',
        },
        {
            key: 'aadhar_number',
            label: 'Aadhar Number',
            defaultVisible: false,
            render: (user) => user.aadhar_number || 'N/A',
        },
        {
            key: 'pan_number',
            label: 'PAN Number',
            defaultVisible: false,
            render: (user) => user.pan_number || 'N/A',
        },
        {
            key: 'uan_number',
            label: 'UAN Number',
            defaultVisible: false,
            render: (user) => user.uan_number || 'N/A',
        },
        {
            key: 'account_holder_name',
            label: 'Account Holder Name',
            defaultVisible: false,
            render: (user) => user.account_holder_name || 'N/A',
        },
        {
            key: 'account_number',
            label: 'Account Number',
            defaultVisible: false,
            render: (user) => user.account_number || 'N/A',
        },
        {
            key: 'ifsc_code',
            label: 'IFSC Code',
            defaultVisible: false,
            render: (user) => user.ifsc_code || 'N/A',
        },
        {
            key: 'is_active',
            label: 'Status',
            filterable: false,
            render: (user) => (
                user.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Inactive
                    </span>
                )
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <Button asChild>
                        <Link href={users.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={usersList}
                    searchPlaceholder="Search users by name, email, or team..."
                    emptyMessage="No users found"
                    pageName="users.index"
                    savedPreferences={columnPreferences}
                />
            </div>
        </AppLayout>
    );
}
