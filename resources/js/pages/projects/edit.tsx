import AppLayout from '@/layouts/app-layout';
import projects from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
    {
        title: 'Edit Project',
        href: '#',
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

interface Project {
    id: number;
    project_name: string;
    onboarding_notes: string | null;
    date_of_onboarding: string | null;
    project_start_date: string | null;
    client_name: string;
    website: string | null;
    email_address: string;
    alternate_email_address: string | null;
    phone_number: string;
    alternate_phone_number: string | null;
    assigned_to: number | null;
    project_manager_id: number | null;
    project_health: 'Red' | 'Green' | 'Orange';
    project_status: 'Active' | 'On Hold' | 'Suspended';
    blogs_count: number | null;
    monthly_report_date: string | null;
    service_ids: number[];
}

interface EditProjectProps {
    project: Project;
    seoEmployees: Employee[];
    projectManagers: Employee[];
    services: Service[];
}

export default function EditProject({ project, seoEmployees, projectManagers, services }: EditProjectProps) {
    const { data, setData, put, processing, errors } = useForm({
        project_name: project.project_name || '',
        onboarding_notes: project.onboarding_notes || '',
        date_of_onboarding: project.date_of_onboarding || '',
        project_start_date: project.project_start_date || '',
        client_name: project.client_name || '',
        website: project.website || '',
        email_address: project.email_address || '',
        alternate_email_address: project.alternate_email_address || '',
        phone_number: project.phone_number || '',
        alternate_phone_number: project.alternate_phone_number || '',
        assigned_to: project.assigned_to?.toString() || '',
        project_manager_id: project.project_manager_id?.toString() || '',
        project_health: project.project_health || 'Green',
        project_status: project.project_status || 'Active',
        blogs_count: project.blogs_count?.toString() || '',
        monthly_report_date: project.monthly_report_date || '',
        service_ids: project.service_ids || [] as number[],
    });

    const [showBlogFields, setShowBlogFields] = useState(false);

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
        put(projects.update(project.id).url);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Project</h1>
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
                                        onChange={(e) =>
                                            setData('project_name', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.project_name} />
                                </div>

                                {/* Onboarding Notes */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="onboarding_notes">
                                        Onboarding Notes
                                    </Label>
                                    <Textarea
                                        id="onboarding_notes"
                                        value={data.onboarding_notes}
                                        onChange={(e) =>
                                            setData('onboarding_notes', e.target.value)
                                        }
                                        rows={4}
                                    />
                                    <InputError message={errors.onboarding_notes} />
                                </div>

                                {/* Date of Onboarding */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_onboarding">
                                        Date of Onboarding
                                    </Label>
                                    <Input
                                        id="date_of_onboarding"
                                        type="date"
                                        value={data.date_of_onboarding}
                                        onChange={(e) =>
                                            setData('date_of_onboarding', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.date_of_onboarding} />
                                </div>

                                {/* Project Start Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_start_date">
                                        Project Start Date
                                    </Label>
                                    <Input
                                        id="project_start_date"
                                        type="date"
                                        value={data.project_start_date}
                                        onChange={(e) =>
                                            setData('project_start_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.project_start_date} />
                                </div>
                            </div>
                        </div>

                        {/* Client Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Client Information</h2>
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
                                        onChange={(e) =>
                                            setData('client_name', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.client_name} />
                                </div>

                                {/* Website */}
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="text"
                                        placeholder="https://example.com"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData('website', e.target.value)
                                        }
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
                                        onChange={(e) =>
                                            setData('email_address', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.email_address} />
                                </div>

                                {/* Alternate Email Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="alternate_email_address">
                                        Alternate Email Address
                                    </Label>
                                    <Input
                                        id="alternate_email_address"
                                        type="email"
                                        value={data.alternate_email_address}
                                        onChange={(e) =>
                                            setData('alternate_email_address', e.target.value)
                                        }
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
                                        onChange={(e) =>
                                            setData('phone_number', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                {/* Alternate Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="alternate_phone_number">
                                        Alternate Phone Number
                                    </Label>
                                    <Input
                                        id="alternate_phone_number"
                                        type="tel"
                                        value={data.alternate_phone_number}
                                        onChange={(e) =>
                                            setData('alternate_phone_number', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.alternate_phone_number} />
                                </div>
                            </div>
                        </div>

                        {/* Project Assignment */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Project Assignment</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Assigned To (SEO Team) */}
                                <div className="space-y-2">
                                    <Label htmlFor="assigned_to">
                                        Assigned To (SEO Team)
                                    </Label>
                                    <Select
                                        value={data.assigned_to}
                                        onValueChange={(value) =>
                                            setData('assigned_to', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seoEmployees.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={employee.id.toString()}
                                                >
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.assigned_to} />
                                </div>

                                {/* Project Manager */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_manager_id">
                                        Project Manager
                                    </Label>
                                    <Select
                                        value={data.project_manager_id}
                                        onValueChange={(value) =>
                                            setData('project_manager_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select project manager" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectManagers.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={employee.id.toString()}
                                                >
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
                                        <Label
                                            htmlFor={`service-${service.id}`}
                                            className="cursor-pointer font-normal"
                                        >
                                            {service.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.service_ids} />
                        </div>

                        {/* Blog Fields (conditional) */}
                        {showBlogFields && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Blog Information</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Blogs Count */}
                                    <div className="space-y-2">
                                        <Label htmlFor="blogs_count">
                                            Blogs Count
                                        </Label>
                                        <Input
                                            id="blogs_count"
                                            type="number"
                                            min="0"
                                            value={data.blogs_count}
                                            onChange={(e) =>
                                                setData('blogs_count', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.blogs_count} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Project Status */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Project Status</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Project Health */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_health">
                                        Project Health <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.project_health}
                                        onValueChange={(value) =>
                                            setData('project_health', value as 'Red' | 'Green' | 'Orange')
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select health status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Green">Green</SelectItem>
                                            <SelectItem value="Orange">Orange</SelectItem>
                                            <SelectItem value="Red">Red</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.project_health} />
                                </div>

                                {/* Project Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_status">
                                        Project Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.project_status}
                                        onValueChange={(value) =>
                                            setData('project_status', value as 'Active' | 'On Hold' | 'Suspended')
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On Hold">On Hold</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.project_status} />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Report Date */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Reporting</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_report_date">
                                        Monthly Report Date
                                    </Label>
                                    <Input
                                        id="monthly_report_date"
                                        type="date"
                                        value={data.monthly_report_date}
                                        onChange={(e) =>
                                            setData('monthly_report_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.monthly_report_date} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
