<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'team_id',
        'first_name',
        'last_name',
        'phone',
        'ein',
        'designation',
        'gender',
        'date_of_joining',
        'date_of_exit',
        'salary',
        'reporting_manager_id',
        'leave_balance',
        'aadhar_number',
        'pan_number',
        'uan_number',
        'account_holder_name',
        'account_number',
        'ifsc_code',
    ];

    protected $casts = [
        'date_of_joining' => 'date',
        'date_of_exit' => 'date',
        'salary' => 'decimal:2',
        'leave_balance' => 'decimal:2',
    ];

    /**
     * Get the user that owns the employee.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team that the employee belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the reporting manager for this employee.
     */
    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reporting_manager_id');
    }

    /**
     * Get the employees who report to this employee.
     */
    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'reporting_manager_id');
    }

    /**
     * Get the projects assigned to this employee.
     */
    public function assignedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'assigned_to');
    }

    /**
     * Get the leave requests for this employee.
     */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Calculate salary breakdown based on total salary
     *
     * Formula:
     * - Basic Salary: 50% of total salary
     * - HRA: 40% of basic salary
     * - Special Allowance: 30% of basic salary
     * - Conveyance Allowance: 30% of basic salary
     *
     * @return array
     */
    public function calculateSalaryBreakdown(): array
    {
        $totalSalary = (float) $this->salary;
        $basicSalary = $totalSalary * 0.50;
        $hra = $basicSalary * 0.40;
        $specialAllowance = $basicSalary * 0.30;
        $conveyanceAllowance = $basicSalary * 0.30;
        $totalAllowances = $hra + $specialAllowance + $conveyanceAllowance;

        return [
            'basic_salary' => round($basicSalary, 2),
            'hra' => round($hra, 2),
            'special_allowance' => round($specialAllowance, 2),
            'conveyance_allowance' => round($conveyanceAllowance, 2),
            'total_allowances' => round($totalAllowances, 2),
            'gross_salary' => round($basicSalary + $totalAllowances, 2),
        ];
    }

    /**
     * Calculate accumulated leave balance
     * Employees earn 2 leaves per month from their joining date
     *
     * @return float
     */
    public function calculateAccumulatedLeaveBalance(): float
    {
        if (!$this->date_of_joining) {
            return 0;
        }

        $joiningDate = $this->date_of_joining;
        $today = now();

        // Calculate months of service
        $monthsOfService = $joiningDate->diffInMonths($today);

        // 2 leaves per month
        $accumulated = $monthsOfService * 2;

        // Subtract used leaves (approved leaves that are not unpaid)
        $usedLeaves = $this->leaveRequests()
            ->where('status', 'approved')
            ->where('leave_type', '!=', 'unpaid')
            ->sum('total_days');

        return max(0, $accumulated - $usedLeaves);
    }

    /**
     * Get available leave balance
     *
     * @return float
     */
    public function getAvailableLeaveBalance(): float
    {
        return (float) $this->leave_balance;
    }

    /**
     * Update leave balance to current accumulated amount
     *
     * @return void
     */
    public function updateLeaveBalance(): void
    {
        $this->leave_balance = $this->calculateAccumulatedLeaveBalance();
        $this->save();
    }
}
