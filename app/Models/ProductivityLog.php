<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'focus_minutes',
        'tasks_completed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
