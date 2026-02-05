import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
    {
        title: 'Create Project',
        href: projects.create().url,
    },
];

interface Employee {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
}

interface Access {
    id: number;
    name: string;
}

interface CreateProjectProps {
    seoEmployees: Employee[];
    projectManagers: Employee[];
    services: Service[];
    accesses: Access[];
}

export default function CreateProject({ seoEmployees, projectManagers, services, accesses }: CreateProjectProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_name: '',
        onboarding_notes: '',
        date_of_onboarding: '',
        project_start_date: '',
        client_name: '',
        business_name: '',
        business_type: '',
        website: '',
        email_address: '',
        alternate_email_address: '',
        phone_number: '',
        alternate_phone_number: '',
        business_address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        preferred_contact_method: '',
        timezone: '',
        industry: '',
        social_media_links: [''] as string[],
        competitors: [''] as string[],
        assigned_to: '',
        project_manager_id: '',
        blogs_count: '',
        monthly_report_date: '',
        payment_amount: '',
        payment_type: '',
        service_ids: [] as number[],
        access_ids: [] as number[],
    });

    const [showBlogFields, setShowBlogFields] = useState(false);
    const [newAccessName, setNewAccessName] = useState('');
    const [localAccesses, setLocalAccesses] = useState(accesses);

    // Check if "Content Marketing" service is selected
    useEffect(() => {
        const contentMarketingService = services.find(
            (service) => service.name.toLowerCase().includes('content marketing')
        );
        if (contentMarketingService) {
            setShowBlogFields(data.service_ids.includes(contentMarketingService.id));
        }
    }, [data.service_ids, services]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(projects.store().url);
    };

    const handleServiceToggle = (serviceId: number, checked: boolean) => {
        if (checked) {
            setData('service_ids', [...data.service_ids, serviceId]);
        } else {
            setData(
                'service_ids',
                data.service_ids.filter((id) => id !== serviceId)
            );
        }
    };

    const handleAccessToggle = (accessId: number, checked: boolean) => {
        if (checked) {
            setData('access_ids', [...data.access_ids, accessId]);
        } else {
            setData(
                'access_ids',
                data.access_ids.filter((id) => id !== accessId)
            );
        }
    };

    const addSocialMediaLink = () => {
        setData('social_media_links', [...data.social_media_links, '']);
    };

    const removeSocialMediaLink = (index: number) => {
        const newLinks = data.social_media_links.filter((_, i) => i !== index);
        setData('social_media_links', newLinks.length > 0 ? newLinks : ['']);
    };

    const updateSocialMediaLink = (index: number, value: string) => {
        const newLinks = [...data.social_media_links];
        newLinks[index] = value;
        setData('social_media_links', newLinks);
    };

    const addCompetitor = () => {
        setData('competitors', [...data.competitors, '']);
    };

    const removeCompetitor = (index: number) => {
        const newCompetitors = data.competitors.filter((_, i) => i !== index);
        setData('competitors', newCompetitors.length > 0 ? newCompetitors : ['']);
    };

    const updateCompetitor = (index: number, value: string) => {
        const newCompetitors = [...data.competitors];
        newCompetitors[index] = value;
        setData('competitors', newCompetitors);
    };

    const handleAddNewAccess = async () => {
        if (!newAccessName.trim()) return;

        try {
            const response = await axios.post('/accesses', { name: newAccessName.trim() });
            const newAccess = response.data;
            setLocalAccesses([...localAccesses, newAccess].sort((a, b) => a.name.localeCompare(b.name)));
            setData('access_ids', [...data.access_ids, newAccess.id]);
            setNewAccessName('');
        } catch (error: any) {
            console.error('Failed to add new access:', error);
            const message = error.response?.data?.message || error.response?.data?.errors?.name?.[0] || 'Failed to add access type';
            alert(message);
        }
    };

    const timezones = [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Singapore',
        'Asia/Tokyo',
        'Australia/Sydney',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Project</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Project Information</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Project Name */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="project_name">
                                        Project Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="project_name"
                                        type="text"
                                        value={data.project_name}
                                        onChange={(e) => setData('project_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.project_name} />
                                </div>

                                {/* Onboarding Notes */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="onboarding_notes">Onboarding Notes</Label>
                                    <Textarea
                                        id="onboarding_notes"
                                        value={data.onboarding_notes}
                                        onChange={(e) => setData('onboarding_notes', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError message={errors.onboarding_notes} />
                                </div>

                                {/* Date of Onboarding */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_onboarding">Date of Onboarding</Label>
                                    <Input
                                        id="date_of_onboarding"
                                        type="date"
                                        value={data.date_of_onboarding}
                                        onChange={(e) => setData('date_of_onboarding', e.target.value)}
                                    />
                                    <InputError message={errors.date_of_onboarding} />
                                </div>

                                {/* Project Start Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_start_date">Project Start Date</Label>
                                    <Input
                                        id="project_start_date"
                                        type="date"
                                        value={data.project_start_date}
                                        onChange={(e) => setData('project_start_date', e.target.value)}
                                    />
                                    <InputError message={errors.project_start_date} />
                                </div>

                                {/* Industry */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="industry">Industry / Niche</Label>
                                    <Input
                                        id="industry"
                                        type="text"
                                        value={data.industry}
                                        onChange={(e) => setData('industry', e.target.value)}
                                        placeholder="e.g., Healthcare, E-commerce, Real Estate"
                                    />
                                    <InputError message={errors.industry} />
                                </div>
                            </div>
                        </div>

                        {/* Client & Business Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Client & Business Information</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Client Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="client_name">
                                        Client Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="client_name"
                                        type="text"
                                        value={data.client_name}
                                        onChange={(e) => setData('client_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.client_name} />
                                </div>

                                {/* Business Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="business_name">Business Name</Label>
                                    <Input
                                        id="business_name"
                                        type="text"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                    />
                                    <InputError message={errors.business_name} />
                                </div>

                                {/* Business Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="business_type">Business Type</Label>
                                    <Input
                                        id="business_type"
                                        type="text"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        placeholder="e.g., LLC, Corporation, Sole Proprietor"
                                    />
                                    <InputError message={errors.business_type} />
                                </div>

                                {/* Website */}
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="text"
                                        placeholder="https://example.com"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                    />
                                    <InputError message={errors.website} />
                                </div>

                                {/* Email Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="email_address">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email_address"
                                        type="email"
                                        value={data.email_address}
                                        onChange={(e) => setData('email_address', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email_address} />
                                </div>

                                {/* Alternate Email Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="alternate_email_address">Alternate Email Address</Label>
                                    <Input
                                        id="alternate_email_address"
                                        type="email"
                                        value={data.alternate_email_address}
                                        onChange={(e) => setData('alternate_email_address', e.target.value)}
                                    />
                                    <InputError message={errors.alternate_email_address} />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                {/* Alternate Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="alternate_phone_number">Alternate Phone Number</Label>
                                    <Input
                                        id="alternate_phone_number"
                                        type="tel"
                                        value={data.alternate_phone_number}
                                        onChange={(e) => setData('alternate_phone_number', e.target.value)}
                                    />
                                    <InputError message={errors.alternate_phone_number} />
                                </div>
                            </div>
                        </div>

                        {/* Business Address */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Business Address</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="business_address">Street Address</Label>
                                    <Textarea
                                        id="business_address"
                                        value={data.business_address}
                                        onChange={(e) => setData('business_address', e.target.value)}
                                        rows={2}
                                    />
                                    <InputError message={errors.business_address} />
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <Label htmlFor="state">State / Province</Label>
                                    <Input
                                        id="state"
                                        type="text"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                    />
                                    <InputError message={errors.state} />
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} />
                                </div>

                                {/* Postal Code */}
                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                    />
                                    <InputError message={errors.postal_code} />
                                </div>
                            </div>
                        </div>

                        {/* Communication Preferences */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Communication Preferences</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Preferred Contact Method */}
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
                                    <Select
                                        value={data.preferred_contact_method}
                                        onValueChange={(value) => setData('preferred_contact_method', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select contact method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                            <SelectItem value="video_call">Video Call</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.preferred_contact_method} />
                                </div>

                                {/* Timezone */}
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={data.timezone}
                                        onValueChange={(value) => setData('timezone', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((tz) => (
                                                <SelectItem key={tz} value={tz}>
                                                    {tz}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.timezone} />
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Social Media Links</h2>
                                <Button type="button" variant="outline" size="sm" onClick={addSocialMediaLink}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Link
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.social_media_links.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="url"
                                            value={link}
                                            onChange={(e) => updateSocialMediaLink(index, e.target.value)}
                                            placeholder="https://facebook.com/yourpage"
                                            className="flex-1"
                                        />
                                        {data.social_media_links.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeSocialMediaLink(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competitors */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Competitors</h2>
                                <Button type="button" variant="outline" size="sm" onClick={addCompetitor}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Competitor
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.competitors.map((competitor, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="url"
                                            value={competitor}
                                            onChange={(e) => updateCompetitor(index, e.target.value)}
                                            placeholder="https://competitor.com"
                                            className="flex-1"
                                        />
                                        {data.competitors.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeCompetitor(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Assignment */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Project Assignment</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Assigned To (SEO Team) */}
                                <div className="space-y-2">
                                    <Label htmlFor="assigned_to">Assigned To (SEO Team)</Label>
                                    <Select
                                        value={data.assigned_to}
                                        onValueChange={(value) => setData('assigned_to', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seoEmployees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.assigned_to} />
                                </div>

                                {/* Project Manager */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_manager_id">Project Manager</Label>
                                    <Select
                                        value={data.project_manager_id}
                                        onValueChange={(value) => setData('project_manager_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select project manager" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectManagers.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.project_manager_id} />
                                </div>
                            </div>
                        </div>

                        {/* Services Offered */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                Services Offered <span className="text-red-500">*</span>
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`service-${service.id}`}
                                            checked={data.service_ids.includes(service.id)}
                                            onCheckedChange={(checked) =>
                                                handleServiceToggle(service.id, checked as boolean)
                                            }
                                        />
                                        <Label htmlFor={`service-${service.id}`} className="cursor-pointer font-normal">
                                            {service.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.service_ids} />
                        </div>

                        {/* Access Received */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Access Received</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {localAccesses.map((access) => (
                                    <div key={access.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`access-${access.id}`}
                                            checked={data.access_ids.includes(access.id)}
                                            onCheckedChange={(checked) =>
                                                handleAccessToggle(access.id, checked as boolean)
                                            }
                                        />
                                        <Label htmlFor={`access-${access.id}`} className="cursor-pointer font-normal">
                                            {access.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Input
                                    type="text"
                                    value={newAccessName}
                                    onChange={(e) => setNewAccessName(e.target.value)}
                                    placeholder="Add new access type..."
                                    className="max-w-xs"
                                />
                                <Button type="button" variant="outline" onClick={handleAddNewAccess}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Blog Fields (conditional) */}
                        {showBlogFields && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Blog Information</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Blogs Count */}
                                    <div className="space-y-2">
                                        <Label htmlFor="blogs_count">Blogs Count</Label>
                                        <Input
                                            id="blogs_count"
                                            type="number"
                                            min="0"
                                            value={data.blogs_count}
                                            onChange={(e) => setData('blogs_count', e.target.value)}
                                        />
                                        <InputError message={errors.blogs_count} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Monthly Report Date */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Reporting</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_report_date">Monthly Report Date</Label>
                                    <Input
                                        id="monthly_report_date"
                                        type="date"
                                        value={data.monthly_report_date}
                                        onChange={(e) => setData('monthly_report_date', e.target.value)}
                                    />
                                    <InputError message={errors.monthly_report_date} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Payment Information</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Payment Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="payment_amount">Payment Amount</Label>
                                    <Input
                                        id="payment_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.payment_amount}
                                        onChange={(e) => setData('payment_amount', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.payment_amount} />
                                </div>

                                {/* Payment Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="payment_type">Payment Type</Label>
                                    <Select
                                        value={data.payment_type}
                                        onValueChange={(value) => setData('payment_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="one_time">One Time</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_type} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
