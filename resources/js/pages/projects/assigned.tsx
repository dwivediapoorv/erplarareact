import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
    {
        title: 'Projects Assigned',
        href: '#',
    },
];

interface Employee {
    id: number;
    name: string;
    user_name: string;
    assigned_projects_count: number;
}

interface ProjectsAssignedProps {
    employees: Employee[];
}

export default function ProjectsAssigned({ employees }: ProjectsAssignedProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Assigned" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={projects.index().url}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Projects
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">Projects Assigned</h1>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b border-sidebar-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Employee Name</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold">Number of Projects</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/30">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        No employees with assigned projects found
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={projects.byAssignedTo(employee.id).url}
                                                className="text-sm hover:underline"
                                            >
                                                {employee.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-medium">
                                            {employee.assigned_projects_count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
