import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Flows',
        href: '/content-flows',
    },
];

interface ContentFlow {
    id: number;
    title: string;
    project_id: number;
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
    columnPreferences?: Record<string, boolean> | null;
    filteredProject?: string;
}

export default function ContentFlowsIndex({ contentFlows, columnPreferences, filteredProject }: ContentFlowsIndexProps) {
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

    const columns: Column<ContentFlow>[] = [
        {
            key: 'id',
            label: 'ID',
            defaultVisible: true,
        },
        {
            key: 'title',
            label: 'Title',
            render: (flow) => (
                <Link
                    href={`/content-flows/${flow.id}`}
                    className="font-medium hover:underline"
                >
                    {flow.title}
                </Link>
            ),
        },
        {
            key: 'project_name',
            label: 'Project',
            defaultVisible: true,
            render: (flow) => (
                <Link
                    href={`/content-flows/by-project/${flow.project_id}`}
                    className="hover:underline"
                >
                    {flow.project_name}
                </Link>
            ),
        },
        {
            key: 'primary_keyword',
            label: 'Primary Keyword',
            defaultVisible: true,
        },
        {
            key: 'approval_status',
            label: 'Status',
            filterable: false,
            defaultVisible: true,
            render: (flow) => (
                <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClasses(flow.approval_status)}`}
                >
                    {flow.approval_status}
                </span>
            ),
        },
        {
            key: 'ai_score',
            label: 'AI Score',
            defaultVisible: false,
            render: (flow) => flow.ai_score || 'N/A',
        },
        {
            key: 'published_on',
            label: 'Published On',
            defaultVisible: false,
            render: (flow) => flow.published_on || 'Not Published',
        },
        {
            key: 'creator_name',
            label: 'Created By',
            defaultVisible: false,
        },
        {
            key: 'actions',
            label: 'Actions',
            filterable: false,
            render: (flow) => (
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
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Content Flows" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {filteredProject && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/content-flows">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back
                                </Link>
                            </Button>
                        )}
                        <h1 className="text-2xl font-semibold">
                            {filteredProject ? `Content Flows for ${filteredProject}` : 'Content Flows'}
                        </h1>
                    </div>
                    <Button asChild>
                        <Link href="/content-flows/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Content Flow
                        </Link>
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={contentFlows}
                    searchPlaceholder="Search content flows by title, project, or keyword..."
                    emptyMessage="No content flows found. Create one to get started."
                    pageName="content-flows.index"
                    savedPreferences={columnPreferences}
                />
            </div>
        </AppLayout>
    );
}
