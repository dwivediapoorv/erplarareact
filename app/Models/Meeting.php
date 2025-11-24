<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'lead_id',
        'scheduled_by',
        'assigned_to',
        'title',
        'description',
        'scheduled_at',
        'duration_minutes',
        'meeting_type',
        'meeting_link',
        'location',
        'status',
        'outcome',
        'meeting_notes',
        'action_items',
        'completed_at',
        'reschedule_count',
        'rescheduled_from',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function scheduledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scheduled_by');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function rescheduledFrom(): BelongsTo
    {
        return $this->belongsTo(Meeting::class, 'rescheduled_from');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'scheduled')
            ->where('scheduled_at', '>', now());
    }
}
