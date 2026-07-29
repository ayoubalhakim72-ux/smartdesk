<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';

    public $timestamps = false;

    protected $fillable = [
        'priorityid',
        'statusid',
        'categoryid',
        'createdby',
        'assignedto',
        'creation_date',
        'update_date',
        'closed_date',
        'title',
        'description'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'createdby');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assignedto');
    }

    public function priority()
    {
        return $this->belongsTo(Priority::class, 'priorityid');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'statusid');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryid');
    }
}