import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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

interface DashboardProps {
    activeUsersCount: number;
    totalProjects: number;
    openTasksCount: number;
}

export default function Dashboard({ activeUsersCount, totalProjects, openTasksCount }: DashboardProps) {
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
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
