import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, CheckCircle, Eye, Pencil } from 'lucide-react';
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
    team_label: string;
}

interface UsersIndexProps {
    users: User[];
}

export default function UsersIndex({ users: usersList }: UsersIndexProps) {
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
                <span className="font-medium">{user.name}</span>
            ),
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'team_label',
            label: 'Team',
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
        {
            key: 'actions',
            label: 'Actions',
            filterable: false,
            render: (user) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={users.show(user.id).url}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={users.edit(user.id).url}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Link>
                    </Button>
                </div>
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
                />
            </div>
        </AppLayout>
    );
}
