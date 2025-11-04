import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus } from 'lucide-react';
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
    monthly_report_date: string | null;
    assigned_to_name: string;
    assigned_to_id: number | null;
    project_manager_name: string;
    project_manager_id: number | null;
    open_tasks_count: number;
}

interface ProjectsIndexProps {
    projects: Project[];
    columnPreferences?: Record<string, boolean> | null;
    filterType?: string;
    filterName?: string;
}

export default function ProjectsIndex({ projects: projectsList, columnPreferences, filterType, filterName }: ProjectsIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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

    const columns: Column<Project>[] = [
        {
            key: 'project_name',
            label: 'Project Name',
            render: (project) => (
                <Link
                    href={projects.show(project.id).url}
                    className="font-medium hover:underline"
                >
                    {project.project_name}
                </Link>
            ),
        },
        {
            key: 'client_name',
            label: 'Client Name',
        },
        {
            key: 'assigned_to_name',
            label: 'Assigned To',
            render: (project) => (
                project.assigned_to_id && project.assigned_to_name !== 'N/A' ? (
                    <Link
                        href={projects.byAssignedTo(project.assigned_to_id).url}
                        className="hover:underline"
                    >
                        {project.assigned_to_name}
                    </Link>
                ) : (
                    <span>{project.assigned_to_name}</span>
                )
            ),
        },
        {
            key: 'project_manager_name',
            label: 'Project Manager',
            render: (project) => (
                project.project_manager_id && project.project_manager_name !== 'N/A' ? (
                    <Link
                        href={projects.byProjectManager(project.project_manager_id).url}
                        className="hover:underline"
                    >
                        {project.project_manager_name}
                    </Link>
                ) : (
                    <span>{project.project_manager_name}</span>
                )
            ),
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
            key: 'monthly_report_date',
            label: 'Monthly Report Date',
            defaultVisible: true,
            render: (project) => formatMonthlyReportDate(project.monthly_report_date),
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
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {filterType && filterName ? (
                                <>
                                    Projects {filterType === 'assigned_to' ? 'Assigned to' : 'Managed by'} {filterName}
                                </>
                            ) : (
                                'Projects'
                            )}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {filterType && filterName && (
                            <Button variant="outline" asChild>
                                <Link href={projects.index().url}>
                                    All Projects
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={projects.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Project
                            </Link>
                        </Button>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={projectsList}
                    searchPlaceholder="Search projects by name, client, or status..."
                    emptyMessage="No projects found"
                    pageName="projects.index"
                    savedPreferences={columnPreferences}
                />
            </div>
        </AppLayout>
    );
}
