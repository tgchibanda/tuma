<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('match_negotiations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_match_id')->constrained('swap_matches')->cascadeOnDelete();
            $table->foreignId('proposed_by')->constrained('users');
            $table->decimal('proposed_aud', 15, 2);
            $table->decimal('proposed_usd', 15, 2);
            $table->text('message')->nullable();
            $table->enum('status', ['pending','accepted','countered','rejected'])->default('pending');
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['swap_match_id', 'created_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('match_negotiations'); }
};
