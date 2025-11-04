import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { CheckCircle, Plus, CheckCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/data-table';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasks.index().url,
    },
];

interface Task {
    id: number;
    name: string;
    description: string | null;
    creator_name: string;
    assignee_name: string;
    project_name: string;
    status: 'Pending' | 'Completed' | 'Approved';
    due_date: string | null;
    completed_at: string | null;
    approver_name: string | null;
    created_at: string;
}

interface TasksIndexProps {
    tasks: Task[];
}

export default function TasksIndex({ tasks: tasksList }: TasksIndexProps) {
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

    const columns: Column<Task>[] = [
        {
            key: 'id',
            label: 'Task ID',
            filterable: false,
        },
        {
            key: 'name',
            label: 'Task Name',
            filterable: true,
            render: (task) => (
                <Link
                    href={tasks.show(task.id).url}
                    className="font-medium hover:underline"
                >
                    {task.name}
                </Link>
            ),
        },
        {
            key: 'project_name',
            label: 'Project',
            filterable: true,
        },
        {
            key: 'creator_name',
            label: 'Created By',
            filterable: true,
        },
        {
            key: 'assignee_name',
            label: 'Assigned To',
            filterable: true,
        },
        {
            key: 'status',
            label: 'Status',
            filterable: true,
            render: (task) => {
                let bgColor = '';
                let textColor = '';

                if (task.status === 'Pending') {
                    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
                    textColor = 'text-yellow-800 dark:text-yellow-400';
                } else if (task.status === 'Completed') {
                    bgColor = 'bg-blue-100 dark:bg-blue-900/30';
                    textColor = 'text-blue-800 dark:text-blue-400';
                } else {
                    bgColor = 'bg-green-100 dark:bg-green-900/30';
                    textColor = 'text-green-800 dark:text-green-400';
                }

                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
                        {task.status}
                    </span>
                );
            },
        },
        {
            key: 'due_date',
            label: 'Due Date',
            filterable: false,
            render: (task) => task.due_date || 'N/A',
        },
        {
            key: 'created_at',
            label: 'Created Date',
            filterable: false,
        },
        {
            key: 'completed_at',
            label: 'Completed Date',
            filterable: false,
            render: (task) => task.completed_at || 'N/A',
        },
        {
            key: 'actions',
            label: 'Actions',
            filterable: false,
            render: (task) => (
                <div className="flex items-center gap-2">
                    {task.status === 'Pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(task.id)}
                        >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Complete
                        </Button>
                    )}
                    {task.status === 'Completed' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(task.id)}
                        >
                            <BadgeCheck className="h-4 w-4 mr-1" />
                            Approve
                        </Button>
                    )}
                    {task.status === 'Approved' && (
                        <span className="text-sm text-muted-foreground">Closed</span>
                    )}
                </div>
            ),
        },
    ];

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

                <DataTable
                    data={tasksList}
                    columns={columns}
                    searchPlaceholder="Search tasks..."
                />
            </div>
        </AppLayout>
    );
}
