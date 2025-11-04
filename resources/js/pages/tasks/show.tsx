import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasks.index().url,
    },
    {
        title: 'View Task',
        href: '#',
    },
];

interface Task {
    id: number;
    name: string;
    description: string | null;
    creator_name: string;
    assignee_name: string;
    project_name: string;
    project_id: number;
    status: 'Pending' | 'Completed' | 'Approved';
    due_date: string | null;
    completed_at: string | null;
    approver_name: string | null;
    created_at: string;
}

interface TaskShowProps {
    task: Task;
}

export default function TaskShow({ task }: TaskShowProps) {
    const getStatusVariant = (status: string) => {
        if (status === 'Pending') return 'outline';
        if (status === 'Completed') return 'default';
        return 'default';
    };

    const getStatusColor = (status: string) => {
        if (status === 'Pending') return 'text-yellow-600 dark:text-yellow-400';
        if (status === 'Completed') return 'text-blue-600 dark:text-blue-400';
        return 'text-green-600 dark:text-green-400';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${task.name} - Task Details`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={tasks.index().url}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">#{task.id} - {task.name}</h1>
                        </div>
                    </div>
                    <Badge variant={getStatusVariant(task.status)} className={getStatusColor(task.status)}>
                        {task.status}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    {/* Task Information */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border md:col-span-3">
                        <h2 className="text-lg font-semibold mb-4">Task Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </label>
                                <p className="mt-1 text-sm whitespace-pre-wrap">
                                    {task.description || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Task Details */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border md:col-span-1">
                        <h2 className="text-lg font-semibold mb-4">Task Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Project
                                </label>
                                <p className="mt-1 text-sm">
                                    <Link
                                        href={projects.show(task.project_id).url}
                                        className="hover:underline"
                                    >
                                        {task.project_name}
                                    </Link>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created By
                                </label>
                                <p className="mt-1 text-sm">{task.creator_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Assigned To
                                </label>
                                <p className="mt-1 text-sm">{task.assignee_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created Date
                                </label>
                                <p className="mt-1 text-sm">{task.created_at}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Due Date
                                </label>
                                <p className="mt-1 text-sm">{task.due_date || 'Not set'}</p>
                            </div>
                            {task.completed_at && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Completed Date
                                    </label>
                                    <p className="mt-1 text-sm">{task.completed_at}</p>
                                </div>
                            )}
                            {task.approver_name && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Approved By
                                    </label>
                                    <p className="mt-1 text-sm">{task.approver_name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
