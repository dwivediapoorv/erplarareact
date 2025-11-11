import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ContentFlow {
    id: number;
    title: string;
    project_id: number;
    project_name: string;
    primary_keyword: string;
    secondary_keywords: string[];
    faqs: string[];
    approval_status: 'Awaiting Approval' | 'Client Approved' | 'Internally Approved';
    published_on: string | null;
    ai_score: number | null;
    creator_name: string;
    created_at: string;
    updated_at: string;
}

interface ShowContentFlowProps {
    contentFlow: ContentFlow;
}

export default function ShowContentFlow({ contentFlow }: ShowContentFlowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Content Flows',
            href: '/content-flows',
        },
        {
            title: contentFlow.title,
            href: `/content-flows/${contentFlow.id}`,
        },
    ];

    const getStatusBadgeClasses = (status: string) => {
        if (status === 'Awaiting Approval') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        } else if (status === 'Client Approved') {
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        } else {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={contentFlow.title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{contentFlow.title}</h1>
                    <Button asChild>
                        <Link href={`/content-flows/${contentFlow.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Project Information */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Project
                            </label>
                            <p className="mt-1 text-base">{contentFlow.project_name}</p>
                        </div>

                        {/* Approval Status */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Approval Status
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClasses(contentFlow.approval_status)}`}
                                >
                                    {contentFlow.approval_status}
                                </span>
                            </div>
                        </div>

                        {/* Primary Keyword */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Primary Keyword
                            </label>
                            <p className="mt-1 text-base">{contentFlow.primary_keyword}</p>
                        </div>

                        {/* AI Score */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                AI Score
                            </label>
                            <p className="mt-1 text-base">{contentFlow.ai_score || 'N/A'}</p>
                        </div>

                        {/* Published On */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Published On
                            </label>
                            <p className="mt-1 text-base">{contentFlow.published_on || 'Not Published'}</p>
                        </div>

                        {/* Created By */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created By
                            </label>
                            <p className="mt-1 text-base">{contentFlow.creator_name}</p>
                        </div>

                        {/* Secondary Keywords */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Secondary Keywords
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {contentFlow.secondary_keywords && contentFlow.secondary_keywords.length > 0 ? (
                                    contentFlow.secondary_keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full"
                                        >
                                            {keyword}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-base text-muted-foreground">N/A</p>
                                )}
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                FAQs
                            </label>
                            <div className="mt-2 space-y-2">
                                {contentFlow.faqs && contentFlow.faqs.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {contentFlow.faqs.map((faq, index) => (
                                            <li key={index} className="text-base">
                                                {faq}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-base text-muted-foreground">N/A</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-6 pt-6 border-t border-sidebar-border/50">
                        <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                            <div>
                                <span className="font-medium">Created:</span> {contentFlow.created_at}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span> {contentFlow.updated_at}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
