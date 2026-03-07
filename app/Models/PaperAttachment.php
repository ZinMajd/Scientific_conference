<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'is_main_manuscript'
    ];

    protected $casts = [
        'is_main_manuscript' => 'boolean',
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }
}
