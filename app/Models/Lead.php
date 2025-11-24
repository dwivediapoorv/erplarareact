<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'website',
        'company_name',
        'designation',
        'address',
        'city',
        'state',
        'country',
        'source',
        'status',
        'priority',
        'notes',
        'uploaded_by',
        'current_owner_id',
        'last_contacted_at',
        'next_follow_up_at',
        'lost_reason',
    ];

    protected $casts = [
        'last_contacted_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
    ];

    // Relationships
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function currentOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_owner_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(LeadAssignment::class);
    }

    public function activeAssignment()
    {
        return $this->hasOne(LeadAssignment::class)->where('is_active', true);
    }

    public function callLogs(): HasMany
    {
        return $this->hasMany(CallLog::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LeadNote::class);
    }

    // Scopes
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', 'assigned');
    }

    public function scopeHotLeads($query)
    {
        return $query->where('status', 'hot_lead');
    }

    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('current_owner_id', $userId);
    }
}
