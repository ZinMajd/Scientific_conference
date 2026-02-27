<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conference extends Model
{
    use HasFactory;

    protected $fillable = [
        'chair_id',
        'title',
        'description',
        'short_name',
        'venue',
        'start_date',
        'end_date',
        'submission_deadline',
        'review_deadline',
        'notification_date',
        'camera_ready_deadline',
        'registration_deadline',
        'registration_fee',
        'max_papers',
        'status',
        'website_url',
        'contact_email'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'submission_deadline' => 'datetime',
        'review_deadline' => 'datetime',
        'notification_date' => 'datetime',
        'camera_ready_deadline' => 'datetime',
        'registration_deadline' => 'datetime',
    ];

    public function chair()
    {
        return $this->belongsTo(User::class, 'chair_id');
    }

    public function papers()
    {
        return $this->hasMany(Paper::class, 'conf_id');
    }

    public function scientificSessions()
    {
        return $this->hasMany(ScientificSession::class, 'conf_id');
    }

    public function attendees()
    {
        return $this->hasMany(Attendee::class, 'conf_id');
    }
}
