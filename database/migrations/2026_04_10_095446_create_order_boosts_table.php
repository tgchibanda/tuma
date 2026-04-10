<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_boosts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('boost_fee_aud', 8, 2)->default(2.00);
            $table->timestamp('boosted_at');
            $table->timestamp('expires_at');
            $table->tinyInteger('is_active')->default(1);
            $table->index(['swap_order_id', 'is_active']);
            $table->index(['expires_at', 'is_active']);
        });
    }
    public function down(): void { Schema::dropIfExists('order_boosts'); }
};