<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'conf_id',
        'full_name',
        'email',
        'affiliation',
        'registration_type',
        'payment_status',
        'payment_amount',
        'payment_date',
        'receipt_number',
        'has_certificate',
        'certificate_sent_date'
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'certificate_sent_date' => 'datetime',
        'has_certificate' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conference()
    {
        return $this->belongsTo(Conference::class, 'conf_id');
    }
}
