<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transaction_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('smoothness_score');
            $table->unsignedTinyInteger('responsiveness_score');
            $table->text('suggestion')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['swap_match_id', 'user_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('transaction_feedback'); }
};