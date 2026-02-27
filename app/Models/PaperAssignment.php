<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'reviewer_id',
        'assigned_by',
        'due_date',
        'status',
        'decline_reason'
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function review()
    {
        return $this->hasOne(Review::class, 'assignment_id');
    }
}
