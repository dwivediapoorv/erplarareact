import SelfServiceLayout from '@/layouts/self-service-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plane, PlaneTakeoff, Trash2, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service',
        href: '/employee/my-details',
    },
    {
        title: 'Leave History',
        href: '#',
    },
];

interface LeaveRequest {
    id: number;
    start_date: string;
    end_date: string;
    leave_type: string;
    is_sandwich_leave: boolean;
    total_days: number;
    sandwich_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_remarks: string | null;
    approved_by: string | null;
    approved_at: string | null;
    created_at: string;
}

interface LeaveRequestsIndexProps {
    leaveRequests: LeaveRequest[];
}

export default function LeaveRequestsIndex({ leaveRequests }: LeaveRequestsIndexProps) {
    const handleCancel = (leave: LeaveRequest) => {
        if (confirm(`Are you sure you want to cancel your leave request from ${formatDate(leave.start_date)} to ${formatDate(leave.end_date)}?`)) {
            router.delete(`/leave-requests/${leave.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            default:
                return null;
        }
    };

    const getLeaveTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            casual: 'Casual Leave',
            sick: 'Sick Leave',
            earned: 'Earned Leave',
            maternity: 'Maternity Leave',
            paternity: 'Paternity Leave',
            unpaid: 'Unpaid Leave',
        };
        return labels[type] || type;
    };

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave History" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Plane className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Leave History</h1>
                    </div>
                    <Button asChild>
                        <Link href="/leave-requests/create">
                            <PlaneTakeoff className="h-4 w-4 mr-2" />
                            Apply for Leave
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {leaveRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <Plane className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Leave Requests</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't submitted any leave requests yet.
                            </p>
                            <Button asChild>
                                <Link href="/leave-requests/create">
                                    <PlaneTakeoff className="h-4 w-4 mr-2" />
                                    Apply for Leave
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/50">
                            {leaveRequests.map((leave) => (
                                <div key={leave.id} className="p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-semibold">
                                                            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {leave.total_days} {leave.total_days === 1 ? 'day' : 'days'}
                                                            {leave.is_sandwich_leave && leave.sandwich_days > 0 && (
                                                                <span className="ml-2">
                                                                    (includes {leave.sandwich_days} sandwich {leave.sandwich_days === 1 ? 'day' : 'days'})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {getStatusBadge(leave.status)}
                                            </div>

                                            {/* Leave Type and Details */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Type:</span>{' '}
                                                    <span className="font-medium">{getLeaveTypeLabel(leave.leave_type)}</span>
                                                </div>
                                                {leave.is_sandwich_leave && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Sandwich Leave
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Reason */}
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Reason:</span>{' '}
                                                <span>{leave.reason}</span>
                                            </div>

                                            {/* Admin Remarks */}
                                            {leave.admin_remarks && (
                                                <div className="text-sm bg-muted/50 p-3 rounded-md">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <span className="font-medium">Admin Remarks:</span>{' '}
                                                            <span>{leave.admin_remarks}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Approval Info */}
                                            {leave.approved_by && leave.approved_at && (
                                                <div className="text-xs text-muted-foreground">
                                                    {leave.status === 'approved' ? 'Approved' : 'Rejected'} by {leave.approved_by} on{' '}
                                                    {new Date(leave.approved_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            )}

                                            {/* Applied On */}
                                            <div className="text-xs text-muted-foreground">
                                                Applied on {formatDate(leave.created_at)}
                                            </div>
                                        </div>

                                        {/* Cancel Button (only for pending requests) */}
                                        {leave.status === 'pending' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCancel(leave)}
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
                </div>
            </div>
        </SelfServiceLayout>
    );
}
