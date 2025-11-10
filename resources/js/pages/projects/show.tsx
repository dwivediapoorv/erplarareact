import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, CheckSquare, Calendar, Phone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
    {
        title: 'View Project',
        href: '#',
    },
];

interface Service {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
    status: 'Pending' | 'Completed' | 'Approved';
    due_date: string | null;
    assignee_name: string;
    created_at: string;
}

interface MOM {
    id: number;
    title: string;
    meeting_date: string | null;
    created_at: string;
}

interface Interaction {
    id: number;
    interaction_type: string;
    interaction_date: string | null;
    created_at: string;
}

interface Project {
    id: number;
    project_name: string;
    onboarding_notes: string | null;
    date_of_onboarding: string | null;
    project_start_date: string | null;
    client_name: string;
    website: string | null;
    email_address: string;
    alternate_email_address: string | null;
    phone_number: string;
    alternate_phone_number: string | null;
    assigned_to_name: string;
    project_manager_name: string;
    project_health: 'Red' | 'Green' | 'Orange';
    project_status: 'Active' | 'On Hold' | 'Suspended';
    blogs_count: number | null;
    monthly_report_date: string | null;
    services: Service[];
    created_at: string;
    updated_at: string;
}

interface ProjectShowProps {
    project: Project;
    tasks: Task[];
    moms: MOM[];
    interactions: Interaction[];
}

export default function ProjectShow({ project, tasks: projectTasks, moms, interactions }: ProjectShowProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Project - ${project.project_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={projects.index().url}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">{project.project_name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Info className="mr-2 h-4 w-4" />
                                    Full Project Information
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="!max-w-6xl max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Full Project Information</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 mt-4">
                                    {/* Project Information */}
                                    <div>
                                        {/* <h3 className="text-lg font-semibold mb-3">Project Information</h3> */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Project Name
                                                </label>
                                                <p className="mt-1 text-sm">{project.project_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Website
                                                </label>
                                                <p className="mt-1 text-sm">
                                                    {project.website ? (
                                                        <a
                                                            href={project.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            {project.website}
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Date of Onboarding
                                                </label>
                                                <p className="mt-1 text-sm">{project.date_of_onboarding || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Project Start Date
                                                </label>
                                                <p className="mt-1 text-sm">{project.project_start_date || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Client Name
                                                </label>
                                                <p className="mt-1 text-sm">{project.client_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Email Address
                                                </label>
                                                <p className="mt-1 text-sm">
                                                    <a href={`mailto:${project.email_address}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                        {project.email_address}
                                                    </a>
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Alternate Email
                                                </label>
                                                <p className="mt-1 text-sm">
                                                    {project.alternate_email_address ? (
                                                        <a href={`mailto:${project.alternate_email_address}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                            {project.alternate_email_address}
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Phone Number
                                                </label>
                                                <p className="mt-1 text-sm">{project.phone_number}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Alternate Phone
                                                </label>
                                                <p className="mt-1 text-sm">{project.alternate_phone_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Assignment */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Project Assignment</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Assigned To (SEO Team)
                                                </label>
                                                <p className="mt-1 text-sm">{project.assigned_to_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Project Manager
                                                </label>
                                                <p className="mt-1 text-sm">{project.project_manager_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services & Blog Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Services & Blog Information</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Services Offered
                                                </label>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {project.services.length > 0 ? (
                                                        project.services.map((service) => (
                                                            <Badge key={service.id} variant="secondary">
                                                                {service.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm">N/A</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Blogs Count
                                                </label>
                                                <p className="mt-1 text-sm">{project.blogs_count ?? 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Monthly Report Date
                                                </label>
                                                <p className="mt-1 text-sm">{project.monthly_report_date || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Status */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Project Status</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Project Health
                                                </label>
                                                <div className="mt-2">
                                                    <Badge
                                                        variant={
                                                            project.project_health === 'Green'
                                                                ? 'default'
                                                                : project.project_health === 'Orange'
                                                                ? 'secondary'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {project.project_health}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Project Status
                                                </label>
                                                <div className="mt-2">
                                                    <Badge
                                                        variant={
                                                            project.project_status === 'Active'
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {project.project_status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Onboarding Notes */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Onboarding Notes</h3>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {project.onboarding_notes || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button asChild>
                            <Link href={projects.edit(project.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Project
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Essential Project Information */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold mb-4">Essential Information</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Project Name
                            </label>
                            <p className="mt-1 text-sm">{project.project_name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Website
                            </label>
                            <p className="mt-1 text-sm">
                                {project.website ? (
                                    <a
                                        href={project.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {project.website}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Date of Onboarding
                            </label>
                            <p className="mt-1 text-sm">{project.date_of_onboarding || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Monthly Report Date
                            </label>
                            <p className="mt-1 text-sm">{project.monthly_report_date || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Client Name
                            </label>
                            <p className="mt-1 text-sm">{project.client_name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Assigned To (SEO Team)
                            </label>
                            <p className="mt-1 text-sm">{project.assigned_to_name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Project Manager
                            </label>
                            <p className="mt-1 text-sm">{project.project_manager_name}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Services Offered
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {project.services.length > 0 ? (
                                    project.services.map((service) => (
                                        <Badge key={service.id} variant="secondary">
                                            {service.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm">N/A</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Three Cards Row - Tasks, MOMs, and Interactions */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Tasks Card */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Tasks</h3>
                            </div>
                            <span className="text-sm text-muted-foreground">{projectTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {projectTasks.length > 0 ? (
                                projectTasks.map((task) => (
                                    <div key={task.id} className="border-b border-sidebar-border/50 pb-3 last:border-0">
                                        <Link href={tasks.show(task.id).url} className="hover:underline">
                                            <p className="text-sm font-medium">{task.name}</p>
                                        </Link>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-muted-foreground">{task.assignee_name}</span>
                                            <Badge
                                                variant={
                                                    task.status === 'Pending'
                                                        ? 'outline'
                                                        : task.status === 'Completed'
                                                        ? 'secondary'
                                                        : 'default'
                                                }
                                                className="text-xs"
                                            >
                                                {task.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No tasks found</p>
                            )}
                        </div>
                    </div>

                    {/* Minutes of Meetings Card */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Minutes of Meetings</h3>
                            </div>
                            <span className="text-sm text-muted-foreground">{moms.length}</span>
                        </div>
                        <div className="space-y-3">
                            {moms.length > 0 ? (
                                moms.map((mom) => (
                                    <div key={mom.id} className="border-b border-sidebar-border/50 pb-3 last:border-0">
                                        <p className="text-sm font-medium">{mom.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {mom.meeting_date || 'No date'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {mom.created_at}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No meetings found</p>
                            )}
                        </div>
                    </div>

                    {/* Call Interactions Card */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Call Interactions</h3>
                            </div>
                            <span className="text-sm text-muted-foreground">{interactions.length}</span>
                        </div>
                        <div className="space-y-3">
                            {interactions.length > 0 ? (
                                interactions.map((interaction) => (
                                    <div key={interaction.id} className="border-b border-sidebar-border/50 pb-3 last:border-0">
                                        <p className="text-sm font-medium">{interaction.interaction_type}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {interaction.interaction_date || 'No date'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {interaction.created_at}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No interactions found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
