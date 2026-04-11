<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('delivery_time_estimates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_location_id')->constrained('delivery_locations');
            $table->unsignedInteger('avg_delivery_minutes')->nullable();
            $table->unsignedInteger('sample_count')->default(0);
            $table->timestamp('last_calculated_at')->nullable();
            $table->unique(['user_id', 'delivery_location_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('delivery_time_estimates'); }
};
