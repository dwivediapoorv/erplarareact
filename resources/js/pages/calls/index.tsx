import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import callLogs from '@/routes/call-logs';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Phone, Plus, User } from 'lucide-react';
import { useState } from 'react';

interface CallLog {
    id: number;
    lead_id: number;
    called_by: number;
    called_at: string;
    call_status: string;
    call_disposition: string | null;
    duration_minutes: number | null;
    call_notes: string | null;
    next_follow_up_at: string | null;
    lead: {
        id: number;
        name: string;
        company_name: string | null;
        phone: string | null;
    };
    caller: {
        id: number;
        name: string;
    };
}

interface Props extends PageProps {
    callLogs: {
        data: CallLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        call_status?: string;
        call_disposition?: string;
        date_from?: string;
        date_to?: string;
    };
}

const callStatusLabels: Record<string, string> = {
    connected: 'Connected',
    not_connected: 'Not Connected',
    busy: 'Busy',
    no_answer: 'No Answer',
    wrong_number: 'Wrong Number',
    switched_off: 'Switched Off',
    not_reachable: 'Not Reachable',
};

const callStatusColors: Record<string, string> = {
    connected: 'bg-green-100 text-green-800',
    not_connected: 'bg-red-100 text-red-800',
    busy: 'bg-yellow-100 text-yellow-800',
    no_answer: 'bg-orange-100 text-orange-800',
    wrong_number: 'bg-gray-100 text-gray-800',
    switched_off: 'bg-slate-100 text-slate-800',
    not_reachable: 'bg-stone-100 text-stone-800',
};

const dispositionLabels: Record<string, string> = {
    interested: 'Interested',
    not_interested: 'Not Interested',
    call_back_later: 'Call Back Later',
    hot_lead: 'Hot Lead',
    meeting_scheduled: 'Meeting Scheduled',
    wrong_person: 'Wrong Person',
    language_barrier: 'Language Barrier',
    already_using_service: 'Already Using Service',
    budget_constraints: 'Budget Constraints',
    not_decision_maker: 'Not Decision Maker',
};

export default function Index({ callLogs: callLogsData, filters, auth }: Props) {
    const [callStatus, setCallStatus] = useState(filters.call_status || '');
    const [callDisposition, setCallDisposition] = useState(filters.call_disposition || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get(
            callLogs.index(),
            { call_status: callStatus, call_disposition: callDisposition, date_from: dateFrom, date_to: dateTo },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setCallStatus('');
        setCallDisposition('');
        setDateFrom('');
        setDateTo('');
        router.get(callLogs.index());
    };

    const canCreate = auth?.permissions?.includes('create call-logs') || false;

    return (
        <AppLayout>
            <Head title="Call Logs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Call Logs</h1>
                        <p className="text-muted-foreground">
                            Track all call activities and interactions
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={callLogs.create()}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Log New Call
                            </Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Call Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <Select value={callStatus || 'all'} onValueChange={(value) => setCallStatus(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Call Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.entries(callStatusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={callDisposition || 'all'} onValueChange={(value) => setCallDisposition(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Dispositions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Dispositions</SelectItem>
                                    {Object.entries(dispositionLabels).map(([value, label]) => (
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
                        <CardTitle>All Call Logs ({callLogsData.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {callLogsData.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No call logs found</h3>
                                <p className="text-muted-foreground">
                                    {filters.call_status || filters.call_disposition
                                        ? 'Try adjusting your filters'
                                        : 'Start logging calls to track your activities'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {callLogsData.data.map((callLog) => (
                                    <div
                                        key={callLog.id}
                                        className="rounded-lg border p-4 hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Link
                                                        href={leads.show(callLog.lead_id)}
                                                        className="font-semibold text-lg hover:underline"
                                                    >
                                                        {callLog.lead.name}
                                                    </Link>
                                                    <Badge className={callStatusColors[callLog.call_status]}>
                                                        {callStatusLabels[callLog.call_status]}
                                                    </Badge>
                                                    {callLog.call_disposition && (
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            {dispositionLabels[callLog.call_disposition]}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                    {callLog.lead.company_name && (
                                                        <div>{callLog.lead.company_name}</div>
                                                    )}
                                                    {callLog.lead.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            {callLog.lead.phone}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        Called by: {callLog.caller.name}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(callLog.called_at).toLocaleString()}
                                                    </div>
                                                    {callLog.duration_minutes && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            Duration: {callLog.duration_minutes} min
                                                        </div>
                                                    )}
                                                </div>

                                                {callLog.call_notes && (
                                                    <p className="mt-2 text-sm">{callLog.call_notes}</p>
                                                )}

                                                {callLog.next_follow_up_at && (
                                                    <div className="mt-2 text-sm text-orange-600">
                                                        Follow up: {new Date(callLog.next_follow_up_at).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {callLogsData.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {(callLogsData.current_page - 1) * callLogsData.per_page + 1} to{' '}
                                    {Math.min(
                                        callLogsData.current_page * callLogsData.per_page,
                                        callLogsData.total
                                    )}{' '}
                                    of {callLogsData.total} call logs
                                </div>
                                <div className="flex gap-2">
                                    {callLogsData.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(callLogs.index(), {
                                                    ...filters,
                                                    page: callLogsData.current_page - 1,
                                                })
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {callLogsData.current_page < callLogsData.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(callLogs.index(), {
                                                    ...filters,
                                                    page: callLogsData.current_page + 1,
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
