<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('name', 100);
            $table->enum('order_type', ['send_to_zim', 'receive_from_zim']);
            $table->decimal('amount_aud', 15, 2);
            $table->unsignedBigInteger('saved_recipient_id')->nullable();
            $table->unsignedBigInteger('aud_bank_account_id')->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->unsignedInteger('use_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'is_active']);
        });
    }
    public function down(): void { Schema::dropIfExists('order_templates'); }
};
