<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaction extends Model
{
    protected $fillable = [
        'client_name',
        'interaction_type',
        'interaction_date',
        'notes',
        'outcome',
    ];
}
