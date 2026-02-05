import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
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

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    project_name: string;
}

interface Task {
    id: number;
    name: string;
    description: string | null;
    assigned_to: number;
    project_id: number;
    due_date: string | null;
    status: string;
}

interface EditTaskProps {
    task: Task;
    users: User[];
    projects: Project[];
}

export default function EditTask({ task, users, projects }: EditTaskProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: tasks.index().url,
        },
        {
            title: task.name,
            href: tasks.show(task.id).url,
        },
        {
            title: 'Edit',
            href: tasks.edit(task.id).url,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: task.name,
        description: task.description || '',
        assigned_to: task.assigned_to.toString(),
        project_id: task.project_id.toString(),
        due_date: task.due_date || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(tasks.update(task.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task - ${task.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Task</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name">
                                    Task Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

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

                            {/* Assign To */}
                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">
                                    Assign To <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.assigned_to}
                                    onValueChange={(value) =>
                                        setData('assigned_to', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.assigned_to} />
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="due_date">
                                    Due Date
                                </Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) =>
                                        setData('due_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.due_date} />
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
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
