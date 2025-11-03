import AppLayout from '@/layouts/app-layout';
import minutesOfMeetings from '@/routes/minutes-of-meetings';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Minutes of Meetings',
        href: minutesOfMeetings.index().url,
    },
    {
        title: 'Create Minutes of Meeting',
        href: minutesOfMeetings.create().url,
    },
];

export default function CreateMinutesOfMeeting() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        meeting_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(minutesOfMeetings.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Minutes of Meeting" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Minutes of Meeting</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Title */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Meeting Date */}
                            <div className="space-y-2">
                                <Label htmlFor="meeting_date">
                                    Meeting Date
                                </Label>
                                <Input
                                    id="meeting_date"
                                    type="date"
                                    value={data.meeting_date}
                                    onChange={(e) =>
                                        setData('meeting_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.meeting_date} />
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
                                {processing ? 'Creating...' : 'Create Minutes of Meeting'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
