import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import leads from '@/routes/leads';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, Briefcase, CheckSquare, Phone, Calendar, TrendingUp, Upload, UserPlus, Clock, Target } from 'lucide-react';

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

interface RecentUpload {
    id: number;
    name: string;
    company_name: string | null;
    status: string;
    assigned_to: string | null;
    created_at: string;
}

interface CallingTeamMember {
    id: number;
    name: string;
    assigned_leads_count: number;
}

interface UpcomingMeeting {
    id: number;
    title: string;
    lead_name: string;
    company: string | null;
    scheduled_at: string;
}

interface FollowUp {
    id: number;
    name: string;
    company_name: string | null;
    phone: string | null;
    next_follow_up_at: string | null;
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
    activeUsersCount?: number;
    totalProjects?: number;
    openTasksCount?: number;
    greenProjectsCount?: number;
    orangeProjectsCount?: number;
    redProjectsCount?: number;
    usersWithOpenTasks?: UserWithTasks[];
    totalLeads?: number;
    newLeads?: number;
    hotLeads?: number;
    convertedLeads?: number;
    // Scrubbing Team Dashboard
    totalUploaded?: number;
    unassignedLeads?: number;
    assignedLeads?: number;
    recentUploads?: RecentUpload[];
    // WFM Dashboard
    todayCalls?: number;
    todayMeetings?: number;
    callingTeamMembers?: CallingTeamMember[];
    // Calling Team Dashboard
    meetingsScheduled?: number;
    todayConnected?: number;
    upcomingMeetings?: UpcomingMeeting[];
    followUpsNeeded?: FollowUp[];
    // Employee Dashboard
    myOpenTasks?: number;
    myProjects?: number;
    myTasks?: MyTask[];
}

export default function Dashboard(props: DashboardProps) {
    const { dashboardType = 'admin' } = props;

    if (dashboardType === 'scrubbing') {
        return <ScrubbingDashboard {...props} />;
    }

    if (dashboardType === 'wfm') {
        return <WFMDashboard {...props} />;
    }

    if (dashboardType === 'calling') {
        return <CallingDashboard {...props} />;
    }

    if (dashboardType === 'employee') {
        return <EmployeeDashboard {...props} />;
    }

    return <AdminDashboard {...props} />;
}

