<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionFeedback extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['swap_match_id', 'user_id', 'smoothness_score', 'responsiveness_score', 'suggestion'];
    protected $casts = ['created_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}