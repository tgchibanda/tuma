<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users');
            $table->foreignId('referred_id')->constrained('users');
            $table->string('referral_code', 20);
            $table->enum('status', ['pending','qualified','rewarded'])->default('pending');
            $table->timestamp('qualified_at')->nullable();
            $table->timestamp('reward_applied_at')->nullable();
            $table->decimal('referrer_discount_percent', 5, 2)->default(50.00);
            $table->decimal('referred_discount_percent', 5, 2)->default(50.00);
            $table->timestamps();
            $table->index(['referrer_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('referrals'); }
};
