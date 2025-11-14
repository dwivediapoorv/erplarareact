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
        'date_of_joining',
        'date_of_exit',
        'salary',
        'reporting_manager_id',
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
}
