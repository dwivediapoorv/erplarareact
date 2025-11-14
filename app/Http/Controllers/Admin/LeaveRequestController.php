<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display all leave requests for admin review
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');

        $leaveRequests = LeaveRequest::with(['employee.user', 'approvedBy'])
            ->when($status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'employee_name' => $leave->employee->user->name,
                    'employee_id' => $leave->employee->id,
                    'start_date' => $leave->start_date->format('Y-m-d'),
                    'end_date' => $leave->end_date->format('Y-m-d'),
                    'leave_type' => $leave->leave_type,
                    'is_sandwich_leave' => $leave->is_sandwich_leave,
                    'total_days' => $leave->total_days,
                    'sandwich_days' => $leave->sandwich_days,
                    'reason' => $leave->reason,
                    'status' => $leave->status,
                    'admin_remarks' => $leave->admin_remarks,
                    'approved_by' => $leave->approvedBy ? $leave->approvedBy->name : null,
                    'approved_at' => $leave->approved_at?->format('Y-m-d H:i'),
                    'created_at' => $leave->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/leave-requests/index', [
            'leaveRequests' => $leaveRequests,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Approve a leave request
     */
    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        if ($leaveRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending leave requests can be approved.');
        }

        $validated = $request->validate([
            'admin_remarks' => 'nullable|string|max:500',
        ]);

        $leaveRequest->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'admin_remarks' => $validated['admin_remarks'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Leave request approved successfully.');
    }

    /**
     * Reject a leave request
     */
    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        if ($leaveRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending leave requests can be rejected.');
        }

        $validated = $request->validate([
            'admin_remarks' => 'required|string|max:500',
        ]);

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'admin_remarks' => $validated['admin_remarks'],
        ]);

        return redirect()->back()->with('success', 'Leave request rejected.');
    }
}
