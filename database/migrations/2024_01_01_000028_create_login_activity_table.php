<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('login_activity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->string('device_type', 50)->nullable();
            $table->string('location_country', 100)->nullable();
            $table->string('location_city', 100)->nullable();
            $table->tinyInteger('is_new_device')->default(0);
            $table->timestamp('login_at');
            $table->index(['user_id', 'login_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('login_activity'); }
};
