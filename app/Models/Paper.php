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
        'blind_file_path',
        'file_name',
        'file_size',
        'file_type',
        'track',
        'status',
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
    // Lifecycle Statuses
    // Lifecycle Statuses - Professional State Machine
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_UNDER_SCREENING = 'under_screening'; 
    const STATUS_REVISION_REQUIRED = 'revision_required'; 
    const STATUS_RESUBMITTED = 'resubmitted'; 
    const STATUS_WITH_EDITOR = 'with_editor'; 
    const STATUS_PRELIMINARY_ACCEPTED = 'preliminary_accepted'; 
    const STATUS_ANONYMIZING = 'anonymizing'; 
    const STATUS_READY_FOR_REVIEW = 'ready_for_review'; 
    const STATUS_UNDER_REVIEW = 'under_review'; 
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_PUBLISHED = 'published';
    const STATUS_WITHDRAWN = 'withdrawn';

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

    public function statusHistory()
    {
        return $this->hasMany(PaperStatusHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Transition to a new status and record in history
     */
    public function transitionStatus($newStatus, $note = null, $userId = null)
    {
        $this->status = $newStatus;
        $this->save();

        return $this->statusHistory()->create([
            'status' => $newStatus,
            'changed_by' => $userId ?? auth()->id(),
            'note' => $note
        ]);
    }

    // Helper methods for state transitions
    public function canSubmitRevision()
    {
        return $this->status === self::STATUS_REVISION_REQUIRED;
    }

    public function isAccepted()
    {
        return $this->status === self::STATUS_ACCEPTED || $this->status === self::STATUS_SCHEDULED;
    }
}
