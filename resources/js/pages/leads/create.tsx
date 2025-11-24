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

export default function Create({ }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        website: '',
        company_name: '',
        designation: '',
        address: '',
        city: '',
        state: '',
        country: '',
        source: '',
        priority: 'medium',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(leads.store());
    };

    return (
        <AppLayout>
            <Head title="Create Lead" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href={leads.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Lead</h1>
                        <p className="text-muted-foreground">Add a new lead to the system</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the lead's basic contact information
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
                                            placeholder="John Doe"
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
                                            placeholder="john@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+1234567890"
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
                                            placeholder="https://example.com"
                                        />
                                        <InputError message={errors.website} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                                <CardDescription>Details about the lead's company</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="Acme Inc."
                                        />
                                        <InputError message={errors.company_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <Input
                                            id="designation"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            placeholder="CEO"
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
                                        placeholder="123 Main Street"
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
                                            placeholder="New York"
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="NY"
                                        />
                                        <InputError message={errors.state} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="USA"
                                        />
                                        <InputError message={errors.country} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="source">Source</Label>
                                        <Input
                                            id="source"
                                            value={data.source}
                                            onChange={(e) => setData('source', e.target.value)}
                                            placeholder="Website, Referral, etc."
                                        />
                                        <InputError message={errors.source} />
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

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional notes about this lead..."
                                        rows={4}
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Creating...' : 'Create Lead'}
                            </Button>
                            <Link href={leads.index()}>
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
