<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coauthor extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'full_name',
        'email',
        'affiliation',
        'country',
        'author_order'
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }
}
