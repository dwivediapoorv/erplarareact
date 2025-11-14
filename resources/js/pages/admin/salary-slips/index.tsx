import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, FileText, Trash2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
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
    net_salary: string;
    employee: Employee;
}

interface MonthGroup {
    month: string;
    payment_date: string;
    count: number;
    slips: SalarySlip[];
}

interface DefaultValues {
    processing_date: string;
    month: string;
    cycle_start: string;
    cycle_end: string;
}

interface AdminSalarySlipsIndexProps {
    groupedSalarySlips: MonthGroup[];
    defaultValues: DefaultValues;
}

export default function AdminSalarySlipsIndex({ groupedSalarySlips, defaultValues }: AdminSalarySlipsIndexProps) {
    const { auth } = usePage().props as any;
    const canGenerate = auth.permissions?.includes('generate salary-slips');
    const canDelete = auth.permissions?.includes('delete salary-slips');

    const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        month: defaultValues.month,
        payment_date: defaultValues.processing_date,
        deduction_percentage: '0',
        cycle_start: defaultValues.cycle_start,
        cycle_end: defaultValues.cycle_end,
    });

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmGenerate = () => {
        setShowConfirmDialog(false);
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
    };

    const handleDelete = (salarySlip: SalarySlip) => {
        if (confirm(`Delete salary slip for ${salarySlip.employee.first_name} ${salarySlip.employee.last_name} (${salarySlip.month})?`)) {
            router.delete(`/admin/salary-slips/${salarySlip.id}`);
        }
    };

    const toggleMonth = (month: string) => {
        setExpandedMonths(prev =>
            prev.includes(month)
                ? prev.filter(m => m !== month)
                : [...prev, month]
        );
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
                        <h2 className="text-lg font-semibold">Generated Salary Slips</h2>
                    </div>

                    {groupedSalarySlips.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Salary Slips Generated</h3>
                            <p className="text-sm text-muted-foreground">
                                Use the form above to generate salary slips for employees.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/50">
                            {groupedSalarySlips.map((monthGroup) => (
                                <div key={monthGroup.month}>
                                    {/* Month Header - Clickable */}
                                    <div
                                        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => toggleMonth(monthGroup.month)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {expandedMonths.includes(monthGroup.month) ? (
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                )}
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <h3 className="font-semibold text-lg">{monthGroup.month}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Payment Date: {formatDate(monthGroup.payment_date)} • {monthGroup.count} {monthGroup.count === 1 ? 'slip' : 'slips'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Slips */}
                                    {expandedMonths.includes(monthGroup.month) && (
                                        <div className="bg-muted/20 divide-y divide-sidebar-border/30">
                                            {monthGroup.slips.map((slip) => (
                                                <div key={slip.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium">
                                                                    {slip.employee.first_name} {slip.employee.last_name}
                                                                </h4>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="text-muted-foreground">Net Salary:</span>
                                                                <span className="ml-2 font-semibold text-blue-600">
                                                                    {formatCurrency(slip.net_salary)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {canDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(slip)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate Salary Slips</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to generate salary slips for <strong>{data.month}</strong>?
                                <br /><br />
                                This will create salary slips for all employees with a configured salary.
                                {data.deduction_percentage !== '0' && (
                                    <>
                                        <br /><br />
                                        <span className="text-amber-600 font-medium">
                                            A deduction of {data.deduction_percentage}% will be applied to all salary slips.
                                        </span>
                                    </>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConfirmDialog(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={confirmGenerate}
                                disabled={processing}
                            >
                                {processing ? 'Generating...' : 'Generate Salary Slips'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
