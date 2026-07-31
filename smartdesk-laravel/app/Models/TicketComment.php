<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketComment extends Model
{
    protected $table = 'ticket_comments';

    public $timestamps = false;

    protected $fillable = [
        'ticketid',
        'userid',
        'parentid',
        'comment',
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
        return $this->belongsTo(User::class, 'userid');
    }

    public function parent()
    {
        return $this->belongsTo(TicketComment::class, 'parentid');
    }

    public function replies()
    {
        return $this->hasMany(TicketComment::class, 'parentid')
            ->orderBy('date')
            ->orderBy('id');
    }
}
