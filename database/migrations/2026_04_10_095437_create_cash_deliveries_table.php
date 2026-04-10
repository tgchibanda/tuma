<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cash_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('deliverer_user_id')->constrained('users');
            $table->decimal('amount_usd', 15, 2);
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->foreignId('delivery_location_id')->constrained('delivery_locations');
            $table->text('delivery_address')->nullable();
            // Verification photos
            $table->string('recipient_id_photo', 255)->nullable();
            $table->enum('recipient_id_type', ['national_id','passport','drivers_licence'])->nullable();
            $table->string('handover_amount_photo', 255)->nullable();
            $table->string('combined_verification_photo', 255)->nullable();
            $table->text('verification_note')->nullable();
            // Denominations
            $table->json('usd_denominations')->nullable();
            // Timing
            $table->timestamp('proof_uploaded_at')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamp('actual_delivery_at')->nullable();
            $table->unsignedInteger('delivery_duration_minutes')->nullable();
            // Status
            $table->enum('status', ['pending','uploaded','confirmed','disputed'])->default('pending');
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['swap_match_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('cash_deliveries'); }
};