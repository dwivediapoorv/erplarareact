<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'leave_type',
        'is_sandwich_leave',
        'total_days',
        'sandwich_days',
        'reason',
        'status',
        'admin_remarks',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_sandwich_leave' => 'boolean',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the leave request
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who approved the request
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Calculate total leave days including sandwich leaves
     */
    public static function calculateLeaveDays(Carbon $startDate, Carbon $endDate, bool $includeSandwich = false): array
    {
        $period = CarbonPeriod::create($startDate, $endDate);
        $workingDays = 0;
        $sandwichDays = 0;
        $totalDays = 0;
        $holidayCount = 0;

        $dates = [];
        foreach ($period as $date) {
            $dates[] = $date->copy();
        }

        if ($includeSandwich) {
            // For sandwich leave, count all days except Sundays and public holidays
            foreach ($dates as $date) {
                // Skip Sundays
                if ($date->isSunday()) {
                    continue;
                }

                // Skip public holidays
                if (Holiday::isHoliday($date->format('Y-m-d'))) {
                    $holidayCount++;
                    continue;
                }

                $totalDays++;

                // Check if it's a Saturday (sandwich day)
                if ($date->isSaturday()) {
                    $sandwichDays++;
                } else {
                    $workingDays++;
                }
            }
        } else {
            // For simple leave, count only working days (Mon-Fri) excluding holidays
            foreach ($dates as $date) {
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                // Skip public holidays
                if (Holiday::isHoliday($date->format('Y-m-d'))) {
                    $holidayCount++;
                    continue;
                }

                $workingDays++;
                $totalDays++;
            }
        }

        return [
            'total_days' => $totalDays,
            'working_days' => $workingDays,
            'sandwich_days' => $sandwichDays,
            'holiday_count' => $holidayCount,
        ];
    }

    /**
     * Check if the leave period has any weekends/holidays that would make it a sandwich leave
     */
    public static function hasSandwichDays(Carbon $startDate, Carbon $endDate): bool
    {
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            if ($date->isSaturday()) {
                return true;
            }
        }

        return false;
    }
}
