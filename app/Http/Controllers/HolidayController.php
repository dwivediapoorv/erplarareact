<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Holiday;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    /**
     * Display the organization calendar with holidays
     */
    public function index(Request $request)
    {
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('m'));

        // Get all holidays for the year
        $holidays = Holiday::whereYear('date', $year)
            ->orderBy('date')
            ->get()
            ->map(function ($holiday) {
                return [
                    'id' => $holiday->id,
                    'name' => $holiday->name,
                    'date' => $holiday->date->format('Y-m-d'),
                    'type' => $holiday->type,
                    'description' => $holiday->description,
                    'is_recurring' => $holiday->is_recurring,
                ];
            });

        // Get user's leave requests for the year
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        $leaveRequests = [];
        if ($employee) {
            $leaveRequests = LeaveRequest::where('employee_id', $employee->id)
                ->whereYear('start_date', '<=', $year)
                ->whereYear('end_date', '>=', $year)
                ->where('status', '!=', 'rejected')
                ->orderBy('start_date')
                ->get()
                ->map(function ($leave) {
                    return [
                        'id' => $leave->id,
                        'start_date' => $leave->start_date->format('Y-m-d'),
                        'end_date' => $leave->end_date->format('Y-m-d'),
                        'leave_type' => $leave->leave_type,
                        'status' => $leave->status,
                        'total_days' => $leave->total_days,
                    ];
                });
        }

        return Inertia::render('calendar/index', [
            'holidays' => $holidays,
            'leaveRequests' => $leaveRequests,
            'currentYear' => (int) $year,
            'currentMonth' => (int) $month,
        ]);
    }

    /**
     * Show the form for creating a new holiday
     */
    public function create()
    {
        return Inertia::render('calendar/create');
    }

    /**
     * Store a newly created holiday
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:national,company,optional',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        Holiday::create($validated);

        return redirect()->route('calendar.index')
            ->with('success', 'Holiday added successfully.');
    }

    /**
     * Remove the specified holiday
     */
    public function destroy(Holiday $holiday)
    {
        $holiday->delete();

        return redirect()->route('calendar.index')
            ->with('success', 'Holiday deleted successfully.');
    }

    /**
     * Get holidays for a specific month (API endpoint)
     */
    public function getMonthHolidays(Request $request)
    {
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('m'));

        $holidays = Holiday::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->get();

        // Calculate all non-working days for the month
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $nonWorkingDays = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = sprintf('%04d-%02d-%02d', $year, $month, $day);

            if (Holiday::isSunday($date)) {
                $nonWorkingDays[] = [
                    'date' => $date,
                    'type' => 'sunday',
                    'name' => 'Sunday',
                ];
            } elseif (Holiday::isSecondOrFourthSaturday($date)) {
                $nonWorkingDays[] = [
                    'date' => $date,
                    'type' => 'saturday',
                    'name' => '2nd/4th Saturday',
                ];
            }
        }

        return response()->json([
            'holidays' => $holidays,
            'non_working_days' => $nonWorkingDays,
        ]);
    }
}
