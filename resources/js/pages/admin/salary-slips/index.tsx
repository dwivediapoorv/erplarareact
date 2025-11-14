import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, Download, FileText, IndianRupee, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/dashboard',
    },
    {
        title: 'Salary Slips Management',
        href: '#',
    },
];

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

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
    employee: Employee;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSalarySlips {
    data: SalarySlip[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface DefaultValues {
    processing_date: string;
    month: string;
    cycle_start: string;
    cycle_end: string;
}

interface AdminSalarySlipsIndexProps {
    salarySlips: PaginatedSalarySlips;
    defaultValues: DefaultValues;
}

export default function AdminSalarySlipsIndex({ salarySlips, defaultValues }: AdminSalarySlipsIndexProps) {
    const { auth } = usePage().props as any;
    const canGenerate = auth.permissions?.includes('generate salary-slips');
    const canDelete = auth.permissions?.includes('delete salary-slips');

    const { data, setData, post, processing, errors } = useForm({
        month: defaultValues.month,
        payment_date: defaultValues.processing_date,
        deduction_percentage: '0',
    });

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm(`Are you sure you want to generate salary slips for ${data.month}? This will create slips for all employees.`)) {
            post('/admin/salary-slips/generate', {
                onSuccess: () => {
                    // Reset form to next month's defaults
                    const nextMonth = new Date(data.payment_date);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setData({
                        month: nextMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                        payment_date: nextMonth.toISOString().split('T')[0],
                        deduction_percentage: '0',
                    });
                },
            });
        }
    };

    const handleDelete = (salarySlip: SalarySlip) => {
        if (confirm(`Delete salary slip for ${salarySlip.employee.first_name} ${salarySlip.employee.last_name} (${salarySlip.month})?`)) {
            router.delete(`/admin/salary-slips/${salarySlip.id}`);
        }
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(parseFloat(amount));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Salary Slips Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Salary Slips Management</h1>
                    </div>
                </div>

                {canGenerate && (
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold mb-4">Generate Salary Slips</h2>

                        <Alert className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Salary Cycle:</strong> {formatDate(defaultValues.cycle_start)} to {formatDate(defaultValues.cycle_end)}
                                <br />
                                <strong>Processing Date:</strong> Salary is typically processed on the 7th of each month for the previous month's cycle.
                            </AlertDescription>
                        </Alert>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="month">Salary Month</Label>
                                    <Input
                                        id="month"
                                        value={data.month}
                                        onChange={(e) => setData('month', e.target.value)}
                                        placeholder="e.g., November 2025"
                                        required
                                    />
                                    {errors.month && <p className="text-sm text-red-600 mt-1">{errors.month}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="payment_date">Payment Date</Label>
                                    <Input
                                        id="payment_date"
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        required
                                    />
                                    {errors.payment_date && <p className="text-sm text-red-600 mt-1">{errors.payment_date}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="deduction_percentage">Deduction % (Optional)</Label>
                                    <Input
                                        id="deduction_percentage"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.deduction_percentage}
                                        onChange={(e) => setData('deduction_percentage', e.target.value)}
                                        placeholder="0"
                                    />
                                    {errors.deduction_percentage && <p className="text-sm text-red-600 mt-1">{errors.deduction_percentage}</p>}
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Generating...' : 'Generate Salary Slips for All Employees'}
                            </Button>
                        </form>
                    </div>
                )}

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Generated Salary Slips ({salarySlips.total})</h2>
                    </div>

                    {salarySlips.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Salary Slips Generated</h3>
                            <p className="text-sm text-muted-foreground">
                                Use the form above to generate salary slips for employees.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/50">
                            {salarySlips.data.map((slip) => (
                                <div key={slip.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold">
                                                    {slip.employee.first_name} {slip.employee.last_name}
                                                </h3>
                                                <span className="text-sm text-muted-foreground">•</span>
                                                <span className="text-sm font-medium">{slip.month}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3 inline mr-1" />
                                                    Paid on {formatDate(slip.payment_date)}
                                                </span>
                                            </div>

                                            <div className="grid gap-2 md:grid-cols-5 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Basic:</span>
                                                    <span className="ml-1 font-medium">{formatCurrency(slip.basic_salary)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">HRA:</span>
                                                    <span className="ml-1 font-medium text-green-600">{formatCurrency(slip.hra)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Allowances:</span>
                                                    <span className="ml-1 font-medium text-green-600">
                                                        {formatCurrency((parseFloat(slip.special_allowance) + parseFloat(slip.conveyance_allowance)).toString())}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Deductions:</span>
                                                    <span className="ml-1 font-medium text-red-600">-{formatCurrency(slip.deductions)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Net Salary:</span>
                                                    <span className="ml-1 font-semibold text-blue-600">{formatCurrency(slip.net_salary)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {canDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(slip)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {salarySlips.last_page > 1 && (
                        <div className="p-4 border-t border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {salarySlips.data.length} of {salarySlips.total} salary slips
                                </p>
                                <div className="flex gap-2">
                                    {salarySlips.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
