import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
    {
        title: 'View User',
        href: '#',
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
    team_id: number;
    team_name: string;
    created_at: string;
    updated_at: string;
}

interface UserShowProps {
    user: User;
}

export default function UserShow({ user }: UserShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={users.index().url}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">{user.name}</h1>
                    </div>
                    <Button asChild>
                        <Link href={users.edit(user.id).url}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        First Name
                                    </label>
                                    <p className="mt-1 text-sm">{user.first_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Name
                                    </label>
                                    <p className="mt-1 text-sm">{user.last_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <p className="mt-1 text-sm">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <p className="mt-1 text-sm">{user.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Work Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Work Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Team
                                    </label>
                                    <p className="mt-1 text-sm">{user.team_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        {user.is_active ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">System Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Created At
                                    </label>
                                    <p className="mt-1 text-sm">{user.created_at}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </label>
                                    <p className="mt-1 text-sm">{user.updated_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
