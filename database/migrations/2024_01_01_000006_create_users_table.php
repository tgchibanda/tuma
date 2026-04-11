<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->char('ulid', 26)->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 191)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('phone', 30)->unique();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('country_id')->constrained();
            $table->string('profile_photo', 255)->nullable();
            $table->enum('gender', ['male','female','prefer_not_to_say'])->nullable();
            $table->text('bio')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            // Privacy
            $table->enum('profile_visibility', ['public','anonymous'])->default('public');
            $table->string('anonymous_name', 100)->nullable();
            $table->string('anonymous_location', 100)->nullable();
            $table->text('anonymous_bio')->nullable();
            // KYC
            $table->enum('kyc_status', ['pending','submitted','approved','rejected'])->default('pending');
            $table->string('kyc_reference', 100)->nullable();
            $table->timestamp('kyc_reviewed_at')->nullable();
            // Account
            $table->enum('account_status', ['active','suspended','banned'])->default('active');
            $table->text('suspension_reason')->nullable();
            $table->timestamp('account_suspended_until')->nullable();
            $table->string('role', 30)->default('user');
            // Stats
            $table->unsignedInteger('total_trades')->default(0);
            $table->unsignedInteger('successful_trades')->default(0);
            $table->decimal('rating', 3, 2)->nullable();
            $table->unsignedTinyInteger('trust_score')->default(0);
            $table->unsignedInteger('report_count')->default(0);
            // Business / directory
            $table->enum('account_type', ['personal','business'])->default('personal');
            $table->string('business_name', 150)->nullable();
            $table->text('business_description')->nullable();
            $table->tinyInteger('is_verified_business')->default(0);
            $table->tinyInteger('always_available')->default(0);
            $table->json('available_locations')->nullable();
            $table->decimal('min_amount_aud', 10, 2)->default(50.00);
            $table->decimal('max_amount_aud', 10, 2)->default(5000.00);
            // 2FA & PIN
            $table->tinyInteger('two_fa_enabled')->default(0);
            $table->string('two_fa_secret', 100)->nullable();
            $table->enum('two_fa_method', ['sms','authenticator'])->default('sms');
            $table->string('transaction_pin', 255)->nullable();
            $table->timestamp('pin_set_at')->nullable();
            // Referral
            $table->string('referral_code', 20)->unique();
            $table->unsignedBigInteger('referred_by')->nullable();
            $table->unsignedInteger('referral_count')->default(0);
            $table->decimal('referral_earnings_aud', 10, 2)->default(0.00);
            // Onboarding
            $table->tinyInteger('onboarding_completed')->default(0);
            $table->unsignedTinyInteger('onboarding_step')->default(0);
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['kyc_status', 'account_status']);
            $table->index(['always_available', 'account_type']);
            $table->index('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('referred_by')->references('id')->on('users')->nullOnDelete();
        });

        // Add deferred foreign keys to fee_discounts and order_templates
        Schema::table('fee_discounts', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        Schema::table('order_templates', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        Schema::table('recurring_orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('order_template_id')->references('id')->on('order_templates')->cascadeOnDelete();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};
