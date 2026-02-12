import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, CheckCircle, ThumbsUp, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

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

interface Comment {
    id: number;
    comment: string;
    user_id: number;
    user_name: string;
    created_at: string;
}

interface Task {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    assigned_to: number;
    creator_name: string;
    assignee_name: string;
    project_name: string;
    project_id: number;
    status: 'Pending' | 'Completed' | 'Approved';
    freshdesk_ticket_id: string | null;
    due_date: string | null;
    completed_at: string | null;
    approver_name: string | null;
    created_at: string;
    comments: Comment[];
}

interface TaskShowProps {
    task: Task;
}

export default function TaskShow({ task }: TaskShowProps) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const isCreator = auth.user.id === task.created_by;
    const isAssignee = auth.user.id === task.assigned_to;

    const { data, setData, post, processing, reset, errors } = useForm({
        comment: '',
    });

    const handleMarkComplete = () => {
        router.patch(
            `/tasks/${task.id}/complete`,
            {},
            { preserveScroll: true }
        );
    };

    const handleApprove = () => {
        router.patch(
            `/tasks/${task.id}/approve`,
            {},
            { preserveScroll: true }
        );
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tasks/${task.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('comment'),
        });
    };

    const handleDeleteComment = (commentId: number) => {
        router.delete(`/tasks/${task.id}/comments/${commentId}`, {
            preserveScroll: true,
        });
    };

    const getStatusVariant = (status: string) => {
        if (status === 'Pending') return 'outline';
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
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(task.status)} className={getStatusColor(task.status)}>
                            {task.status}
                        </Badge>
                        {isAssignee && task.status === 'Pending' && (
                            <Button variant="default" size="sm" onClick={handleMarkComplete}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Complete
                            </Button>
                        )}
                        {isCreator && task.status === 'Completed' && (
                            <Button variant="default" size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve
                            </Button>
                        )}
                        {isCreator && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={tasks.edit(task.id).url}>
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    {/* Left column: description + comments */}
                    <div className="md:col-span-3 flex flex-col gap-6">
                        {/* Task Information */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
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

                        {/* Comments */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="text-lg font-semibold mb-4">
                                Comments
                                {task.comments.length > 0 && (
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({task.comments.length})
                                    </span>
                                )}
                            </h2>

                            {/* Comment list */}
                            <div className="space-y-4 mb-6">
                                {task.comments.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No comments yet. Be the first to add one.</p>
                                )}
                                {task.comments.map((c) => (
                                    <div key={c.id} className="flex gap-3">
                                        <div className="flex-1 rounded-lg border border-sidebar-border/50 bg-muted/30 p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">{c.user_name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">{c.created_at}</span>
                                                    {c.user_id === auth.user.id && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c.id)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                            title="Delete comment"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{c.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add comment form */}
                            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        placeholder="Add a comment or follow-up note..."
                                        rows={2}
                                        className="resize-none"
                                    />
                                    {errors.comment && (
                                        <p className="text-xs text-destructive mt-1">{errors.comment}</p>
                                    )}
                                </div>
                                <Button type="submit" disabled={processing || !data.comment.trim()} size="sm">
                                    <Send className="h-4 w-4 mr-1" />
                                    Post
                                </Button>
                            </form>
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
                            {task.freshdesk_ticket_id && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Freshdesk Ticket #
                                    </label>
                                    <p className="mt-1 text-sm">
                                        <a
                                            href={`https://support.digirocket.io/a/tickets/${task.freshdesk_ticket_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono hover:underline text-primary"
                                        >
                                            #{task.freshdesk_ticket_id}
                                        </a>
                                    </p>
                                </div>
                            )}
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
