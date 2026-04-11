<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('cash_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained('swap_matches');
            $table->unsignedBigInteger('deliverer_user_id');
            $table->decimal('amount_usd', 15, 2);
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->foreignId('delivery_location_id')->constrained('delivery_locations');
            $table->text('delivery_address')->nullable();
            $table->string('recipient_id_photo', 255)->nullable();
            $table->enum('recipient_id_type', ['national_id','passport','drivers_licence'])->nullable();
            $table->string('handover_amount_photo', 255)->nullable();
            $table->string('combined_verification_photo', 255)->nullable();
            $table->text('verification_note')->nullable();
            $table->timestamp('proof_uploaded_at')->nullable();
            $table->json('usd_denominations')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamp('actual_delivery_at')->nullable();
            $table->unsignedInteger('delivery_duration_minutes')->nullable();
            $table->enum('status', ['pending','uploaded','confirmed','disputed'])->default('pending');
            $table->unsignedBigInteger('confirmed_by')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->foreign('deliverer_user_id')->references('id')->on('users');
            $table->foreign('confirmed_by')->references('id')->on('users')->nullOnDelete();
        });
    }
    public function down(): void { Schema::dropIfExists('cash_deliveries'); }
};
