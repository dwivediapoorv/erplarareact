import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface UserWithTasks {
    id: number;
    name: string;
    open_tasks_count: number;
}

interface DashboardProps {
    activeUsersCount: number;
    totalProjects: number;
    openTasksCount: number;
    greenProjectsCount: number;
    orangeProjectsCount: number;
    redProjectsCount: number;
    usersWithOpenTasks: UserWithTasks[];
}

export default function Dashboard({
    activeUsersCount,
    totalProjects,
    openTasksCount,
    greenProjectsCount,
    orangeProjectsCount,
    redProjectsCount,
    usersWithOpenTasks
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Active Users Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                        <h3 className="text-3xl font-bold mt-2">{activeUsersCount}</h3>
                    </div>

                    {/* Total Projects Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                        <h3 className="text-3xl font-bold mt-2">{totalProjects}</h3>
                    </div>

                    {/* Open Tasks Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Open Tasks</p>
                        <h3 className="text-3xl font-bold mt-2">{openTasksCount}</h3>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Green Projects Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Green Projects</p>
                        <h3 className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{greenProjectsCount}</h3>
                    </div>

                    {/* Orange Projects Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Orange Projects</p>
                        <h3 className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">{orangeProjectsCount}</h3>
                    </div>

                    {/* Red Projects Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <p className="text-sm font-medium text-muted-foreground">Red Projects</p>
                        <h3 className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{redProjectsCount}</h3>
                    </div>
                </div>

                {/* Users with Open Tasks Table */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 bg-muted/50 p-4 dark:border-sidebar-border">
                        <h3 className="text-lg font-semibold">Open Tasks</h3>
                        {/* <p className="text-sm text-muted-foreground mt-1">
                            {usersWithOpenTasks.length} user{usersWithOpenTasks.length !== 1 ? 's' : ''} with pending tasks
                        </p> */}
                    </div>
                    <div className="overflow-x-auto">
                        {usersWithOpenTasks.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No users with open tasks</p>
                        ) : (
                            <table className="w-full">
                                <thead className="border-b border-sidebar-border/50 bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">Tasks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {usersWithOpenTasks.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-sm">{user.name}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium">{user.open_tasks_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
