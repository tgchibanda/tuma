<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankAccount extends Model
{
    use SoftDeletes;

    protected $table = 'bank_accounts';

    protected $fillable = [
        'user_id', 'country_id', 'account_name',
        'bank_name', 'account_number', 'bsb_code',
        'is_primary', 'is_verified',
    ];

    protected $casts = [
        'is_primary'  => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function user()    { return $this->belongsTo(User::class); }
    public function country() { return $this->belongsTo(Country::class); }

    public function scopePrimary($query)   { return $query->where('is_primary', true); }
    public function scopeVerified($query)  { return $query->where('is_verified', true); }
}
