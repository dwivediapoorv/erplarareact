<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the employee record associated with the user.
     */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * Get tasks assigned to the user.
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * Get leads owned by the user.
     */
    public function ownedLeads()
    {
        return $this->hasMany(Lead::class, 'current_owner_id');
    }

    /**
     * Get leads uploaded by the user.
     */
    public function uploadedLeads()
    {
        return $this->hasMany(Lead::class, 'uploaded_by');
    }

    /**
     * Get call logs made by the user.
     */
    public function callLogs()
    {
        return $this->hasMany(CallLog::class, 'called_by');
    }

    /**
     * Get meetings scheduled by the user.
     */
    public function scheduledMeetings()
    {
        return $this->hasMany(Meeting::class, 'scheduled_by');
    }

    /**
     * Get meetings assigned to the user.
     */
    public function assignedMeetings()
    {
        return $this->hasMany(Meeting::class, 'assigned_to');
    }
}
