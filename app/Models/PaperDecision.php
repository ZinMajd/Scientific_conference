<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperDecision extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'user_id',
        'decision_level',
        'decision',
        'notes'
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
