<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('platform_announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('message');
            $table->enum('announcement_type', ['info','warning','maintenance','feature','rate']);
            $table->tinyInteger('show_on_landing')->default(0);
            $table->tinyInteger('show_on_dashboard')->default(1);
            $table->timestamp('show_from');
            $table->timestamp('show_until')->nullable();
            $table->tinyInteger('is_dismissible')->default(1);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('platform_announcements'); }
};
