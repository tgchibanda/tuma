<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('user_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            // Master channel toggles
            $table->tinyInteger('email_notifications')->default(1);
            $table->tinyInteger('inapp_notifications')->default(1);
            $table->tinyInteger('sms_notifications')->default(1);
            $table->tinyInteger('whatsapp_notifications')->default(0);
            $table->tinyInteger('push_notifications')->default(1);
            // Granular event toggles
            $table->tinyInteger('notify_rate_alerts')->default(1);
            $table->tinyInteger('notify_match_proposals')->default(1);
            $table->tinyInteger('notify_chat_messages')->default(1);
            $table->tinyInteger('notify_transaction_updates')->default(1);
            $table->tinyInteger('notify_marketing')->default(0);
            // WhatsApp contact
            $table->string('whatsapp_number', 30)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('user_notification_preferences'); }
};