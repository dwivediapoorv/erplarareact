import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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
    source: string | null;
    priority: string | null;
    notes: string | null;
    status: string;
    lost_reason: string | null;
}

interface Props extends PageProps {
    lead: Lead;
}

export default function Edit({ lead }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        website: lead.website || '',
        company_name: lead.company_name || '',
        designation: lead.designation || '',
        address: lead.address || '',
        city: lead.city || '',
        state: lead.state || '',
        country: lead.country || '',
        priority: lead.priority || 'medium',
        notes: lead.notes || '',
        status: lead.status,
        lost_reason: lead.lost_reason || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(leads.update(lead.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Lead: ${lead.name}`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href={leads.show(lead.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Lead</h1>
                        <p className="text-muted-foreground">Update lead information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Update the lead's basic contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                        />
                                        <InputError message={errors.website} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                        />
                                        <InputError message={errors.company_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <Input
                                            id="designation"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                        />
                                        <InputError message={errors.designation} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                        <InputError message={errors.state} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                        />
                                        <InputError message={errors.country} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Lead Status & Priority</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="assigned">Assigned</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="connected">Connected</SelectItem>
                                                <SelectItem value="hot_lead">Hot Lead</SelectItem>
                                                <SelectItem value="meeting_scheduled">
                                                    Meeting Scheduled
                                                </SelectItem>
                                                <SelectItem value="meeting_completed">
                                                    Meeting Completed
                                                </SelectItem>
                                                <SelectItem value="converted">Converted</SelectItem>
                                                <SelectItem value="lost">Lost</SelectItem>
                                                <SelectItem value="unqualified">Unqualified</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) => setData('priority', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.priority} />
                                    </div>
                                </div>

                                {data.status === 'lost' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="lost_reason">Lost Reason</Label>
                                        <Input
                                            id="lost_reason"
                                            value={data.lost_reason}
                                            onChange={(e) => setData('lost_reason', e.target.value)}
                                            placeholder="Reason for marking as lost"
                                        />
                                        <InputError message={errors.lost_reason} />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Link href={leads.show(lead.id)}>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
