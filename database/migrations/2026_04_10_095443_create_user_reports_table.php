<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users');
            $table->foreignId('reported_user_id')->constrained('users');
            $table->enum('reason', [
                'fraud','fake_delivery','harassment',
                'fake_profile','suspicious_behaviour','other'
            ]);
            $table->text('details')->nullable();
            $table->foreignId('swap_match_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['pending','reviewed','dismissed','actioned'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            $table->index(['reported_user_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('user_reports'); }
};