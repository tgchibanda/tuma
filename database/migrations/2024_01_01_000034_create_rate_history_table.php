<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('rate_history', function (Blueprint $table) {
            $table->id();
            $table->char('from_currency', 3);
            $table->char('to_currency', 3);
            $table->decimal('rate', 18, 8);
            $table->timestamp('recorded_at');
            $table->string('source', 50)->default('manual');
            $table->index(['from_currency', 'to_currency', 'recorded_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('rate_history'); }
};
