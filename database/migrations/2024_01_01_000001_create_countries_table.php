<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->char('iso_code', 2)->unique();
            $table->char('currency_code', 3);
            $table->string('currency_symbol', 5);
            $table->string('currency_name', 100);
            $table->string('flag_emoji', 10)->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('countries'); }
};
