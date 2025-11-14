import SelfServiceLayout from '@/layouts/self-service-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service Portal',
        href: '/employee/my-details',
    },
    {
        title: 'Calendar',
        href: '/calendar',
    },
    {
        title: 'Add Holiday',
        href: '#',
    },
];

export default function CreateHoliday() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        date: '',
        type: 'company',
        description: '',
        is_recurring: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting holiday data:', data);
        post('/calendar', {
            onSuccess: () => {
                console.log('Holiday created successfully');
            },
            onError: (errors) => {
                console.error('Error creating holiday:', errors);
            },
        });
    };

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Holiday" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/calendar">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">Add Holiday</h1>
                </div>

                <div className="max-w-2xl">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Holiday Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Republic Day, Diwali"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Holiday Type</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="national">National Holiday</SelectItem>
                                        <SelectItem value="company">Company Holiday</SelectItem>
                                        <SelectItem value="optional">Optional Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Add any additional details about this holiday"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_recurring"
                                    checked={data.is_recurring}
                                    onCheckedChange={(checked) => setData('is_recurring', checked as boolean)}
                                />
                                <Label htmlFor="is_recurring" className="text-sm font-normal cursor-pointer">
                                    Recurring holiday (repeats every year)
                                </Label>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-sidebar-border/50">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Adding...' : 'Add Holiday'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/calendar">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SelfServiceLayout>
    );
}
