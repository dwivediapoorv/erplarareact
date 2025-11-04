<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    protected $fillable = [
        'project_id',
        'client_name',
        'interaction_type',
        'interaction_date',
        'notes',
        'outcome',
    ];

    protected $casts = [
        'interaction_date' => 'date',
    ];

    /**
     * Get the project that this interaction belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
