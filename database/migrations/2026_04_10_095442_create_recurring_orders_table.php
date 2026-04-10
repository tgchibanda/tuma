<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('recurring_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_template_id')->constrained('order_templates')->cascadeOnDelete();
            $table->enum('frequency', ['weekly','fortnightly','monthly']);
            $table->timestamp('next_run_at');
            $table->timestamp('last_run_at')->nullable();
            $table->unsignedInteger('run_count')->default(0);
            $table->tinyInteger('is_active')->default(1);
            $table->timestamp('paused_at')->nullable();
            $table->text('pause_reason')->nullable();
            $table->timestamps();
            $table->index(['next_run_at', 'is_active']);
        });
    }
    public function down(): void { Schema::dropIfExists('recurring_orders'); }
};