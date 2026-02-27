<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'parent_id'
    ];

    public function parent()
    {
        return $this->belongsTo(Topic::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Topic::class, 'parent_id');
    }

    public function papers()
    {
        return $this->belongsToMany(Paper::class, 'paper_topics');
    }

    public function reviewers()
    {
        return $this->hasManyThrough(User::class, ReviewerExpertise::class, 'topic_id', 'id', 'id', 'reviewer_id');
    }
}
