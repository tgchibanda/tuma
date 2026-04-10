<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('public_transaction_feed', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->nullable()->constrained()->nullOnDelete();
            $table->string('display_sender', 50);
            $table->string('display_receiver', 50);
            $table->decimal('amount_aud', 10, 2);
            $table->decimal('amount_usd', 10, 2);
            $table->string('delivery_location', 100);
            $table->timestamp('completed_at');
            $table->tinyInteger('is_demo')->default(0);
            $table->tinyInteger('is_visible')->default(1);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['is_visible', 'completed_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('public_transaction_feed'); }
};