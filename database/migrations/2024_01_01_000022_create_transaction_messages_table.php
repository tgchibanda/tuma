<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('transaction_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained('swap_matches')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users');
            $table->text('message');
            $table->string('attachment', 255)->nullable();
            $table->tinyInteger('is_read')->default(0);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['swap_match_id', 'created_at']);
            $table->index(['sender_id', 'is_read']);
        });
    }
    public function down(): void { Schema::dropIfExists('transaction_messages'); }
};
