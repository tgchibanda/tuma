<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained('swap_matches');
            $table->foreignId('raised_by')->constrained('users');
            $table->text('reason');
            $table->enum('status', ['open','under_review','resolved_sender','resolved_receiver','refunded','closed'])->default('open');
            $table->text('resolution_notes')->nullable();
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->foreign('resolved_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['status', 'created_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('disputes'); }
};
