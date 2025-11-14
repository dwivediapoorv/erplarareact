<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\SalarySlip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SalarySlipController extends Controller
{
    /**
     * Display a listing of salary slips with generation interface
     */
    public function index(Request $request)
    {
        // Get current month info for default values
        $currentDate = Carbon::now();
        $defaultProcessingDate = $currentDate->copy()->day(7);

        // If today is past the 7th, suggest next month
        if ($currentDate->day > 7) {
            $defaultProcessingDate->addMonth();
        }

        // Calculate salary cycle dates (26th of previous month to 25th of current month)
        $cycleEndDate = $defaultProcessingDate->copy()->subMonth()->day(25);
        $cycleStartDate = $cycleEndDate->copy()->subMonth()->addDay();

        // Get all salary slips grouped by month
        $salarySlips = SalarySlip::with('employee.user')
            ->orderBy('payment_date', 'desc')
            ->get();

        // Group by month
        $groupedByMonth = $salarySlips->groupBy('month')->map(function ($slips, $month) {
            // Sort slips alphabetically by employee name
            $sortedSlips = $slips->sortBy(function ($slip) {
                return strtolower($slip->employee->first_name . ' ' . $slip->employee->last_name);
            });

            return [
                'month' => $month,
                'payment_date' => $slips->first()->payment_date->format('Y-m-d'),
                'count' => $slips->count(),
                'slips' => $sortedSlips->map(function ($slip) {
                    return [
                        'id' => $slip->id,
                        'employee' => [
                            'id' => $slip->employee->id,
                            'first_name' => $slip->employee->first_name,
                            'last_name' => $slip->employee->last_name,
                        ],
                        'month' => $slip->month,
                        'payment_date' => $slip->payment_date->format('Y-m-d'),
                        'net_salary' => $slip->net_salary,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('admin/salary-slips/index', [
            'groupedSalarySlips' => $groupedByMonth,
            'defaultValues' => [
                'processing_date' => $defaultProcessingDate->format('Y-m-d'),
                'month' => $defaultProcessingDate->copy()->subMonth()->format('F Y'),
                'cycle_start' => $cycleStartDate->format('Y-m-d'),
                'cycle_end' => $cycleEndDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Generate salary slips for all employees
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|string',
            'payment_date' => 'required|date',
            'deduction_percentage' => 'nullable|numeric|min:0|max:100',
            'cycle_start' => 'required|date',
            'cycle_end' => 'required|date',
        ]);

        // Get only active employees (no exit date or exit date is in the future)
        $employees = Employee::with('user')
            ->whereNotNull('salary')
            ->where(function ($query) use ($validated) {
                $query->whereNull('date_of_exit')
                    ->orWhere('date_of_exit', '>', $validated['cycle_end']);
            })
            ->get();

        $generatedCount = 0;
        $errors = [];

        $cycleStartDate = Carbon::parse($validated['cycle_start']);
        $cycleEndDate = Carbon::parse($validated['cycle_end']);

        foreach ($employees as $employee) {
            try {
                // Check if salary slip already exists for this month
                $exists = SalarySlip::where('employee_id', $employee->id)
                    ->where('month', $validated['month'])
                    ->exists();

                if ($exists) {
                    $errors[] = "Salary slip already exists for {$employee->first_name} {$employee->last_name} for {$validated['month']}";
                    continue;
                }

                // Calculate salary breakdown
                $breakdown = $employee->calculateSalaryBreakdown();

                // Get approved unpaid leave days for this salary cycle
                $unpaidLeaveDays = LeaveRequest::where('employee_id', $employee->id)
                    ->where('status', 'approved')
                    ->where('leave_type', 'unpaid')
                    ->where(function ($query) use ($cycleStartDate, $cycleEndDate) {
                        // Leave period overlaps with salary cycle
                        $query->whereBetween('start_date', [$cycleStartDate, $cycleEndDate])
                            ->orWhereBetween('end_date', [$cycleStartDate, $cycleEndDate])
                            ->orWhere(function ($q) use ($cycleStartDate, $cycleEndDate) {
                                $q->where('start_date', '<=', $cycleStartDate)
                                  ->where('end_date', '>=', $cycleEndDate);
                            });
                    })
                    ->get()
                    ->sum('total_days');

                // Calculate working days in the salary cycle (Mon-Sat, excluding Sundays)
                $totalWorkingDays = 0;
                $currentDate = $cycleStartDate->copy();

                while ($currentDate->lte($cycleEndDate)) {
                    if (!$currentDate->isSunday()) {
                        $totalWorkingDays++;
                    }
                    $currentDate->addDay();
                }

                // Calculate per-day salary
                $perDaySalary = $totalWorkingDays > 0 ? $breakdown['gross_salary'] / $totalWorkingDays : 0;

                // Calculate leave deduction
                $leaveDeduction = $unpaidLeaveDays * $perDaySalary;

                // Calculate other deductions (percentage-based)
                $deductionPercentage = $validated['deduction_percentage'] ?? 0;
                $percentageDeductions = ($breakdown['gross_salary'] * $deductionPercentage) / 100;

                // Total deductions
                $totalDeductions = $leaveDeduction + $percentageDeductions;

                // Net salary
                $netSalary = $breakdown['gross_salary'] - $totalDeductions;

                // Build notes
                $notes = [];
                if ($deductionPercentage > 0) {
                    $notes[] = "Other deductions: {$deductionPercentage}% of gross salary (₹" . number_format($percentageDeductions, 2) . ")";
                }
                if ($unpaidLeaveDays > 0) {
                    $notes[] = "Unpaid leave: {$unpaidLeaveDays} days deducted (₹" . number_format($leaveDeduction, 2) . ")";
                    $notes[] = "Per day salary: ₹" . number_format($perDaySalary, 2) . " (based on {$totalWorkingDays} working days)";
                }

                // Create salary slip
                SalarySlip::create([
                    'employee_id' => $employee->id,
                    'month' => $validated['month'],
                    'payment_date' => $validated['payment_date'],
                    'basic_salary' => $breakdown['basic_salary'],
                    'hra' => $breakdown['hra'],
                    'special_allowance' => $breakdown['special_allowance'],
                    'conveyance_allowance' => $breakdown['conveyance_allowance'],
                    'deductions' => $totalDeductions,
                    'gross_salary' => $breakdown['gross_salary'],
                    'net_salary' => $netSalary,
                    'notes' => !empty($notes) ? implode("\n", $notes) : null,
                ]);

                $generatedCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to generate slip for {$employee->first_name} {$employee->last_name}: {$e->getMessage()}";
            }
        }

        if ($generatedCount > 0) {
            return redirect()->back()->with('success', "Successfully generated {$generatedCount} salary slips for {$validated['month']}");
        } else {
            return redirect()->back()->with('error', 'No salary slips were generated. ' . implode(', ', $errors));
        }
    }

    /**
     * Delete a specific salary slip
     */
    public function destroy(SalarySlip $salarySlip)
    {
        $month = $salarySlip->month;
        $employeeName = $salarySlip->employee->first_name . ' ' . $salarySlip->employee->last_name;

        $salarySlip->delete();

        return redirect()->back()->with('success', "Deleted salary slip for {$employeeName} ({$month})");
    }
}
