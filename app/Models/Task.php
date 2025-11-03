<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'assigned_to',
        'project_id',
        'status',
        'completed_at',
        'approved_by',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who created the task.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user to whom the task is assigned.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the user who approved the task.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the project associated with the task.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
