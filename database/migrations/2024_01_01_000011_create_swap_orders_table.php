<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('swap_orders', function (Blueprint $table) {
            $table->id();
            $table->char('ulid', 26)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('order_type', ['send_to_zim','receive_from_zim']);
            $table->decimal('amount_aud', 15, 2);
            $table->decimal('amount_usd', 15, 2);
            $table->unsignedBigInteger('exchange_rate_id')->nullable();
            $table->decimal('platform_fee_aud', 10, 2)->default(0.00);
            $table->decimal('platform_fee_percent', 5, 2)->default(0.00);
            $table->unsignedBigInteger('fee_discount_id')->nullable();
            $table->decimal('discounted_fee_aud', 10, 2)->nullable();
            $table->string('zim_recipient_name', 150);
            $table->string('zim_recipient_phone', 30);
            $table->foreignId('zim_delivery_location_id')->constrained('delivery_locations');
            $table->text('zim_delivery_address')->nullable();
            $table->text('zim_delivery_notes')->nullable();
            $table->string('aud_recipient_name', 150);
            $table->unsignedBigInteger('aud_bank_account_id')->nullable();
            $table->enum('status', ['open','negotiating','agreed','in_escrow','delivering','completed','cancelled','expired','disputed'])->default('open');
            $table->timestamp('expires_at');
            $table->text('cancelled_reason')->nullable();
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->tinyInteger('is_boosted')->default(0);
            $table->timestamp('boost_expires_at')->nullable();
            $table->unsignedBigInteger('template_id')->nullable();
            $table->unsignedBigInteger('recurring_order_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('exchange_rate_id')->references('id')->on('exchange_rates')->nullOnDelete();
            $table->foreign('fee_discount_id')->references('id')->on('fee_discounts')->nullOnDelete();
            $table->foreign('aud_bank_account_id')->references('id')->on('bank_accounts')->nullOnDelete();
            $table->foreign('cancelled_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('template_id')->references('id')->on('order_templates')->nullOnDelete();
            $table->foreign('recurring_order_id')->references('id')->on('recurring_orders')->nullOnDelete();
            $table->index(['user_id', 'status']);
            $table->index(['order_type', 'status', 'zim_delivery_location_id']);
            $table->index(['status', 'expires_at']);
            $table->index(['is_boosted', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('swap_orders'); }
};
