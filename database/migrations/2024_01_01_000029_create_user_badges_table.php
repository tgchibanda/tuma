<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('badge_key', 50);
            $table->string('badge_name', 100);
            $table->text('badge_description')->nullable();
            $table->string('badge_icon', 50);
            $table->timestamp('earned_at');
            $table->tinyInteger('is_visible')->default(1);
            $table->unique(['user_id', 'badge_key']);
        });
    }
    public function down(): void { Schema::dropIfExists('user_badges'); }
};
