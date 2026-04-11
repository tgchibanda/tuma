<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('public_holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained();
            $table->string('name', 150);
            $table->date('holiday_date');
            $table->text('description')->nullable();
            $table->tinyInteger('affects_deliveries')->default(1);
            $table->timestamps();
            $table->index(['country_id', 'holiday_date']);
        });
    }
    public function down(): void { Schema::dropIfExists('public_holidays'); }
};
