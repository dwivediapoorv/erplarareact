<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of all employees (active and inactive).
     */
    public function index(Request $request): Response
    {
        $employees = Employee::with(['user:id,name,email,is_active', 'team:id,name', 'reportingManager:id,first_name,last_name'])
            ->select('id', 'user_id', 'first_name', 'last_name', 'phone', 'ein', 'designation', 'gender', 'team_id', 'date_of_joining', 'date_of_exit', 'salary', 'reporting_manager_id', 'aadhar_number', 'pan_number', 'uan_number', 'account_holder_name', 'account_number', 'ifsc_code')
            ->orderBy('first_name', 'asc')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'user_id' => $employee->user_id,
                    'name' => $employee->user?->name,
                    'email' => $employee->user?->email,
                    'is_active' => $employee->user?->is_active,
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'phone' => $employee->phone,
                    'ein' => $employee->ein,
                    'designation' => $employee->designation,
                    'gender' => $employee->gender,
                    'team_label' => $employee->team?->name ?? 'N/A',
                    'date_of_joining' => $employee->date_of_joining?->format('Y-m-d'),
                    'date_of_exit' => $employee->date_of_exit?->format('Y-m-d'),
                    'salary' => $employee->salary,
                    'reporting_manager' => $employee->reportingManager
                        ? $employee->reportingManager->first_name . ' ' . $employee->reportingManager->last_name
                        : null,
                    'aadhar_number' => $employee->aadhar_number,
                    'pan_number' => $employee->pan_number,
                    'uan_number' => $employee->uan_number,
                    'account_holder_name' => $employee->account_holder_name,
                    'account_number' => $employee->account_number,
                    'ifsc_code' => $employee->ifsc_code,
                ];
            });

        // Get user's column visibility preferences
        $columnPreferences = UserPreference::where('user_id', $request->user()->id)
            ->where('page', 'employees.index')
            ->where('preference_key', 'column_visibility')
            ->first();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'columnPreferences' => $columnPreferences?->preference_value ?? null,
        ]);
    }

    /**
     * Display the authenticated user's employee details
     */
    public function myDetails(Request $request)
    {
        $user = $request->user();

        // Get employee details with relationships
        $employee = Employee::with([
            'team',
            'reportingManager.user',
        ])->where('user_id', $user->id)->firstOrFail();

        return Inertia::render('employees/my-details', [
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'phone' => $employee->phone,
                'ein' => $employee->ein,
                'designation' => $employee->designation,
                'gender' => $employee->gender,
                'date_of_joining' => $employee->date_of_joining?->format('Y-m-d'),
                'date_of_exit' => $employee->date_of_exit?->format('Y-m-d'),
                'salary' => $employee->salary,
                'aadhar_number' => $employee->aadhar_number,
                'pan_number' => $employee->pan_number,
                'uan_number' => $employee->uan_number,
                'account_holder_name' => $employee->account_holder_name,
                'account_number' => $employee->account_number,
                'ifsc_code' => $employee->ifsc_code,
                'team' => $employee->team ? [
                    'id' => $employee->team->id,
                    'name' => $employee->team->name,
                ] : null,
                'reporting_manager' => $employee->reportingManager ? [
                    'id' => $employee->reportingManager->id,
                    'name' => $employee->reportingManager->user->name,
                ] : null,
            ],
        ]);
    }
}
