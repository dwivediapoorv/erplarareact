<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MOM extends Model
{
    protected $table = 'm_o_m_s';

    protected $fillable = [
        'title',
        'description',
        'meeting_date',
    ];
}
