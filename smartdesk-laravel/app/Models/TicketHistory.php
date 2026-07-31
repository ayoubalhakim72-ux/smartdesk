<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketHistory extends Model
{
    protected $table = 'tickets_history';

    public $timestamps = false;

    protected $fillable = [
        'ticketid',
        'assignedby',
        'assignedto',
        'assigneddate',
        'reason'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticketid');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assignedby');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assignedto');
    }
}
