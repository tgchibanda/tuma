<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained();
            $table->string('account_name', 150);
            $table->string('bank_name', 150);
            $table->string('account_number', 50);
            $table->string('bsb_code', 20)->nullable();
            $table->tinyInteger('is_primary')->default(0);
            $table->tinyInteger('is_verified')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'is_primary']);
        });
    }
    public function down(): void { Schema::dropIfExists('bank_accounts'); }
};
