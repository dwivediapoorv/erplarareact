import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
    id: number;
    name: string;
    description: string | null;
    creator_name: string;
    project_name: string;
    project_health: 'Red' | 'Green' | 'Orange';
    status: 'Pending' | 'Completed';
    freshdesk_ticket_id: string | null;
    due_date: string | null;
    completed_at: string | null;
    created_at: string;
}

interface ByUserProps {
    user: { id: number; name: string };
    tasks: Task[];
}

const healthDot: Record<string, string> = {
    Green: 'bg-green-500',
    Orange: 'bg-orange-500',
    Red: 'bg-red-500',
};

const statusBadge: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function TasksByUser({ user, tasks: taskList }: ByUserProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: `${user.name}'s Open Tasks`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name}'s Open Tasks`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{user.name}'s Open Tasks</h1>
                        <p className="text-sm text-muted-foreground">
                            {taskList.length} open task{taskList.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {taskList.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-16">No open tasks</p>
                ) : (
                    <div className="space-y-3">
                        {taskList.map((task) => (
                            <div
                                key={task.id}
                                className="group rounded-xl border border-sidebar-border/70 bg-card p-4 hover:border-sidebar-border hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <Link href={tasks.show(task.id).url} className="flex-1 min-w-0">
                                        <div className="text-xs text-muted-foreground mb-1">ID: {task.id}</div>
                                        <h4 className="font-medium text-base group-hover:text-primary transition-colors">
                                            {task.name}
                                        </h4>
                                    </Link>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusBadge[task.status]}`}>
                                        {task.status}
                                    </span>
                                </div>

                                {task.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-sidebar-border/30 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${healthDot[task.project_health] ?? 'bg-gray-400'}`} />
                                        <span className="font-medium">{task.project_name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span><span className="font-medium">By:</span> {task.creator_name}</span>
                                        <span><span className="font-medium">Due:</span> {task.due_date ?? 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
