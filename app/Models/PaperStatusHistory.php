<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaperStatusHistory extends Model
{
    protected $table = 'paper_status_history';

    protected $fillable = [
        'paper_id',
        'status',
        'changed_by',
        'note'
    ];

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
