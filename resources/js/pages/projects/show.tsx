import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

export default function ProjectShow({ project }: ProjectShowProps) {
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
                    <Button asChild>
                        <Link href={projects.edit(project.id).url}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Project
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="space-y-6">
                        {/* Project Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Project Information</h2>
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
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Onboarding Notes
                                    </label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">
                                        {project.onboarding_notes || 'N/A'}
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
                            <h2 className="text-lg font-semibold mb-4">Client Information</h2>
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
                            <h2 className="text-lg font-semibold mb-4">Project Assignment</h2>
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
                            <h2 className="text-lg font-semibold mb-4">Services & Blog Information</h2>
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
                            <h2 className="text-lg font-semibold mb-4">Project Status</h2>
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

                        {/* System Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">System Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Created At
                                    </label>
                                    <p className="mt-1 text-sm">{project.created_at}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </label>
                                    <p className="mt-1 text-sm">{project.updated_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
