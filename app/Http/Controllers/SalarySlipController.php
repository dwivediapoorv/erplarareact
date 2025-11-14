<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\SalarySlip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class SalarySlipController extends Controller
{
    /**
     * Display a listing of salary slips for the authenticated employee
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get employee with salary slips
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        $salarySlips = SalarySlip::where('employee_id', $employee->id)
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($slip) {
                return [
                    'id' => $slip->id,
                    'month' => $slip->month,
                    'payment_date' => $slip->payment_date->format('Y-m-d'),
                    'basic_salary' => $slip->basic_salary,
                    'hra' => $slip->hra,
                    'special_allowance' => $slip->special_allowance,
                    'conveyance_allowance' => $slip->conveyance_allowance,
                    'deductions' => $slip->deductions,
                    'gross_salary' => $slip->gross_salary,
                    'net_salary' => $slip->net_salary,
                    'has_file' => true, // Always true since we generate PDF on-the-fly
                    'notes' => $slip->notes,
                ];
            });

        return Inertia::render('salary-slips/index', [
            'salarySlips' => $salarySlips,
        ]);
    }

    /**
     * View a salary slip in the browser
     */
    public function view(Request $request, SalarySlip $salarySlip)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        // Ensure the salary slip belongs to the authenticated employee
        if ($salarySlip->employee_id !== $employee->id) {
            abort(403, 'Unauthorized access to salary slip');
        }

        // Load the employee relationship with user
        $salarySlip->load('employee.user');

        // Calculate salary cycle dates
        $paymentDate = Carbon::parse($salarySlip->payment_date);
        $cycleEnd = $paymentDate->copy()->subMonth()->day(25);
        $cycleStart = $cycleEnd->copy()->subMonth()->addDay();

        // Render the React component
        return Inertia::render('salary-slips/view', [
            'salarySlip' => [
                'id' => $salarySlip->id,
                'month' => $salarySlip->month,
                'payment_date' => $salarySlip->payment_date->format('Y-m-d'),
                'basic_salary' => $salarySlip->basic_salary,
                'hra' => $salarySlip->hra,
                'special_allowance' => $salarySlip->special_allowance,
                'conveyance_allowance' => $salarySlip->conveyance_allowance,
                'deductions' => $salarySlip->deductions,
                'gross_salary' => $salarySlip->gross_salary,
                'net_salary' => $salarySlip->net_salary,
                'notes' => $salarySlip->notes,
            ],
            'employee' => [
                'id' => $salarySlip->employee->id,
                'first_name' => $salarySlip->employee->first_name,
                'last_name' => $salarySlip->employee->last_name,
                'designation' => $salarySlip->employee->designation,
                'date_of_joining' => $salarySlip->employee->date_of_joining?->format('Y-m-d'),
                'pan_number' => $salarySlip->employee->pan_number,
                'uan_number' => $salarySlip->employee->uan_number,
                'account_holder_name' => $salarySlip->employee->account_holder_name,
                'account_number' => $salarySlip->employee->account_number,
                'user' => [
                    'gender' => $salarySlip->employee->user->gender,
                ],
            ],
            'cycleStart' => $cycleStart->format('d M, Y'),
            'cycleEnd' => $cycleEnd->format('d M, Y'),
        ]);
    }

    /**
     * Download a salary slip PDF (generated on-the-fly)
     */
    public function download(Request $request, SalarySlip $salarySlip)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->firstOrFail();

        // Ensure the salary slip belongs to the authenticated employee
        if ($salarySlip->employee_id !== $employee->id) {
            abort(403, 'Unauthorized access to salary slip');
        }

        // Load the employee relationship
        $salarySlip->load('employee');

        // Calculate salary cycle dates
        $paymentDate = Carbon::parse($salarySlip->payment_date);
        $cycleEnd = $paymentDate->copy()->subMonth()->day(25);
        $cycleStart = $cycleEnd->copy()->subMonth()->addDay();

        // Generate PDF with proper options
        $pdf = Pdf::loadView('pdf.salary-slip', [
            'salarySlip' => $salarySlip,
            'employee' => $salarySlip->employee,
            'cycleStart' => $cycleStart->format('d M, Y'),
            'cycleEnd' => $cycleEnd->format('d M, Y'),
        ])
        ->setPaper('a4', 'portrait')
        ->setOption('isHtml5ParserEnabled', true)
        ->setOption('isRemoteEnabled', false);

        // Download the PDF
        $filename = "salary_slip_" . str_replace(' ', '_', $salarySlip->month) . "_" . $salarySlip->employee->first_name . ".pdf";

        return $pdf->download($filename);
    }
}
