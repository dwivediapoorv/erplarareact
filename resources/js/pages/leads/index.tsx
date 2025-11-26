import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Mail, MapPin, Phone, Plus, Search, Upload, User, Users } from 'lucide-react';
import { useState } from 'react';

interface Lead {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    company_name: string | null;
    status: string;
    priority: string | null;
    uploaded_by: number;
    current_owner_id: number | null;
    last_contacted_at: string | null;
    next_follow_up_at: string | null;
    created_at: string;
    uploaded_by_label?: string;
    current_owner_label?: string;
}

interface Props extends PageProps {
    leads: {
        data: Lead[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        status?: string;
        priority?: string;
        search?: string;
    };
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

const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-red-100 text-red-800',
};

export default function Index({ leads: leadsData, filters = {}, auth }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [priority, setPriority] = useState(filters?.priority || '');

    // Safety check for leadsData
    if (!leadsData) {
        return (
            <AppLayout>
                <Head title="Leads" />
                <div className="text-center py-12">
                    <p>Loading...</p>
                </div>
            </AppLayout>
        );
    }

    const handleFilter = () => {
        router.get(
            leads.index(),
            { search, status, priority },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        router.get(leads.index());
    };

    const canCreate = auth?.permissions?.includes('create leads') || false;
    const canUpload = auth?.permissions?.includes('upload leads') || false;

    return (
        <AppLayout>
            <Head title="Leads" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Leads</h1>
                    <div className="flex gap-2">
                        {canUpload && (
                            <Link href={leads.upload()}>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Leads
                                </Button>
                            </Link>
                        )}
                        {canCreate && (
                            <Link href={leads.create()}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Lead
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Leads</CardTitle>
                        <CardDescription>
                            Search and filter leads by status, priority, or name
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={priority || 'all'} onValueChange={(value) => setPriority(value === 'all' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <CardTitle>
                            All Leads ({leadsData.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {leadsData.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No leads found</h3>
                                <p className="text-muted-foreground">
                                    {filters?.search || filters?.status || filters?.priority
                                        ? 'Try adjusting your filters'
                                        : 'Get started by adding your first lead'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {leadsData.data.map((lead) => (
                                    <Link
                                        key={lead.id}
                                        href={leads.show(lead.id)}
                                        className="block"
                                    >
                                        <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg">
                                                            {lead.name}
                                                        </h3>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                statusColors[lead.status]
                                                            }`}
                                                        >
                                                            {statusLabels[lead.status]}
                                                        </span>
                                                        {lead.priority && (
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    priorityColors[lead.priority]
                                                                }`}
                                                            >
                                                                {lead.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                        {lead.company_name && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {lead.company_name}
                                                            </div>
                                                        )}
                                                        {lead.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-4 w-4" />
                                                                {lead.email}
                                                            </div>
                                                        )}
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-4 w-4" />
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                        {lead.current_owner_label && (
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                Assigned to: {lead.current_owner_label}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {lead.next_follow_up_at && (
                                                        <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                                                            <Calendar className="h-4 w-4" />
                                                            Follow up: {new Date(lead.next_follow_up_at).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {leadsData.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {(leadsData.current_page - 1) * leadsData.per_page + 1} to{' '}
                                    {Math.min(
                                        leadsData.current_page * leadsData.per_page,
                                        leadsData.total
                                    )}{' '}
                                    of {leadsData.total} leads
                                </div>
                                <div className="flex gap-2">
                                    {leadsData.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(leads.index(), {
                                                    ...filters,
                                                    page: leadsData.current_page - 1,
                                                })
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {leadsData.current_page < leadsData.last_page && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(leads.index(), {
                                                    ...filters,
                                                    page: leadsData.current_page + 1,
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
