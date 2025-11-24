import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Mail, MapPin, Phone, Edit, UserPlus, PhoneCall, Video } from 'lucide-react';

interface CallLog {
    id: number;
    called_at: string;
    call_status: string;
    call_disposition: string | null;
    call_notes: string | null;
    duration_seconds: number | null;
    caller: {
        id: number;
        name: string;
    };
}

interface Meeting {
    id: number;
    title: string;
    scheduled_at: string;
    status: string;
    meeting_type: string;
    scheduled_by: {
        id: number;
        name: string;
    };
    assigned_to: {
        id: number;
        name: string;
    };
}

interface Assignment {
    id: number;
    assigned_at: string;
    assignment_notes: string | null;
    assigned_to: {
        id: number;
        name: string;
    };
    assigned_by: {
        id: number;
        name: string;
    };
}

interface Note {
    id: number;
    note: string;
    note_type: string;
    created_at: string;
    created_by: {
        id: number;
        name: string;
    };
}

interface Lead {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    company_name: string | null;
    designation: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    status: string;
    priority: string | null;
    notes: string | null;
    source: string | null;
    last_contacted_at: string | null;
    next_follow_up_at: string | null;
    created_at: string;
    uploaded_by: {
        id: number;
        name: string;
    };
    current_owner: {
        id: number;
        name: string;
    } | null;
    call_logs: CallLog[];
    meetings: Meeting[];
    assignments: Assignment[];
}

interface Props extends PageProps {
    lead: Lead;
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    connected: 'bg-green-100 text-green-800',
    hot_lead: 'bg-red-100 text-red-800',
    meeting_scheduled: 'bg-orange-100 text-orange-800',
    meeting_completed: 'bg-teal-100 text-teal-800',
    converted: 'bg-emerald-100 text-emerald-800',
    lost: 'bg-gray-100 text-gray-800',
    unqualified: 'bg-slate-100 text-slate-800',
};

const statusLabels: Record<string, string> = {
    new: 'New',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    connected: 'Connected',
    hot_lead: 'Hot Lead',
    meeting_scheduled: 'Meeting Scheduled',
    meeting_completed: 'Meeting Completed',
    converted: 'Converted',
    lost: 'Lost',
    unqualified: 'Unqualified',
};

const callStatusLabels: Record<string, string> = {
    connected: 'Connected',
    not_connected: 'Not Connected',
    busy: 'Busy',
    no_answer: 'No Answer',
    wrong_number: 'Wrong Number',
    switched_off: 'Switched Off',
    not_reachable: 'Not Reachable',
};

const meetingStatusLabels: Record<string, string> = {
    scheduled: 'Scheduled',
    rescheduled: 'Rescheduled',
    completed: 'Completed',
    no_show: 'No Show',
    cancelled: 'Cancelled',
};

export default function Show({ lead, auth }: Props) {
    const canEdit = auth.permissions.includes('edit leads');
    const canAssign = auth.permissions.includes('assign leads');
    const canLogCall = auth.permissions.includes('create call-logs');
    const canScheduleMeeting = auth.permissions.includes('create meetings');

    return (
        <AppLayout>
            <Head title={`Lead: ${lead.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={leads.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
                            <Badge className={statusColors[lead.status]}>
                                {statusLabels[lead.status]}
                            </Badge>
                            {lead.priority && (
                                <Badge variant="outline">{lead.priority.toUpperCase()}</Badge>
                            )}
                        </div>
                        {lead.company_name && (
                            <p className="text-muted-foreground">{lead.company_name}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {canAssign && (
                            <Link href={leads.assign(lead.id)}>
                                <Button variant="outline">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Assign
                                </Button>
                            </Link>
                        )}
                        {canEdit && (
                            <Link href={leads.edit(lead.id)}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        {(canLogCall || canScheduleMeeting) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    {canLogCall && (
                                        <Button className="flex-1">
                                            <PhoneCall className="mr-2 h-4 w-4" />
                                            Log Call
                                        </Button>
                                    )}
                                    {canScheduleMeeting && (
                                        <Button className="flex-1" variant="outline">
                                            <Video className="mr-2 h-4 w-4" />
                                            Schedule Meeting
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Call History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Call History</CardTitle>
                                <CardDescription>
                                    {lead.call_logs.length} call(s) logged
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {lead.call_logs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No calls logged yet
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {lead.call_logs.map((call) => (
                                            <div key={call.id} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">
                                                            {callStatusLabels[call.call_status]}
                                                        </Badge>
                                                        {call.call_disposition && (
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                {call.call_disposition.replace(/_/g, ' ')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Called by {call.caller.name} on{' '}
                                                        {new Date(call.called_at).toLocaleString()}
                                                    </p>
                                                    {call.call_notes && (
                                                        <p className="text-sm">{call.call_notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Meetings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Meetings</CardTitle>
                                <CardDescription>
                                    {lead.meetings.length} meeting(s) scheduled
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {lead.meetings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No meetings scheduled
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {lead.meetings.map((meeting) => (
                                            <div key={meeting.id} className="rounded-lg border p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold">{meeting.title}</h4>
                                                            <Badge variant="outline">
                                                                {meetingStatusLabels[meeting.status]}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(meeting.scheduled_at).toLocaleString()}
                                                            </div>
                                                            <div>
                                                                {meeting.meeting_type.charAt(0).toUpperCase() +
                                                                    meeting.meeting_type.slice(1)}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            With {meeting.assigned_to.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assignment History */}
                        {lead.assignments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assignment History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {lead.assignments.map((assignment) => (
                                            <div key={assignment.id} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 mt-2 rounded-full bg-muted"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm">
                                                        Assigned to <strong>{assignment.assigned_to.name}</strong> by{' '}
                                                        {assignment.assigned_by.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(assignment.assigned_at).toLocaleString()}
                                                    </p>
                                                    {assignment.assignment_notes && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {assignment.assignment_notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {lead.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${lead.email}`} className="hover:underline">
                                            {lead.email}
                                        </a>
                                    </div>
                                )}
                                {lead.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a href={`tel:${lead.phone}`} className="hover:underline">
                                            {lead.phone}
                                        </a>
                                    </div>
                                )}
                                {lead.website && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={lead.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {lead.website}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {lead.designation && (
                                    <div>
                                        <p className="font-medium">Designation</p>
                                        <p className="text-muted-foreground">{lead.designation}</p>
                                    </div>
                                )}
                                {(lead.city || lead.state || lead.country) && (
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-muted-foreground">
                                            {[lead.city, lead.state, lead.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                )}
                                {lead.source && (
                                    <div>
                                        <p className="font-medium">Source</p>
                                        <p className="text-muted-foreground">{lead.source}</p>
                                    </div>
                                )}
                                {lead.current_owner && (
                                    <div>
                                        <p className="font-medium">Current Owner</p>
                                        <p className="text-muted-foreground">{lead.current_owner.name}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">Uploaded By</p>
                                    <p className="text-muted-foreground">{lead.uploaded_by.name}</p>
                                </div>
                                {lead.next_follow_up_at && (
                                    <div>
                                        <p className="font-medium">Next Follow-up</p>
                                        <p className="text-orange-600">
                                            {new Date(lead.next_follow_up_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {lead.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{lead.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
