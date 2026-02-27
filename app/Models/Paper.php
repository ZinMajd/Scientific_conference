<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paper extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'conf_id',
        'title',
        'abstract',
        'keywords',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'status',
        'track',
        'decision_date',
        'final_decision',
        'decision_notes',
        'is_published',
        'doi',
        'page_numbers'
    ];

    protected $casts = [
        'decision_date' => 'datetime',
        'is_published' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function conference()
    {
        return $this->belongsTo(Conference::class, 'conf_id');
    }

    public function coauthors()
    {
        return $this->hasMany(Coauthor::class);
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'paper_topics')->withPivot('is_primary');
    }

    public function assignments()
    {
        return $this->hasMany(PaperAssignment::class);
    }

    public function sessions()
    {
        return $this->belongsToMany(ScientificSession::class, 'session_papers', 'paper_id', 'session_id')
            ->withPivot(['presentation_order', 'presentation_time', 'duration_minutes']);
    }

    public function reviewers()
    {
        return $this->belongsToMany(User::class, 'paper_assignments', 'paper_id', 'reviewer_id')
            ->withPivot(['status', 'due_date', 'decline_reason'])
            ->withTimestamps();
    }

    public function paperAssignments()
    {
        return $this->hasMany(PaperAssignment::class);
    }
}
