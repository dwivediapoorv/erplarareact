import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { CheckCircle, Plus, CheckCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasks.index().url,
    },
];

interface TaskCreatedByUser {
    id: number;
    name: string;
    description: string | null;
    assignee_name: string;
    project_name: string;
    status: 'Pending' | 'Completed' | 'Approved';
    due_date: string | null;
    completed_at: string | null;
    approver_name: string | null;
    created_at: string;
}

interface TaskAssignedToUser {
    id: number;
    name: string;
    description: string | null;
    creator_name: string;
    project_name: string;
    status: 'Pending' | 'Completed' | 'Approved';
    due_date: string | null;
    completed_at: string | null;
    approver_name: string | null;
    created_at: string;
}

interface TasksIndexProps {
    tasksCreatedByUser: TaskCreatedByUser[];
    tasksAssignedToUser: TaskAssignedToUser[];
}

export default function TasksIndex({ tasksCreatedByUser, tasksAssignedToUser }: TasksIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleComplete = (taskId: number) => {
        router.patch(tasks.complete(taskId).url, {}, {
            preserveScroll: true,
        });
    };

    const handleApprove = (taskId: number) => {
        router.patch(tasks.approve(taskId).url, {}, {
            preserveScroll: true,
        });
    };

    const getStatusBadgeClasses = (status: string) => {
        if (status === 'Pending') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        } else if (status === 'Completed') {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        } else {
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <Button asChild>
                        <Link href={tasks.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Task
                        </Link>
                    </Button>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Tasks Assigned to User */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 bg-muted/50 p-4 dark:border-sidebar-border">
                            <h3 className="text-lg font-semibold">Tasks Assigned to You</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {tasksAssignedToUser.length} task{tasksAssignedToUser.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto p-4">
                            {tasksAssignedToUser.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No tasks assigned to you
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {tasksAssignedToUser.map((task) => (
                                        <div
                                            key={task.id}
                                            className="group rounded-lg border border-sidebar-border/50 bg-background p-3 hover:border-sidebar-border hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <Link
                                                    href={tasks.show(task.id).url}
                                                    className="flex-1 min-w-0"
                                                >
                                                    <h4 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-2">
                                                        {task.name}
                                                    </h4>
                                                </Link>
                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusBadgeClasses(task.status)}`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    {task.project_name}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-sidebar-border/30">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">By:</span> {task.creator_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">Due:</span> {task.due_date || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            {task.status === 'Pending' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-3"
                                                    onClick={() => handleComplete(task.id)}
                                                >
                                                    <CheckCheck className="h-4 w-4 mr-1.5" />
                                                    Mark as Complete
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tasks Created by User */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 bg-muted/50 p-4 dark:border-sidebar-border">
                            <h3 className="text-lg font-semibold">Tasks You Created</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {tasksCreatedByUser.length} task{tasksCreatedByUser.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto p-4">
                            {tasksCreatedByUser.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No tasks created by you
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {tasksCreatedByUser.map((task) => (
                                        <div
                                            key={task.id}
                                            className="group rounded-lg border border-sidebar-border/50 bg-background p-3 hover:border-sidebar-border hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <Link
                                                    href={tasks.show(task.id).url}
                                                    className="flex-1 min-w-0"
                                                >
                                                    <h4 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-2">
                                                        {task.name}
                                                    </h4>
                                                </Link>
                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusBadgeClasses(task.status)}`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    {task.project_name}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-sidebar-border/30">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">To:</span> {task.assignee_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">Due:</span> {task.due_date || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            {task.status === 'Completed' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-3"
                                                    onClick={() => handleApprove(task.id)}
                                                >
                                                    <BadgeCheck className="h-4 w-4 mr-1.5" />
                                                    Approve Task
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
