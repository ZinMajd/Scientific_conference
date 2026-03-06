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
        'track',
        'presentation_type',
        'participation_mode',
        'revision_deadline',
        'invitation_sent_at',
        'access_link',
        'publication_selected',
        'decision_date',
        'final_decision',
        'decision_notes',
        'is_published',
        'doi',
        'page_numbers'
    ];

    // Lifecycle Statuses
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_INITIAL_SCREENING = 'initial_screening';
    const STATUS_INCOMPLETE = 'incomplete'; // For "Returned for modification" in Stage 2
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_REVISION_REQUESTED = 'revision_requested';
    const STATUS_REVISION_SUBMITTED = 'revision_submitted';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_SCHEDULED = 'scheduled';

    // Presentation Types
    const PRESENTATION_ORAL = 'oral';
    const PRESENTATION_POSTER = 'poster';
    const PRESENTATION_KEYNOTE = 'keynote';
    const PRESENTATION_NONE = 'none';

    // Participation Mode
    const MODE_PHYSICAL = 'physical';
    const MODE_ONLINE = 'online';
    const MODE_NONE = 'none';

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

    public function versions()
    {
        return $this->hasMany(PaperVersion::class);
    }

    public function initialScreening()
    {
        return $this->hasOne(InitialScreening::class);
    }

    // Helper methods for state transitions
    public function canSubmitRevision()
    {
        return $this->status === self::STATUS_REVISION_REQUESTED;
    }

    public function isAccepted()
    {
        return $this->status === self::STATUS_ACCEPTED || $this->status === self::STATUS_SCHEDULED;
    }
}
