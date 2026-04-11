<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('user_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')->constrained('users');
            $table->foreignId('reviewed_user_id')->constrained('users');
            $table->foreignId('swap_match_id')->constrained('swap_matches');
            $table->unsignedTinyInteger('score');
            $table->text('review_text')->nullable();
            $table->tinyInteger('is_visible')->default(1);
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['swap_match_id', 'reviewer_id']);
            $table->index(['reviewed_user_id', 'is_visible']);
        });
    }
    public function down(): void { Schema::dropIfExists('user_reviews'); }
};
