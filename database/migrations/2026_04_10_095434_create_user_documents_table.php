<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('user_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('document_type', ['passport','national_id','drivers_licence','selfie','proof_of_address']);
            $table->string('file_path', 255);
            $table->string('original_filename', 255)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->enum('status', ['pending','approved','rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('user_documents'); }
};