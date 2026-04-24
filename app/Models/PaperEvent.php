<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaperEvent extends Model
{
    protected $fillable = [
        'paper_id',
        'event_type',
        'from_status',
        'to_status',
        'user_id',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
