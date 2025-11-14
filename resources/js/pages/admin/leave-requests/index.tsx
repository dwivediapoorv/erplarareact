import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';

interface LeaveRequest {
    id: number;
    employee_name: string;
    employee_id: number;
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

interface AdminLeaveRequestsIndexProps {
    leaveRequests: LeaveRequest[];
    currentStatus: string;
}

export default function AdminLeaveRequestsIndex({ leaveRequests, currentStatus }: AdminLeaveRequestsIndexProps) {
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        admin_remarks: '',
    });

    const handleStatusFilter = (status: string) => {
        router.get('/admin/leave-requests', { status }, { preserveState: true });
    };

    const openDialog = (leave: LeaveRequest, action: 'approve' | 'reject' | 'view') => {
        setSelectedLeave(leave);
        setActionType(action);
        setData('admin_remarks', leave.admin_remarks || '');
    };

    const closeDialog = () => {
        setSelectedLeave(null);
        setActionType(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLeave || !actionType || actionType === 'view') return;

        const url = actionType === 'approve'
            ? `/admin/leave-requests/${selectedLeave.id}/approve`
            : `/admin/leave-requests/${selectedLeave.id}/reject`;

        post(url, {
            onSuccess: () => closeDialog(),
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return badges[status as keyof typeof badges] || badges.pending;
    };

    const getLeaveTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            casual: 'Casual',
            sick: 'Sick',
            earned: 'Earned',
            maternity: 'Maternity',
            paternity: 'Paternity',
            unpaid: 'Unpaid',
        };
        return labels[type] || type;
    };

    return (
        <AppLayout>
            <Head title="Leave Requests Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Leave Requests Management</h1>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Label>Filter by Status:</Label>
                    <Select value={currentStatus} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Leave Requests Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Leave Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applied On</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaveRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        No leave requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leaveRequests.map((leave) => (
                                    <TableRow key={leave.id}>
                                        <TableCell className="font-medium">{leave.employee_name}</TableCell>
                                        <TableCell>{getLeaveTypeLabel(leave.leave_type)}</TableCell>
                                        <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{leave.total_days} days</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(leave.status)}`}>
                                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(leave.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDialog(leave, 'view')}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {leave.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDialog(leave, 'approve')}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDialog(leave, 'reject')}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dialog for View/Approve/Reject */}
            <Dialog open={!!selectedLeave} onOpenChange={closeDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'view' && 'Leave Request Details'}
                            {actionType === 'approve' && 'Approve Leave Request'}
                            {actionType === 'reject' && 'Reject Leave Request'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'view' && 'View leave request details'}
                            {actionType === 'approve' && 'Approve this leave request with optional remarks'}
                            {actionType === 'reject' && 'Reject this leave request with remarks'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLeave && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Employee</Label>
                                    <p className="font-medium">{selectedLeave.employee_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Leave Type</Label>
                                    <p className="font-medium">{getLeaveTypeLabel(selectedLeave.leave_type)}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Start Date</Label>
                                    <p className="font-medium">{new Date(selectedLeave.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">End Date</Label>
                                    <p className="font-medium">{new Date(selectedLeave.end_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Total Days</Label>
                                    <p className="font-medium">{selectedLeave.total_days} days</p>
                                </div>
                                {selectedLeave.sandwich_days > 0 && (
                                    <div>
                                        <Label className="text-muted-foreground">Sandwich Days (Saturdays)</Label>
                                        <p className="font-medium">{selectedLeave.sandwich_days} days</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Reason</Label>
                                <p className="mt-1 text-sm">{selectedLeave.reason}</p>
                            </div>

                            {actionType !== 'view' && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="admin_remarks">
                                            Admin Remarks {actionType === 'reject' && <span className="text-red-600">*</span>}
                                        </Label>
                                        <Textarea
                                            id="admin_remarks"
                                            value={data.admin_remarks}
                                            onChange={(e) => setData('admin_remarks', e.target.value)}
                                            placeholder="Add your remarks here..."
                                            rows={3}
                                            required={actionType === 'reject'}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={closeDialog}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            variant={actionType === 'approve' ? 'default' : 'destructive'}
                                        >
                                            {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            )}

                            {actionType === 'view' && selectedLeave.status !== 'pending' && (
                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Status</Label>
                                            <p className="font-medium capitalize">{selectedLeave.status}</p>
                                        </div>
                                        {selectedLeave.approved_by && (
                                            <div>
                                                <Label className="text-muted-foreground">Processed By</Label>
                                                <p className="font-medium">{selectedLeave.approved_by}</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedLeave.admin_remarks && (
                                        <div className="mt-4">
                                            <Label className="text-muted-foreground">Admin Remarks</Label>
                                            <p className="mt-1 text-sm">{selectedLeave.admin_remarks}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {actionType === 'view' && (
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
