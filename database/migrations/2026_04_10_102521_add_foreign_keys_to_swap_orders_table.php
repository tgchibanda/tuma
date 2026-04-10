<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('swap_orders', function (Blueprint $table) {
            $table->foreign('template_id')
                  ->references('id')->on('order_templates')
                  ->nullOnDelete();
            $table->foreign('recurring_order_id')
                  ->references('id')->on('recurring_orders')
                  ->nullOnDelete();
            $table->foreign('fee_discount_id')
                  ->references('id')->on('fee_discounts')
                  ->nullOnDelete();
        });
    }
    public function down(): void {
        Schema::table('swap_orders', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropForeign(['recurring_order_id']);
            $table->dropForeign(['fee_discount_id']);
        });
    }
};