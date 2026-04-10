<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fee_discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('source', ['referral','promotion','admin','boost_refund']);
            $table->decimal('discount_percent', 5, 2);
            $table->unsignedTinyInteger('max_uses')->default(1);
            $table->unsignedTinyInteger('uses_remaining')->default(1);
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('applied_to_match_id')->nullable()->constrained('swap_matches')->nullOnDelete();
            $table->timestamps();
            $table->index(['user_id', 'uses_remaining']);
        });
    }
    public function down(): void { Schema::dropIfExists('fee_discounts'); }
};