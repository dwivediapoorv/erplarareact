import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import meetings from '@/routes/meetings';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Plus, User, Video } from 'lucide-react';
import { useState } from 'react';

interface Meeting {
    id: number;
    lead_id: number;
    scheduled_by: number;
    assigned_to: number;
    title: string;
    description: string | null;
    scheduled_at: string;
    duration_minutes: number;
    meeting_type: string;
    meeting_link: string | null;
    location: string | null;
    status: string;
    reschedule_count: number;
    lead: {
        id: number;
        name: string;
        company_name: string | null;
    };
    scheduled_by_user: {
        id: number;
        name: string;
    };
    assigned_to_user: {
        id: number;
        name: string;
    };
}

interface Props extends PageProps {
    meetings: {
        data: Meeting[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        status?: string;
        meeting_type?: string;
        date_from?: string;
        date_to?: string;
    };
}

const meetingStatusLabels: Record<string, string> = {
    scheduled: 'Scheduled',
    rescheduled: 'Rescheduled',
    completed: 'Completed',
    no_show: 'No Show',
    cancelled: 'Cancelled',
};

const meetingStatusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    rescheduled: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    no_show: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
};

const meetingTypeLabels: Record<string, string> = {
    physical: 'Physical',
    online: 'Online',
    phone: 'Phone',
};

export default function Index({ meetings: meetingsData, filters, auth }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [meetingType, setMeetingType] = useState(filters.meeting_type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get(
            meetings.index(),
            { status, meeting_type: meetingType, date_from: dateFrom, date_to: dateTo },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setStatus('');
        setMeetingType('');
        setDateFrom('');
        setDateTo('');
        router.get(meetings.index());
    };

    const canCreate = auth?.permissions?.includes('create meetings') || false;

    return (
        <AppLayout>
            <Head title="Meetings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
                        <p className="text-muted-foreground">
                            Manage and track all scheduled meetings
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={meetings.create()}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Schedule Meeting
                            </Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.entries(meetingStatusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={meetingType || 'all'} onValueChange={(value) => setMeetingType(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {Object.entries(meetingTypeLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="From Date"
                            />

                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="To Date"
                            />

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Apply
                                </Button>
                                <Button onClick={handleReset} variant="outline">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Meetings ({meetingsData.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {meetingsData.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                <p className="text-muted-foreground">
                                    {filters.status || filters.meeting_type
                                        ? 'Try adjusting your filters'
                                        : 'Start scheduling meetings with your leads'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {meetingsData.data.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="rounded-lg border p-4 hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg">{meeting.title}</h3>
                                                    <Badge className={meetingStatusColors[meeting.status]}>
                                                        {meetingStatusLabels[meeting.status]}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {meetingTypeLabels[meeting.meeting_type]}
                                                    </Badge>
                                                    {meeting.reschedule_count > 0 && (
                                                        <Badge className="bg-orange-100 text-orange-800">
                                                            Rescheduled {meeting.reschedule_count}x
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Link
                                                    href={leads.show(meeting.lead_id)}
                                                    className="text-muted-foreground hover:underline block mb-2"
                                                >
                                                    {meeting.lead.name}
                                                    {meeting.lead.company_name && (
                                                        <span> - {meeting.lead.company_name}</span>
                                                    )}
                                                </Link>

                                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(meeting.scheduled_at).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {meeting.duration_minutes} minutes
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        With: {meeting.assigned_to_user.name}
                                                    </div>
                                                    {meeting.meeting_type === 'online' && meeting.meeting_link && (
                                                        <div className="flex items-center gap-1">
                                                            <Video className="h-4 w-4" />
                                                            <a
                                                                href={meeting.meeting_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:underline text-blue-600"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                Join Meeting
                                                            </a>
                                                        </div>
                                                    )}
                                                    {meeting.meeting_type === 'physical' && meeting.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {meeting.location}
                                                        </div>
                                                    )}
                                                </div>

                                                {meeting.description && (
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {meeting.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {meetingsData.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {(meetingsData.current_page - 1) * meetingsData.per_page + 1} to{' '}
                                    {Math.min(
                                        meetingsData.current_page * meetingsData.per_page,
                                        meetingsData.total
                                    )}{' '}
                                    of {meetingsData.total} meetings
                                </div>
                                <div className="flex gap-2">
                                    {meetingsData.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(meetings.index(), {
                                                    ...filters,
                                                    page: meetingsData.current_page - 1,
                                                })
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {meetingsData.current_page < meetingsData.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(meetings.index(), {
                                                    ...filters,
                                                    page: meetingsData.current_page + 1,
                                                })
                                            }
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
