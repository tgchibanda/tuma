<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('swap_matches', function (Blueprint $table) {
            $table->id();
            $table->char('ulid', 26)->unique();
            $table->foreignId('send_order_id')->constrained('swap_orders');
            $table->foreignId('receive_order_id')->constrained('swap_orders');
            $table->decimal('agreed_aud', 15, 2)->nullable();
            $table->decimal('agreed_usd', 15, 2)->nullable();
            $table->unsignedBigInteger('exchange_rate_id')->nullable();
            $table->decimal('platform_fee_aud', 10, 2)->nullable();
            $table->decimal('proposed_aud', 15, 2)->nullable();
            $table->decimal('proposed_usd', 15, 2)->nullable();
            $table->unsignedBigInteger('proposed_by')->nullable();
            $table->timestamp('proposed_at')->nullable();
            $table->unsignedTinyInteger('negotiation_rounds')->default(0);
            $table->unsignedTinyInteger('max_negotiation_rounds')->default(5);
            $table->enum('delivery_method', ['pending','secure','risk'])->default('pending');
            $table->unsignedBigInteger('delivery_method_proposed_by')->nullable();
            $table->timestamp('delivery_method_proposed_at')->nullable();
            $table->unsignedBigInteger('delivery_method_confirmed_by')->nullable();
            $table->timestamp('delivery_method_confirmed_at')->nullable();
            $table->enum('risk_payout_method', ['platform_then_bank','direct_bank'])->nullable();
            $table->tinyInteger('delivery_method_agreed')->default(0);
            $table->timestamp('delivery_method_agreed_at')->nullable();
            $table->enum('status', [
                'proposed','negotiating','rate_agreed','delivery_method_selecting',
                'agreed','awaiting_deposit','deposit_uploaded','deposit_verified',
                'awaiting_delivery','awaiting_risk_delivery','risk_delivery_uploaded',
                'awaiting_risk_confirmation','risk_confirmed','awaiting_risk_deposit',
                'risk_deposit_uploaded','risk_deposit_verified','delivering',
                'delivery_uploaded','awaiting_confirmation','confirmed','releasing',
                'completed','disputed','cancelled','refunded'
            ])->default('proposed');
            $table->foreignId('initiated_by')->constrained('users');
            $table->timestamp('initiated_at')->nullable();
            $table->tinyInteger('agreed_by_send')->default(0);
            $table->tinyInteger('agreed_by_receive')->default(0);
            $table->timestamp('agreed_at')->nullable();
            $table->timestamp('deposit_uploaded_at')->nullable();
            $table->timestamp('deposit_verified_at')->nullable();
            $table->timestamp('delivery_uploaded_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->unsignedBigInteger('released_by')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            $table->foreign('exchange_rate_id')->references('id')->on('exchange_rates')->nullOnDelete();
            $table->foreign('proposed_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('delivery_method_proposed_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('delivery_method_confirmed_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('verified_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('released_by')->references('id')->on('users')->nullOnDelete();
            $table->index('status');
            $table->index(['send_order_id', 'status']);
            $table->index(['receive_order_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('swap_matches'); }
};
