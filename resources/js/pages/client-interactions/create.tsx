import AppLayout from '@/layouts/app-layout';
import clientInteractions from '@/routes/client-interactions';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Client Interactions',
        href: clientInteractions.index().url,
    },
    {
        title: 'Create Interaction',
        href: clientInteractions.create().url,
    },
];

interface Project {
    id: number;
    project_name: string;
}

interface CreateClientInteractionProps {
    projects: Project[];
}

export default function CreateClientInteraction({ projects }: CreateClientInteractionProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get('project_id') || '';

    const { data, setData, post, processing, errors } = useForm({
        project_id: projectIdFromUrl,
        client_name: '',
        interaction_type: '',
        interaction_date: '',
        notes: '',
        outcome: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(clientInteractions.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client Interaction" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Client Interaction</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Project */}
                            <div className="space-y-2 md:col-span-2">
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
                                        <SelectValue placeholder="Select a project" />
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

                            {/* Client Name */}
                            <div className="space-y-2">
                                <Label htmlFor="client_name">
                                    Client Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="client_name"
                                    type="text"
                                    value={data.client_name}
                                    onChange={(e) =>
                                        setData('client_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.client_name} />
                            </div>

                            {/* Interaction Type */}
                            <div className="space-y-2">
                                <Label htmlFor="interaction_type">
                                    Interaction Type <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="interaction_type"
                                    type="text"
                                    placeholder="e.g., Call, Meeting, Email"
                                    value={data.interaction_type}
                                    onChange={(e) =>
                                        setData('interaction_type', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.interaction_type} />
                            </div>

                            {/* Interaction Date */}
                            <div className="space-y-2">
                                <Label htmlFor="interaction_date">
                                    Interaction Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="interaction_date"
                                    type="date"
                                    value={data.interaction_date}
                                    onChange={(e) =>
                                        setData('interaction_date', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.interaction_date} />
                            </div>

                            {/* Outcome */}
                            <div className="space-y-2">
                                <Label htmlFor="outcome">
                                    Outcome
                                </Label>
                                <Input
                                    id="outcome"
                                    type="text"
                                    placeholder="e.g., Successful, Follow-up Required"
                                    value={data.outcome}
                                    onChange={(e) =>
                                        setData('outcome', e.target.value)
                                    }
                                />
                                <InputError message={errors.outcome} />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="notes">
                                    Notes
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                />
                                <InputError message={errors.notes} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Interaction'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
