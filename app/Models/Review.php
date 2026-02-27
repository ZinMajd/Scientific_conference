<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'overall_score',
        'originality',
        'relevance',
        'methodology',
        'presentation',
        'technical_quality',
        'comments_author',
        'comments_chair',
        'decision',
        'confidence',
        'is_submitted',
        'submission_date'
    ];

    protected $casts = [
        'is_submitted' => 'boolean',
        'submission_date' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(PaperAssignment::class, 'assignment_id');
    }

    public function reviewer()
    {
        return $this->hasOneThrough(User::class, PaperAssignment::class, 'id', 'id', 'assignment_id', 'reviewer_id');
    }

    public function paper()
    {
        return $this->hasOneThrough(Paper::class, PaperAssignment::class, 'id', 'id', 'assignment_id', 'paper_id');
    }
}