function AdminDashboard({
    activeUsersCount = 0,
    totalProjects = 0,
    openTasksCount = 0,
    greenProjectsCount = 0,
    orangeProjectsCount = 0,
    redProjectsCount = 0,
    usersWithOpenTasks = [],
    totalLeads = 0,
    newLeads = 0,
    hotLeads = 0,
    convertedLeads = 0,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUsersCount}</div>
                        </CardContent>
                    </Card>

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
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{newLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                            <Target className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{hotLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Converted</CardTitle>
                            <CheckSquare className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{convertedLeads}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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

                <Card>
                    <CardHeader>
                        <CardTitle>Open Tasks by User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {usersWithOpenTasks.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No users with open tasks</p>
                        ) : (
                            <div className="space-y-2">
                                {usersWithOpenTasks.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-sm text-muted-foreground">{user.open_tasks_count} tasks</span>
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

function ScrubbingDashboard({
    totalUploaded = 0,
    unassignedLeads = 0,
    assignedLeads = 0,
    convertedLeads = 0,
    recentUploads = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Scrubbing Team" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold">Scrubbing Team Dashboard</h2>
                    <p className="text-muted-foreground">Your lead upload and management statistics</p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Uploaded</CardTitle>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUploaded}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{unassignedLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                            <UserPlus className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{assignedLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Converted</CardTitle>
                            <CheckSquare className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{convertedLeads}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                        <CardDescription>Your most recently uploaded leads</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentUploads.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No recent uploads</p>
                        ) : (
                            <div className="space-y-2">
                                {recentUploads.map((lead) => (
                                    <Link key={lead.id} href={leads.show(lead.id)} className="block">
                                        <div className="flex items-center justify-between p-3 rounded border hover:bg-muted/50 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium">{lead.name}</p>
                                                {lead.company_name && (
                                                    <p className="text-sm text-muted-foreground">{lead.company_name}</p>
                                                )}
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-muted-foreground">{lead.created_at}</p>
                                                {lead.assigned_to && (
                                                    <p className="text-xs text-blue-600">Assigned to: {lead.assigned_to}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    <Link href={leads.upload()}>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Leads
                        </Button>
                    </Link>
                    <Link href={leads.index()}>
                        <Button variant="outline">View All Leads</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

function WFMDashboard({
    totalLeads = 0,
    unassignedLeads = 0,
    assignedLeads = 0,
    hotLeads = 0,
    todayCalls = 0,
    todayMeetings = 0,
    callingTeamMembers = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - WFM" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold">WFM Dashboard</h2>
                    <p className="text-muted-foreground">Workforce management and team performance</p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unassigned Leads</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{unassignedLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                            <Target className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{hotLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
                            <CheckSquare className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{assignedLeads}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Calls</CardTitle>
                            <Phone className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{todayCalls}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{todayMeetings}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Calling Team Performance</CardTitle>
                        <CardDescription>Assigned leads per team member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {callingTeamMembers.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No calling team members</p>
                        ) : (
                            <div className="space-y-2">
                                {callingTeamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                        <span className="text-sm font-medium">{member.name}</span>
                                        <span className="text-sm text-muted-foreground">{member.assigned_leads_count} leads</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Link href={leads.index()}>
                    <Button>Manage Leads</Button>
                </Link>
            </div>
        </AppLayout>
    );
}

function CallingDashboard({
    assignedLeads = 0,
    newLeads = 0,
    hotLeads = 0,
    meetingsScheduled = 0,
    todayCalls = 0,
    todayConnected = 0,
    upcomingMeetings = [],
    followUpsNeeded = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Calling Team" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold">Calling Team Dashboard</h2>
                    <p className="text-muted-foreground">Your assigned leads and call activities</p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{assignedLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{newLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                            <Target className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{hotLeads}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Meetings Scheduled</CardTitle>
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{meetingsScheduled}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Calls</CardTitle>
                            <Phone className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{todayCalls}</div>
                            <p className="text-xs text-muted-foreground mt-1">{todayConnected} connected</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {todayCalls > 0 ? Math.round((todayConnected / todayCalls) * 100) : 0}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Meetings</CardTitle>
                        <CardDescription>Your scheduled meetings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {upcomingMeetings.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No upcoming meetings</p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingMeetings.map((meeting) => (
                                    <div key={meeting.id} className="flex items-center justify-between p-3 rounded border">
                                        <div className="flex-1">
                                            <p className="font-medium">{meeting.title}</p>
                                            <p className="text-sm text-muted-foreground">{meeting.lead_name} {meeting.company && `- ${meeting.company}`}</p>
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground">
                                            {meeting.scheduled_at}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Follow-ups Needed</CardTitle>
                        <CardDescription>Leads requiring follow-up in the next 2 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {followUpsNeeded.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No follow-ups needed</p>
                        ) : (
                            <div className="space-y-2">
                                {followUpsNeeded.map((lead) => (
                                    <Link key={lead.id} href={leads.show(lead.id)} className="block">
                                        <div className="flex items-center justify-between p-3 rounded border hover:bg-muted/50 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium">{lead.name}</p>
                                                <p className="text-sm text-muted-foreground">{lead.company_name || lead.phone}</p>
                                            </div>
                                            <div className="text-right text-sm text-orange-600">
                                                {lead.next_follow_up_at}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Link href={leads.index()}>
                    <Button>View All My Leads</Button>
                </Link>
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
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded border">
                                        <div className="flex-1">
                                            <p className="font-medium">{task.title}</p>
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
