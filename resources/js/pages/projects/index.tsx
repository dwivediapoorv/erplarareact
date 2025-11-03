import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from '@/components/data-table';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
];

interface Project {
    id: number;
    project_name: string;
    client_name: string;
    project_health: 'Red' | 'Green' | 'Orange';
    project_status: 'Active' | 'On Hold' | 'Suspended';
    date_of_onboarding: string | null;
    project_start_date: string | null;
    assigned_to_name: string;
    project_manager_name: string;
    open_tasks_count: number;
}

interface ProjectsIndexProps {
    projects: Project[];
}

export default function ProjectsIndex({ projects: projectsList }: ProjectsIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const columns: Column<Project>[] = [
        {
            key: 'project_name',
            label: 'Project Name',
            render: (project) => (
                <span className="font-medium">{project.project_name}</span>
            ),
        },
        {
            key: 'client_name',
            label: 'Client Name',
        },
        {
            key: 'assigned_to_name',
            label: 'Assigned To',
        },
        {
            key: 'project_manager_name',
            label: 'Project Manager',
        },
        {
            key: 'open_tasks_count',
            label: 'Open Tasks',
            filterable: false,
            render: (project) => (
                <span className="font-medium">{project.open_tasks_count}</span>
            ),
        },
        {
            key: 'project_health',
            label: 'Health',
            filterable: false,
            render: (project) => {
                // Determine background color based on project status
                let bgColor = '';
                let textColor = '';

                if (project.project_status === 'Active') {
                    // Active projects - use health colors
                    if (project.project_health === 'Green') {
                        bgColor = 'bg-green-100 dark:bg-green-900/30';
                        textColor = 'text-green-800 dark:text-green-400';
                    } else if (project.project_health === 'Orange') {
                        bgColor = 'bg-orange-100 dark:bg-orange-900/30';
                        textColor = 'text-orange-800 dark:text-orange-400';
                    } else {
                        bgColor = 'bg-red-100 dark:bg-red-900/30';
                        textColor = 'text-red-800 dark:text-red-400';
                    }
                } else if (project.project_status === 'On Hold') {
                    // On Hold projects - yellow/amber
                    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
                    textColor = 'text-yellow-800 dark:text-yellow-400';
                } else if (project.project_status === 'Suspended') {
                    // Suspended projects - gray
                    bgColor = 'bg-gray-100 dark:bg-gray-900/30';
                    textColor = 'text-gray-800 dark:text-gray-400';
                }

                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
                        {project.project_health}
                    </span>
                );
            },
        },
        {
            key: 'project_status',
            label: 'Status',
            filterable: false,
            render: (project) => (
                <Badge
                    variant={
                        project.project_status === 'Active'
                            ? 'default'
                            : 'outline'
                    }
                >
                    {project.project_status}
                </Badge>
            ),
        },
        {
            key: 'date_of_onboarding',
            label: 'Onboarding Date',
            defaultVisible: false,
            render: (project) => project.date_of_onboarding || 'N/A',
        },
        {
            key: 'project_start_date',
            label: 'Start Date',
            defaultVisible: false,
            render: (project) => project.project_start_date || 'N/A',
        },
        {
            key: 'actions',
            label: 'Actions',
            filterable: false,
            render: (project) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={projects.show(project.id).url}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={projects.edit(project.id).url}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Projects</h1>
                    <Button asChild>
                        <Link href={projects.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={projectsList}
                    searchPlaceholder="Search projects by name, client, or status..."
                    emptyMessage="No projects found"
                />
            </div>
        </AppLayout>
    );
}
