<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'reviewer_id',
        'assignment_id',
        'originality_score',
        'methodology_score',
        'results_score',
        'clarity_score',
        'total_avg_score',
        'comments_to_author',
        'comments_to_editor',
        'recommendation'
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
