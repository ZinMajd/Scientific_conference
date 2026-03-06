<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InitialScreening extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'screener_id',
        'plagiarism_score',
        'format_check_passed',
        'completeness_check_passed',
        'result',
        'comments'
    ];

    protected $casts = [
        'format_check_passed' => 'boolean',
        'completeness_check_passed' => 'boolean',
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function screener()
    {
        return $this->belongsTo(User::class, 'screener_id');
    }
}
