<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalarySlip extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'payment_date',
        'basic_salary',
        'hra',
        'special_allowance',
        'conveyance_allowance',
        'deductions',
        'gross_salary',
        'net_salary',
        'file_path',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'basic_salary' => 'decimal:2',
        'hra' => 'decimal:2',
        'special_allowance' => 'decimal:2',
        'conveyance_allowance' => 'decimal:2',
        'deductions' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    /**
     * Get the employee that owns the salary slip
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
