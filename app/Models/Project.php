<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'project_name',
        'onboarding_notes',
        'date_of_onboarding',
        'project_start_date',
        'client_name',
        'website',
        'email_address',
        'alternate_email_address',
        'phone_number',
        'alternate_phone_number',
        'assigned_to',
        'project_manager_id',
        'project_health',
        'project_status',
        'blogs_count',
        'monthly_report_date',
    ];

    protected $casts = [
        'date_of_onboarding' => 'date',
        'project_start_date' => 'date',
        'monthly_report_date' => 'date',
    ];

    /**
     * Get the employee assigned to this project (SEO team member)
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    /**
     * Get the project manager for this project
     */
    public function projectManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'project_manager_id');
    }

    /**
     * Get the services offered for this project
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Services::class, 'project_service', 'project_id', 'service_id');
    }

    /**
     * Get the tasks for this project
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the minutes of meetings (MOMs) for this project
     */
    public function moms(): HasMany
    {
        return $this->hasMany(MOM::class);
    }

    /**
     * Get the client interactions for this project
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }
}
