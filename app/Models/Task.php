<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'priority',
        'status',
        'order',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
