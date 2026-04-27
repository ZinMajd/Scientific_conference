<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
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

    public function reviews()
    {
        return $this->hasMany(PaperReview::class, 'reviewer_id');
    }

    public function assignedPapers()
    {
        return $this->hasManyThrough(Paper::class, PaperAssignment::class, 'reviewer_id', 'id', 'id', 'paper_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendee::class);
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
     * Get all unique permissions for the user (direct + via roles).
     */
    public function getAllPermissionsAttribute()
    {
        if (!$this->relationLoaded('roles') && !$this->id) return collect();
        
        $directPermissions = $this->permissions ? $this->permissions->pluck('slug') : collect();
        $rolePermissions = $this->roles ? $this->roles->flatMap(function ($role) {
            return $role->permissions ? $role->permissions->pluck('slug') : collect();
        }) : collect();

        return $directPermissions->merge($rolePermissions)->unique()->values();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission($slug)
    {
        return $this->getAllPermissionsAttribute()->contains($slug);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole($slug): bool
    {
        return $this->roles->contains('slug', $slug);
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $slugs): bool
    {
        return $this->roles->whereIn('slug', $slugs)->isNotEmpty();
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
        'cv_path',
        'profile_image',
        'is_active',
        'last_login',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['all_permissions'];

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
