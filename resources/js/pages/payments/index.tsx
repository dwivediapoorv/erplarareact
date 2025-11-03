import AppLayout from '@/layouts/app-layout';
import payments from '@/routes/payments';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: payments.index().url,
    },
];

interface Payment {
    id: number;
    title: string;
    amount: number;
    payment_date: string;
    status: string;
    payment_method: string | null;
    description: string | null;
}

interface PaymentsIndexProps {
    payments: Payment[];
}

export default function PaymentsIndex({ payments: paymentList }: PaymentsIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Payments</h1>
                    <Button asChild>
                        <Link href={payments.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Payment
                        </Link>
                    </Button>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Payment Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Payment Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {paymentList.length > 0 ? (
                                    paymentList.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="hover:bg-sidebar-accent/50"
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                {payment.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                ${payment.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {payment.payment_date}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {payment.payment_method || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {payment.description || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            No payments found
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
