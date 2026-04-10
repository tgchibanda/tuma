<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('rate_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->char('from_currency', 3);
            $table->char('to_currency', 3);
            $table->decimal('target_rate', 18, 8);
            $table->enum('direction', ['above','below']);
            $table->tinyInteger('is_active')->default(1);
            $table->timestamp('triggered_at')->nullable();
            $table->tinyInteger('notify_once')->default(1);
            $table->timestamps();
            $table->index(['from_currency', 'to_currency', 'is_active']);
        });
    }
    public function down(): void { Schema::dropIfExists('rate_alerts'); }
};