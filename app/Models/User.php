<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function conferences()
    {
        return $this->hasMany(Conference::class, 'chair_id');
    }

    public function papers()
    {
        return $this->hasMany(Paper::class, 'author_id');
    }

    public function paperAssignments()
    {
        return $this->hasMany(PaperAssignment::class, 'reviewer_id');
    }

    public function assignedPapers()
    {
        return $this->hasManyThrough(Paper::class, PaperAssignment::class, 'reviewer_id', 'id', 'id', 'paper_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendee::class);
    }

    public function notifications()
    {
        return $this->hasMany(NotificationLog::class)->latest();
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class)->latest();
    }

    public function reviewerExpertise()
    {
        return $this->hasMany(ReviewerExpertise::class, 'reviewer_id');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'user_type',
        'full_name',
        'affiliation',
        'phone',
        'address',
        'bio',
        'profile_image',
        'is_active',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
