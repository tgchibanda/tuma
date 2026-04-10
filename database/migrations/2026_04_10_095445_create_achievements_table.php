<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('badge_key', 50)->unique();
            $table->string('badge_name', 100);
            $table->text('badge_description');
            $table->string('badge_icon', 50);
            $table->enum('trigger_type', [
                'trade_count','rating_average','zero_disputes',
                'response_time','multi_city','referral_count',
                'account_age','manual'
            ]);
            $table->integer('trigger_value')->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('achievements'); }
};