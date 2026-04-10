<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('dispute_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dispute_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users');
            $table->text('message');
            $table->string('attachment', 255)->nullable();
            $table->tinyInteger('is_admin_message')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['dispute_id', 'created_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('dispute_messages'); }
};