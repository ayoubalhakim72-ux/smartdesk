<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    public $timestamps = false;

    protected $fillable = [
        'ticketid',
        'user_id',
        'action',
        'date'
    ];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticketid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
