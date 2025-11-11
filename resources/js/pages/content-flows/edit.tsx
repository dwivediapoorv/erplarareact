import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Project {
    id: number;
    project_name: string;
}

interface ContentFlow {
    id: number;
    title: string;
    project_id: number;
    primary_keyword: string;
    secondary_keywords: string | null;
    faqs: string | null;
    approval_status: string;
    published_on: string | null;
    ai_score: number | null;
}

interface EditContentFlowProps {
    contentFlow: ContentFlow;
    projects: Project[];
}

export default function EditContentFlow({ contentFlow, projects }: EditContentFlowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Content Flows',
            href: '/content-flows',
        },
        {
            title: contentFlow.title,
            href: `/content-flows/${contentFlow.id}`,
        },
        {
            title: 'Edit',
            href: `/content-flows/${contentFlow.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        project_id: contentFlow.project_id.toString(),
        title: contentFlow.title,
        primary_keyword: contentFlow.primary_keyword,
        secondary_keywords: contentFlow.secondary_keywords || '',
        faqs: contentFlow.faqs || '',
        approval_status: contentFlow.approval_status,
        published_on: contentFlow.published_on || '',
        ai_score: contentFlow.ai_score?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/content-flows/${contentFlow.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${contentFlow.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Content Flow</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Project */}
                            <div className="space-y-2">
                                <Label htmlFor="project_id">
                                    Project <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.project_id}
                                    onValueChange={(value) =>
                                        setData('project_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem
                                                key={project.id}
                                                value={project.id.toString()}
                                            >
                                                {project.project_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.project_id} />
                            </div>

                            {/* Approval Status */}
                            <div className="space-y-2">
                                <Label htmlFor="approval_status">
                                    Approval Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.approval_status}
                                    onValueChange={(value) =>
                                        setData('approval_status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Awaiting Approval">Awaiting Approval</SelectItem>
                                        <SelectItem value="Client Approved">Client Approved</SelectItem>
                                        <SelectItem value="Internally Approved">Internally Approved</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.approval_status} />
                            </div>

                            {/* Title/Topic */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">
                                    Title/Topic <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Primary Keyword */}
                            <div className="space-y-2">
                                <Label htmlFor="primary_keyword">
                                    Primary Keyword <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="primary_keyword"
                                    type="text"
                                    value={data.primary_keyword}
                                    onChange={(e) =>
                                        setData('primary_keyword', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.primary_keyword} />
                            </div>

                            {/* AI Score */}
                            <div className="space-y-2">
                                <Label htmlFor="ai_score">
                                    AI Score
                                </Label>
                                <Input
                                    id="ai_score"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.ai_score}
                                    onChange={(e) =>
                                        setData('ai_score', e.target.value)
                                    }
                                    placeholder="0.00"
                                />
                                <InputError message={errors.ai_score} />
                            </div>

                            {/* Secondary Keywords */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="secondary_keywords">
                                    Secondary Keywords
                                </Label>
                                <Textarea
                                    id="secondary_keywords"
                                    value={data.secondary_keywords}
                                    onChange={(e) =>
                                        setData('secondary_keywords', e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Enter keywords separated by commas"
                                />
                                <InputError message={errors.secondary_keywords} />
                            </div>

                            {/* FAQs */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="faqs">
                                    FAQs
                                </Label>
                                <Textarea
                                    id="faqs"
                                    value={data.faqs}
                                    onChange={(e) =>
                                        setData('faqs', e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Enter FAQs separated by commas"
                                />
                                <InputError message={errors.faqs} />
                            </div>

                            {/* Published On */}
                            <div className="space-y-2">
                                <Label htmlFor="published_on">
                                    Published On
                                </Label>
                                <Input
                                    id="published_on"
                                    type="date"
                                    value={data.published_on}
                                    onChange={(e) =>
                                        setData('published_on', e.target.value)
                                    }
                                />
                                <InputError message={errors.published_on} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Content Flow'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
