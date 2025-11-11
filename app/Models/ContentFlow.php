<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentFlow extends Model
{
    protected $fillable = [
        'project_id',
        'created_by',
        'title',
        'primary_keyword',
        'secondary_keywords',
        'faqs',
        'approval_status',
        'published_on',
        'ai_score',
    ];

    protected $casts = [
        'published_on' => 'date',
        'ai_score' => 'decimal:2',
        'secondary_keywords' => 'array',
        'faqs' => 'array',
    ];

    /**
     * Get the project that the content flow belongs to.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user who created the content flow.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
