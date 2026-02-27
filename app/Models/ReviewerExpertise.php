<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewerExpertise extends Model
{
    use HasFactory;

    protected $table = 'reviewer_expertise';
    public $timestamps = false; // It's a pivot-like table with extra data, or just a table without timestamps in migration? Migration didn't specify timestamps.
    // Migration: $table->primary(['reviewer_id', 'topic_id']);

    protected $fillable = [
        'reviewer_id',
        'topic_id',
        'proficiency_level'
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
