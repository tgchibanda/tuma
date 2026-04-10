<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderTemplate extends Model
{
    use SoftDeletes;
    protected $fillable = ['user_id', 'name', 'order_type', 'amount_aud', 'saved_recipient_id', 'aud_bank_account_id', 'is_active', 'use_count', 'last_used_at'];
    protected $casts = ['amount_aud' => 'decimal:2', 'is_active' => 'boolean', 'last_used_at' => 'datetime'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function savedRecipient()
    {
        return $this->belongsTo(SavedRecipient::class);
    }
    public function audBankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'aud_bank_account_id');
    }
    public function recurringOrders()
    {
        return $this->hasMany(RecurringOrder::class);
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
}