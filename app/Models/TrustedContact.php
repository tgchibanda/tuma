<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustedContact extends Model
{
    public $timestamps = false;
    protected $fillable = ['user_id', 'trusted_user_id', 'added_at', 'note'];
    protected $casts = ['added_at' => 'datetime'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function trustedUser()
    {
        return $this->belongsTo(User::class, 'trusted_user_id');
    }
}