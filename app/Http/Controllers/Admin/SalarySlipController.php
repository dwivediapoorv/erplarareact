<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
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

        $query = SalarySlip::with('employee.user')
            ->orderBy('payment_date', 'desc');

        // Filter by month if provided
        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }

        $salarySlips = $query->paginate(20);

        return Inertia::render('admin/salary-slips/index', [
            'salarySlips' => $salarySlips,
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
        ]);

        $employees = Employee::with('user')->whereNotNull('salary')->get();
        $generatedCount = 0;
        $errors = [];

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

                // Calculate deductions (if any)
                $deductionPercentage = $validated['deduction_percentage'] ?? 0;
                $deductions = ($breakdown['gross_salary'] * $deductionPercentage) / 100;
                $netSalary = $breakdown['gross_salary'] - $deductions;

                // Create salary slip
                SalarySlip::create([
                    'employee_id' => $employee->id,
                    'month' => $validated['month'],
                    'payment_date' => $validated['payment_date'],
                    'basic_salary' => $breakdown['basic_salary'],
                    'hra' => $breakdown['hra'],
                    'special_allowance' => $breakdown['special_allowance'],
                    'conveyance_allowance' => $breakdown['conveyance_allowance'],
                    'deductions' => $deductions,
                    'gross_salary' => $breakdown['gross_salary'],
                    'net_salary' => $netSalary,
                    'notes' => $deductionPercentage > 0 ? "Deductions: {$deductionPercentage}% of gross salary" : null,
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
