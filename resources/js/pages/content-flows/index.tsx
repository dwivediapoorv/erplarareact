import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Flows',
        href: '/content-flows',
    },
];

interface ContentFlow {
    id: number;
    title: string;
    project_name: string;
    primary_keyword: string;
    approval_status: 'Awaiting Approval' | 'Client Approved' | 'Internally Approved';
    published_on: string | null;
    ai_score: number | null;
    creator_name: string;
    created_at: string;
}

interface ContentFlowsIndexProps {
    contentFlows: ContentFlow[];
}

export default function ContentFlowsIndex({ contentFlows }: ContentFlowsIndexProps) {
    const getStatusBadgeClasses = (status: string) => {
        if (status === 'Awaiting Approval') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        } else if (status === 'Client Approved') {
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        } else {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this content flow?')) {
            router.delete(`/content-flows/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Content Flows" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Content Flows</h1>
                    <Button asChild>
                        <Link href="/content-flows/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Content Flow
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Primary Keyword</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>AI Score</TableHead>
                                <TableHead>Published On</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contentFlows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        No content flows found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contentFlows.map((flow) => (
                                    <TableRow key={flow.id}>
                                        <TableCell className="font-medium">{flow.title}</TableCell>
                                        <TableCell>{flow.project_name}</TableCell>
                                        <TableCell>{flow.primary_keyword}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClasses(flow.approval_status)}`}
                                            >
                                                {flow.approval_status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{flow.ai_score || 'N/A'}</TableCell>
                                        <TableCell>{flow.published_on || 'Not Published'}</TableCell>
                                        <TableCell>{flow.creator_name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/content-flows/${flow.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/content-flows/${flow.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(flow.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
