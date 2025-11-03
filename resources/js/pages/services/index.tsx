import AppLayout from '@/layouts/app-layout';
import services from '@/routes/services';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: services.index().url,
    },
];

interface Service {
    id: number;
    name: string;
}

interface ServicesIndexProps {
    services: Service[];
}

export default function ServicesIndex({ services: servicesList }: ServicesIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Services</h1>
                    <Button asChild>
                        <Link href={services.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Service
                        </Link>
                    </Button>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Label
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {servicesList.length > 0 ? (
                                    servicesList.map((service) => (
                                        <tr
                                            key={service.id}
                                            className="hover:bg-sidebar-accent/50"
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                {service.name}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            className="px-6 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            No services found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
