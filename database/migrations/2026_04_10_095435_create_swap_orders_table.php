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
            $table->foreignId('exchange_rate_id')->nullable()->constrained('exchange_rates')->nullOnDelete();
            $table->decimal('platform_fee_aud', 10, 2)->default(0.00);
            $table->decimal('platform_fee_percent', 5, 2)->default(0.00);
            // Zimbabwe delivery
            $table->string('zim_recipient_name', 150);
            $table->string('zim_recipient_phone', 30);
            $table->foreignId('zim_delivery_location_id')->constrained('delivery_locations');
            $table->text('zim_delivery_address')->nullable();
            $table->text('zim_delivery_notes')->nullable();
            // Australian bank
            $table->string('aud_recipient_name', 150);
            $table->foreignId('aud_bank_account_id')->nullable()->constrained('bank_accounts')->nullOnDelete();
            // Status
            $table->enum('status', [
                'open','negotiating','agreed','in_escrow',
                'delivering','completed','cancelled','expired','disputed'
            ])->default('open');
            // Boost — stored as plain columns, FK added later
            $table->tinyInteger('is_boosted')->default(0);
            $table->timestamp('boost_expires_at')->nullable();
            // These FKs reference tables not yet created — stored as plain nullable columns
            // FKs are added in a later migration: add_foreign_keys_to_swap_orders
            $table->unsignedBigInteger('template_id')->nullable();
            $table->unsignedBigInteger('recurring_order_id')->nullable();
            $table->unsignedBigInteger('fee_discount_id')->nullable();
            $table->decimal('discounted_fee_aud', 10, 2)->nullable();
            // Meta
            $table->timestamp('expires_at');
            $table->text('cancelled_reason')->nullable();
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'status']);
            $table->index(['order_type', 'status']);
            $table->index(['zim_delivery_location_id', 'status']);
            $table->index(['is_boosted', 'boost_expires_at']);
            $table->index('expires_at');
        });
    }
    public function down(): void { Schema::dropIfExists('swap_orders'); }
};