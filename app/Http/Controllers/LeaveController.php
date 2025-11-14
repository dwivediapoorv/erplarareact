<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveController extends Controller
{
    /**
     * Display a listing of leave requests for the authenticated employee
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        $leaveRequests = LeaveRequest::where('employee_id', $employee->id)
            ->with('approvedBy')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
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

        return Inertia::render('leave-requests/index', [
            'leaveRequests' => $leaveRequests,
        ]);
    }

    /**
     * Show the form for creating a new leave request
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        // Update and get current leave balance
        $employee->updateLeaveBalance();
        $employee->refresh();

        return Inertia::render('leave-requests/create', [
            'leaveBalance' => $employee->getAvailableLeaveBalance(),
        ]);
    }

    /**
     * Store a newly created leave request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'leave_type' => 'required|in:casual,sick,earned,maternity,paternity,unpaid',
            'is_sandwich_leave' => 'required|boolean',
            'reason' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        // Calculate leave days
        $leaveDays = LeaveRequest::calculateLeaveDays(
            $startDate,
            $endDate,
            $validated['is_sandwich_leave']
        );

        // Check leave balance (only for paid leave types)
        if ($validated['leave_type'] !== 'unpaid') {
            // Update employee's current leave balance
            $employee->updateLeaveBalance();
            $employee->refresh();

            $availableBalance = $employee->getAvailableLeaveBalance();

            if ($leaveDays['total_days'] > $availableBalance) {
                return redirect()->back()->with('error', "Insufficient leave balance. You have {$availableBalance} days available. Please apply for unpaid leave or reduce the number of days.");
            }
        }

        // Check for overlapping leave requests
        $overlapping = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                          ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();

        if ($overlapping) {
            return redirect()->back()->with('error', 'You already have a leave request for these dates.');
        }

        LeaveRequest::create([
            'employee_id' => $employee->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'leave_type' => $validated['leave_type'],
            'is_sandwich_leave' => $validated['is_sandwich_leave'],
            'total_days' => $leaveDays['total_days'],
            'sandwich_days' => $leaveDays['sandwich_days'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return redirect()->route('leave-requests.index')->with('success', 'Leave request submitted successfully.');
    }

    /**
     * Calculate leave days preview (AJAX endpoint)
     */
    public function calculateDays(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_sandwich_leave' => 'required|boolean',
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        $leaveDays = LeaveRequest::calculateLeaveDays(
            $startDate,
            $endDate,
            $validated['is_sandwich_leave']
        );

        $hasSandwichDays = LeaveRequest::hasSandwichDays($startDate, $endDate);

        return response()->json([
            'total_days' => $leaveDays['total_days'],
            'working_days' => $leaveDays['working_days'],
            'sandwich_days' => $leaveDays['sandwich_days'],
            'holiday_count' => $leaveDays['holiday_count'],
            'has_sandwich_days' => $hasSandwichDays,
        ]);
    }

    /**
     * Cancel a pending leave request
     */
    public function destroy(LeaveRequest $leaveRequest)
    {
        $user = request()->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        // Ensure the leave request belongs to the authenticated employee
        if ($leaveRequest->employee_id !== $employee->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only pending requests can be cancelled
        if ($leaveRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending leave requests can be cancelled.');
        }

        $leaveRequest->delete();

        return redirect()->back()->with('success', 'Leave request cancelled successfully.');
    }
}
