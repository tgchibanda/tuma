<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankAccount extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id','country_id','account_name','bank_name','account_number','bsb_code','is_primary','is_verified'];
    protected $casts = ['is_primary' => 'boolean','is_verified' => 'boolean'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function country(): BelongsTo { return $this->belongsTo(Country::class); }
}
