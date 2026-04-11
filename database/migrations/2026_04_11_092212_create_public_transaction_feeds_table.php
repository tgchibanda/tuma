<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicTransactionFeedsTable extends Migration
{
    public function up()
    {
        Schema::create('public_transaction_feeds', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('swap_match_id')->nullable();

            $table->string('display_sender');
            $table->string('display_receiver');

            $table->decimal('amount_aud', 10, 2);
            $table->decimal('amount_usd', 10, 2);

            $table->string('delivery_location')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->boolean('is_demo')->default(false);
            $table->boolean('is_visible')->default(true);

            // Since you're using custom timestamps
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('public_transaction_feeds');
    }
}