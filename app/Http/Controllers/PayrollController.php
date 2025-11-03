<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    /**
     * Display a listing of payrolls.
     */
    public function index(): Response
    {
        $payrolls = Payroll::with('employee.user')
            ->select('id', 'employee_id', 'amount', 'payment_date', 'status', 'notes')
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($payroll) {
                return [
                    'id' => $payroll->id,
                    'employee_name' => $payroll->employee->user->name ?? 'N/A',
                    'amount' => $payroll->amount,
                    'payment_date' => $payroll->payment_date,
                    'status' => $payroll->status,
                    'notes' => $payroll->notes,
                ];
            });

        return Inertia::render('payroll/index', [
            'payrolls' => $payrolls,
        ]);
    }

    /**
     * Show the form for creating a new payroll.
     */
    public function create(): Response
    {
        $employees = Employee::with('user')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->user->name ?? 'N/A',
                ];
            });

        return Inertia::render('payroll/create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created payroll in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,paid,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        Payroll::create($validated);

        return to_route('payroll.index')->with('success', 'Payroll created successfully.');
    }
}
