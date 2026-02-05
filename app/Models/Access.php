<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Access extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Get the projects that have this access.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_access')
            ->withTimestamps();
    }
}
