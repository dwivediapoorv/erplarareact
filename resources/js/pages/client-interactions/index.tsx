import AppLayout from '@/layouts/app-layout';
import clientInteractions from '@/routes/client-interactions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Client Interactions',
        href: clientInteractions.index().url,
    },
];

interface Interaction {
    id: number;
    project_id: number;
    project_name: string;
    client_name: string;
    interaction_type: string;
    interaction_date: string;
    notes: string | null;
    outcome: string | null;
}

interface ClientInteractionsIndexProps {
    interactions: Interaction[];
}

export default function ClientInteractionsIndex({ interactions: interactionList }: ClientInteractionsIndexProps) {
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
            <Head title="Client Interactions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Client Interactions</h1>
                    <Button asChild>
                        <Link href={clientInteractions.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Interaction
                        </Link>
                    </Button>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Client Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Interaction Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Outcome
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {interactionList.length > 0 ? (
                                    interactionList.map((interaction) => (
                                        <tr
                                            key={interaction.id}
                                            className="hover:bg-sidebar-accent/50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {interaction.project_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {interaction.client_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {interaction.interaction_type}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {interaction.interaction_date}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {interaction.outcome || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {interaction.notes || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            No client interactions found
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
