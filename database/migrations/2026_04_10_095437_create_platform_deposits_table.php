<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('platform_deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('depositor_user_id')->constrained('users');
            $table->decimal('amount_aud', 15, 2);
            $table->string('our_bank_reference', 100)->nullable();
            $table->string('depositor_reference', 100)->nullable();
            $table->string('proof_file', 255)->nullable();
            $table->timestamp('proof_uploaded_at')->nullable();
            $table->enum('status', ['pending','verified','released','refunded'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            $table->index(['status', 'proof_uploaded_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('platform_deposits'); }
};