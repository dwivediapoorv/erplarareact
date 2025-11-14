<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
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
