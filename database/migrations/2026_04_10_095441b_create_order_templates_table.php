<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->enum('order_type', ['send_to_zim','receive_from_zim']);
            $table->decimal('amount_aud', 15, 2);
            $table->foreignId('saved_recipient_id')->nullable()->constrained('saved_recipients')->nullOnDelete();
            $table->foreignId('aud_bank_account_id')->nullable()->constrained('bank_accounts')->nullOnDelete();
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