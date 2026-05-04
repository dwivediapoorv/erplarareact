import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, CheckSquare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface UserWithTasks {
    id: number;
    name: string;
    open_tasks_count: number;
}

interface ProjectWithTasks {
    id: number;
    name: string;
    open_tasks_count: number;
    health: string;
}

interface MyTask {
    id: number;
    title: string;
    status: string;
    due_date: string | null;
    project_name: string;
    project_health: string;
}

interface DashboardProps extends PageProps {
    dashboardType?: string;
    // Admin Dashboard
    totalProjects?: number;
    openTasksCount?: number;
    greenProjectsCount?: number;
    orangeProjectsCount?: number;
    redProjectsCount?: number;
    usersWithOpenTasks?: UserWithTasks[];
    projectsWithOpenTasks?: ProjectWithTasks[];
    // Employee Dashboard
    myOpenTasks?: number;
    myProjects?: number;
    myTasks?: MyTask[];
}

export default function Dashboard(props: DashboardProps) {
    const { dashboardType = 'admin' } = props;

    if (dashboardType === 'employee') {
        return <EmployeeDashboard {...props} />;
    }

    return <AdminDashboard {...props} />;
}

function AdminDashboard({
    totalProjects = 0,
    openTasksCount = 0,
    greenProjectsCount = 0,
    orangeProjectsCount = 0,
    redProjectsCount = 0,
    usersWithOpenTasks = [],
    projectsWithOpenTasks = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProjects}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{openTasksCount}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Green Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{greenProjectsCount}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orange Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{orangeProjectsCount}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Red Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{redProjectsCount}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Open Tasks by User</CardTitle>
                            {usersWithOpenTasks.length > 0 && (
                                <p className="text-sm text-muted-foreground">{usersWithOpenTasks.length} user{usersWithOpenTasks.length !== 1 ? 's' : ''}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            {usersWithOpenTasks.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">No users with open tasks</p>
                            ) : (
                                <div className="space-y-2">
                                    {usersWithOpenTasks.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                            <Link
                                                href={`/tasks/by-user/${user.id}`}
                                                className="text-sm font-medium hover:text-primary hover:underline"
                                            >
                                                {user.name}
                                            </Link>
                                            <span className="text-sm text-muted-foreground">{user.open_tasks_count} tasks</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Open Tasks by Project</CardTitle>
                            {projectsWithOpenTasks.length > 0 && (
                                <p className="text-sm text-muted-foreground">{projectsWithOpenTasks.length} project{projectsWithOpenTasks.length !== 1 ? 's' : ''}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            {projectsWithOpenTasks.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">No projects with open tasks</p>
                            ) : (
                                <div className="space-y-2">
                                    {projectsWithOpenTasks.map((project) => (
                                        <div key={project.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    project.health === 'Green' ? 'bg-green-500' :
                                                    project.health === 'Orange' ? 'bg-orange-500' : 'bg-red-500'
                                                }`} />
                                                <Link
                                                    href={`/tasks/by-project/${project.id}`}
                                                    className="text-sm font-medium hover:text-primary hover:underline"
                                                >
                                                    {project.name}
                                                </Link>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{project.open_tasks_count} tasks</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function EmployeeDashboard({
    myOpenTasks = 0,
    myProjects = 0,
    myTasks = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold">My Dashboard</h2>
                    <p className="text-muted-foreground">Your personal tasks and projects</p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Open Tasks</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{myOpenTasks}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{myProjects}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>My Tasks</CardTitle>
                        <CardDescription>Your pending and completed tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myTasks.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No open tasks</p>
                        ) : (
                            <div className="space-y-2">
                                {myTasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded border hover:bg-muted/50 transition-colors">
                                        <div className="flex-1">
                                            <Link href={tasks.show(task.id).url} className="font-medium hover:text-primary hover:underline">
                                                {task.title}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">{task.project_name}</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                task.project_health === 'Green' ? 'bg-green-100 text-green-800' :
                                                task.project_health === 'Orange' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {task.project_health}
                                            </span>
                                            {task.due_date && (
                                                <p className="text-muted-foreground mt-1">Due: {task.due_date}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
