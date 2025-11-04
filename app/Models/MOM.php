<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MOM extends Model
{
    protected $table = 'm_o_m_s';

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'meeting_date',
    ];

    protected $casts = [
        'meeting_date' => 'date',
    ];

    /**
     * Get the project that this MOM belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
