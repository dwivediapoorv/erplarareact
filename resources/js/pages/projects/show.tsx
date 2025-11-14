import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import tasks from '@/routes/tasks';
import minutesOfMeetings from '@/routes/minutes-of-meetings';
import clientInteractions from '@/routes/client-interactions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, CheckSquare, Calendar, Phone, Info, Plus, FileText } from 'lucide-react';
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

    // Format monthly report date to show only the day with ordinal suffix
    const formatMonthlyReportDate = (date: string | null) => {
        if (!date) return 'N/A';

        const dateObj = new Date(date);
        const day = dateObj.getDate();

        // Add ordinal suffix (st, nd, rd, th)
        const getOrdinalSuffix = (day: number) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${getOrdinalSuffix(day)} of every month`;
    };

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

                {/* Main Layout: Pendencies on Left, Sidebar on Right */}
                <div className="grid gap-4 lg:grid-cols-12">
                    {/* Left Side - Pendencies */}
                    <div className="lg:col-span-9 space-y-4">
                        {/* Open Tasks */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold">Open Tasks</h3>
                                    <Badge variant="secondary">{projectTasks.filter(t => t.status === 'Pending').length}</Badge>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`${tasks.create().url}?project_id=${project.id}`}>
                                        <Plus className="h-4 w-4 mr-1.5" />
                                        Add Task
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {projectTasks.filter(t => t.status === 'Pending').length > 0 ? (
                                    projectTasks.filter(t => t.status === 'Pending').map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-sidebar-border/50 hover:border-sidebar-border hover:bg-sidebar-accent/50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <Link href={tasks.show(task.id).url} className="hover:underline">
                                                    <p className="text-sm font-medium">{task.name}</p>
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-xs text-muted-foreground">
                                                        Assigned to: {task.assignee_name}
                                                    </span>
                                                    {task.due_date && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Due: {task.due_date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="ml-3">
                                                {task.status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">No open tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Open Content Workflows */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold">Open Content Workflows</h3>
                                    <Badge variant="secondary">0</Badge>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/content-flows/create?project_id=${project.id}`}>
                                        <Plus className="h-4 w-4 mr-1.5" />
                                        Add Content Flow
                                    </Link>
                                </Button>
                            </div>
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No open content workflows</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Project Details */}
                    <div className="lg:col-span-3">
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-3 dark:border-sidebar-border space-y-3">
                            {/* Project Overview */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">Project Overview</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">
                                            Client Name
                                        </label>
                                        <p className="mt-0.5 text-sm font-medium">{project.client_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">
                                            Website
                                        </label>
                                        <p className="mt-0.5 text-sm">
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
                                </div>
                            </div>

                            <div className="border-t border-sidebar-border/50" />

                            {/* Team */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">Team</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">
                                            SEO Team
                                        </label>
                                        <p className="mt-0.5 text-sm font-medium">{project.assigned_to_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">
                                            Project Manager
                                        </label>
                                        <p className="mt-0.5 text-sm font-medium">{project.project_manager_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-sidebar-border/50" />

                            {/* Services */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">Services</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.services.length > 0 ? (
                                        project.services.map((service) => (
                                            <Badge key={service.id} variant="secondary">
                                                {service.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No services</p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-sidebar-border/50" />

                            {/* Quick Stats */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">Quick Stats</h3>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/30">
                                        <div className="flex items-center gap-2">
                                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Pending Tasks</span>
                                        </div>
                                        <span className="text-sm font-semibold">{projectTasks.filter(t => t.status === 'Pending').length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/30">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Pending Workflows</span>
                                        </div>
                                        <span className="text-sm font-semibold">0</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/30">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Blogs</span>
                                        </div>
                                        <span className="text-sm font-semibold">{project.blogs_count ?? 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-sidebar-border/50" />

                            {/* Monthly Report Date */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">Monthly Report Date</h3>
                                <p className="text-sm">{formatMonthlyReportDate(project.monthly_report_date)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Activities - MOMs and Interactions */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Minutes of Meetings Card */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Minutes of Meetings</h3>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={`${minutesOfMeetings.create().url}?project_id=${project.id}`}>
                                    <Plus className="h-3 w-3" />
                                </Link>
                            </Button>
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
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Call Interactions</h3>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={`${clientInteractions.create().url}?project_id=${project.id}`}>
                                    <Plus className="h-3 w-3" />
                                </Link>
                            </Button>
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
