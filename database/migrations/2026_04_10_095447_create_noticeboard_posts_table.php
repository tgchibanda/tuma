<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('noticeboard_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('content');
            $table->enum('post_type', ['announcement','tip','rate_update','warning','maintenance']);
            $table->tinyInteger('is_pinned')->default(0);
            $table->tinyInteger('is_published')->default(1);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('posted_by')->constrained('users');
            $table->unsignedInteger('view_count')->default(0);
            $table->timestamps();
            $table->index(['is_published', 'is_pinned', 'published_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('noticeboard_posts'); }
};