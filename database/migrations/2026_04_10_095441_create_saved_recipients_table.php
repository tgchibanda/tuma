<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('saved_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nickname', 100);
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->foreignId('delivery_location_id')->constrained('delivery_locations');
            $table->text('delivery_address')->nullable();
            $table->text('delivery_notes')->nullable();
            $table->tinyInteger('is_favourite')->default(0);
            $table->unsignedInteger('use_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'is_favourite']);
        });
    }
    public function down(): void { Schema::dropIfExists('saved_recipients'); }
};