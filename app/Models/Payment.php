<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'title',
        'amount',
        'payment_date',
        'status',
        'payment_method',
        'description',
    ];
}
