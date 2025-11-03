import AppLayout from '@/layouts/app-layout';
import payroll from '@/routes/payroll';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: payroll.index().url,
    },
];

interface Payroll {
    id: number;
    employee_name: string;
    amount: number;
    payment_date: string;
    status: string;
    notes: string | null;
}

interface PayrollIndexProps {
    payrolls: Payroll[];
}

export default function PayrollIndex({ payrolls: payrollList }: PayrollIndexProps) {
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
            paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Payroll</h1>
                    <Button asChild>
                        <Link href={payroll.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Payroll
                        </Link>
                    </Button>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Employee
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
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {payrollList.length > 0 ? (
                                    payrollList.map((payrollItem) => (
                                        <tr
                                            key={payrollItem.id}
                                            className="hover:bg-sidebar-accent/50"
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                {payrollItem.employee_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                ${payrollItem.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {payrollItem.payment_date}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {getStatusBadge(payrollItem.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {payrollItem.notes || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            No payroll records found
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
