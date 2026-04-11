<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class RateHistory extends Model {
    public $timestamps = false;
    protected $fillable = ['from_currency','to_currency','rate','recorded_at','source'];
    protected $casts = ['rate' => 'decimal:8','recorded_at' => 'datetime'];
}
