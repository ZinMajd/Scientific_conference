<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScientificSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'conf_id',
        'title',
        'description',
        'session_type',
        'chair_id',
        'room',
        'start_time',
        'end_time',
        'max_attendees'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function conference()
    {
        return $this->belongsTo(Conference::class, 'conf_id');
    }

    public function chair()
    {
        return $this->belongsTo(User::class, 'chair_id');
    }

    public function papers()
    {
        return $this->belongsToMany(Paper::class, 'session_papers', 'session_id', 'paper_id')
            ->withPivot(['presentation_order', 'presentation_time', 'duration_minutes']);
    }
}
