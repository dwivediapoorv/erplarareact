<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $fillable = [
        'name',
        'date',
        'type',
        'description',
        'is_recurring',
    ];

    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
    ];

    /**
     * Check if a given date is a holiday
     */
    public static function isHoliday($date): bool
    {
        return self::whereDate('date', $date)->exists();
    }

    /**
     * Check if a given date is a Sunday
     */
    public static function isSunday($date): bool
    {
        return date('w', strtotime($date)) == 0;
    }

    /**
     * Check if a given date is 2nd or 4th Saturday
     */
    public static function isSecondOrFourthSaturday($date): bool
    {
        $dayOfWeek = date('w', strtotime($date));

        // Check if it's Saturday (6)
        if ($dayOfWeek != 6) {
            return false;
        }

        // Get the week number of the month
        $day = date('j', strtotime($date));
        $weekOfMonth = ceil($day / 7);

        return in_array($weekOfMonth, [2, 4]);
    }

    /**
     * Check if a given date is a working day
     */
    public static function isWorkingDay($date): bool
    {
        return !self::isHoliday($date)
            && !self::isSunday($date)
            && !self::isSecondOrFourthSaturday($date);
    }
}
