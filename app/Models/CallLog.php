<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CallLog extends Model
{
    protected $fillable = [
        'lead_id',
        'called_by',
        'called_at',
        'call_status',
        'call_disposition',
        'duration_seconds',
        'call_notes',
        'pitch_response',
        'next_follow_up_at',
        'recording_url',
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'called_by');
    }

    public function scopeConnected($query)
    {
        return $query->where('call_status', 'connected');
    }

    public function scopeHotLeads($query)
    {
        return $query->where('call_disposition', 'hot_lead');
    }
}
