import SelfServiceLayout from '@/layouts/self-service-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Download, FileText, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service Portal',
        href: '/employee/my-details',
    },
    {
        title: 'Salary Slips',
        href: '#',
    },
];

interface SalarySlip {
    id: number;
    month: string;
    payment_date: string;
    basic_salary: string;
    hra: string;
    special_allowance: string;
    conveyance_allowance: string;
    deductions: string;
    gross_salary: string;
    net_salary: string;
    has_file: boolean;
    notes: string | null;
}

interface SalarySlipsIndexProps {
    salarySlips: SalarySlip[];
}

export default function SalarySlipsIndex({ salarySlips }: SalarySlipsIndexProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="Salary Slips" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Salary Slips</h1>
                    </div>
                </div>

                {salarySlips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-sidebar-border/70 p-12 dark:border-sidebar-border">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Salary Slips Available</h3>
                        <p className="text-sm text-muted-foreground">
                            Your salary slips will appear here once they are generated.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border bg-muted/50">
                                    <th className="text-left px-4 py-2 font-semibold text-sm">Month</th>
                                    <th className="text-left px-4 py-2 font-semibold text-sm">Salary Paid On</th>
                                    <th className="text-right px-4 py-2 font-semibold text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salarySlips.map((slip) => (
                                    <tr
                                        key={slip.id}
                                        className="border-b border-sidebar-border/70 dark:border-sidebar-border last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{slip.month}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(slip.payment_date)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {slip.has_file ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button asChild size="sm">
                                                        <a
                                                            href={`/employee/salary-slips/${slip.id}/view`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </a>
                                                    </Button>
                                                    <Button asChild size="sm">
                                                        <a
                                                            href={`/employee/salary-slips/${slip.id}/download`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download
                                                        </a>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" disabled>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    No PDF Available
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SelfServiceLayout>
    );
}
