import SelfServiceLayout from '@/layouts/self-service-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PlaneTakeoff, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service',
        href: '/employee/my-details',
    },
    {
        title: 'Apply for Leave',
        href: '#',
    },
];

interface CreateLeaveRequestProps {
    leaveBalance: number;
}

export default function CreateLeaveRequest({ leaveBalance }: CreateLeaveRequestProps) {
    const { data, setData, post, processing, errors } = useForm({
        start_date: '',
        end_date: '',
        leave_type: 'casual',
        is_sandwich_leave: true,
        reason: '',
    });

    const [leaveDays, setLeaveDays] = useState<{
        total_days: number;
        working_days: number;
        sandwich_days: number;
        holiday_count: number;
        has_sandwich_days: boolean;
    } | null>(null);

    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        if (data.start_date && data.end_date) {
            calculateDays();
        } else {
            setLeaveDays(null);
        }
    }, [data.start_date, data.end_date]);

    const calculateDays = async () => {
        setCalculating(true);
        try {
            const response = await axios.post('/leave-requests/calculate-days', {
                start_date: data.start_date,
                end_date: data.end_date,
                is_sandwich_leave: true,
            });
            setLeaveDays(response.data);
        } catch (error) {
            console.error('Error calculating leave days:', error);
            setLeaveDays(null);
        } finally {
            setCalculating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leave-requests');
    };

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="Apply for Leave" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <PlaneTakeoff className="h-6 w-6" />
                    <h1 className="text-2xl font-semibold">Apply for Leave</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border max-w-3xl">
                    <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription>
                            <div className="flex justify-between items-start">
                                <div>
                                    <strong className="text-blue-900 dark:text-blue-100">Leave Policy:</strong>
                                    <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                                        Sandwich Leave Policy is applied by default. All days except Sundays between your selected dates will be counted as leave days.
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Available Leave Balance</div>
                                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{leaveBalance} days</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">You earn 2 leaves/month</div>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    min={data.start_date || new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="leave_type">Leave Type</Label>
                            <Select
                                value={data.leave_type}
                                onValueChange={(value) => setData('leave_type', value)}
                            >
                                <SelectTrigger id="leave_type">
                                    <SelectValue placeholder="Select leave type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="casual">Casual Leave</SelectItem>
                                    <SelectItem value="sick">Sick Leave</SelectItem>
                                    <SelectItem value="earned">Earned Leave</SelectItem>
                                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                                    <SelectItem value="unpaid">Unpaid Leave (Salary will be deducted)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.leave_type && (
                                <p className="text-sm text-red-600 mt-1">{errors.leave_type}</p>
                            )}
                            {data.leave_type === 'unpaid' && (
                                <Alert className="mt-2 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                                        <strong>Note:</strong> Unpaid leave will result in salary deduction for the leave days.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {leaveDays && !calculating && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <p><strong>Total Leave Days:</strong> {leaveDays.total_days}</p>
                                        <div className="text-sm space-y-1">
                                            <p>• Working Days: {leaveDays.working_days}</p>
                                            {leaveDays.sandwich_days > 0 && (
                                                <p>• Sandwich Days (Saturdays): {leaveDays.sandwich_days}</p>
                                            )}
                                            {leaveDays.holiday_count > 0 && (
                                                <p className="text-green-600">• Public Holidays (excluded): {leaveDays.holiday_count}</p>
                                            )}
                                        </div>
                                        {leaveDays.holiday_count > 0 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Note: Public holidays falling within your leave period are automatically excluded and won't be counted as leave days.
                                            </p>
                                        )}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {calculating && (
                            <div className="text-sm text-muted-foreground">Calculating leave days...</div>
                        )}

                        <div>
                            <Label htmlFor="reason">Reason for Leave</Label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Please provide a reason for your leave request..."
                                rows={4}
                                required
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing || !leaveDays}>
                                {processing ? 'Submitting...' : 'Submit Leave Request'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </SelfServiceLayout>
    );
}
