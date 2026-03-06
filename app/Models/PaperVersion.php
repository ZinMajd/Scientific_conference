<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'version_number',
        'file_path',
        'response_letter_path',
        'author_comments',
        'type'
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }
}
