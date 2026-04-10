<?php

use Illuminate\Support\Facades\Route;

// Auth Controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\Auth\PinController;
use App\Http\Controllers\Auth\SessionController;

// API Controllers
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\SavedRecipientController;
use App\Http\Controllers\Api\OrderTemplateController;
use App\Http\Controllers\Api\RecurringOrderController;
use App\Http\Controllers\Api\RateAlertController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\ExchangeRateController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\SwapOrderController;
use App\Http\Controllers\Api\SwapMatchController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\DisputeController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\TrustedContactController;
use App\Http\Controllers\Api\UserReportController;
use App\Http\Controllers\Api\DirectoryController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\NoticeboardController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\NotificationController;

// Admin Controllers
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminMatchController;
use App\Http\Controllers\Admin\AdminDepositController;
use App\Http\Controllers\Admin\AdminDisputeController;
use App\Http\Controllers\Admin\AdminExchangeRateController;
use App\Http\Controllers\Admin\AdminCountryController;
use App\Http\Controllers\Admin\AdminLocationController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminNoticeboardController;
use App\Http\Controllers\Admin\AdminAnnouncementController;
use App\Http\Controllers\Admin\AdminHolidayController;
use App\Http\Controllers\Admin\AdminReconciliationController;
use App\Http\Controllers\Admin\AdminReferralController;
use App\Http\Controllers\Admin\AdminBoostController;
use App\Http\Controllers\Admin\AdminOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Version: v1
| All responses use envelope: { success, message, data, errors, meta }
|
*/

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PUBLIC ROUTES — No authentication required
    |--------------------------------------------------------------------------
    */

    // ── Authentication ──────────────────────────────────────────────────────
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register',           [AuthController::class, 'register'])
             ->middleware('throttle:register')
             ->name('register');

        Route::post('login',              [AuthController::class, 'login'])
             ->middleware('throttle:login')
             ->name('login');

        Route::post('forgot-password',    [AuthController::class, 'forgotPassword'])
             ->middleware('throttle:6,1')
             ->name('forgot-password');

        Route::post('reset-password',     [AuthController::class, 'resetPassword'])
             ->name('reset-password');

        Route::get('verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
             ->middleware(['signed', 'throttle:6,1'])
             ->name('verify-email');
    });

    // ── Countries & Exchange Rates ──────────────────────────────────────────
    Route::prefix('countries')->name('countries.')->group(function () {
        Route::get('/',                   [CountryController::class, 'index'])->name('index');
        Route::get('{id}/locations',      [LocationController::class, 'byCountry'])->name('locations');
    });

    Route::prefix('exchange-rates')->name('exchange-rates.')->group(function () {
        Route::get('/',                   [ExchangeRateController::class, 'index'])->name('index');
        Route::get('{from}/{to}',         [ExchangeRateController::class, 'show'])->name('show');
        Route::get('history/{from}/{to}', [ExchangeRateController::class, 'history'])->name('history');
    });

    Route::prefix('locations')->name('locations.')->group(function () {
        Route::get('availability',        [LocationController::class, 'availability'])->name('availability');
    });

    // ── Social Proof & Directory (public) ──────────────────────────────────
    Route::prefix('feed')->name('feed.')->group(function () {
        Route::get('/',                   [FeedController::class, 'index'])->name('index');
        Route::get('stats',               [FeedController::class, 'stats'])->name('stats');
    });

    Route::prefix('directory')->name('directory.')->group(function () {
        Route::get('/',                   [DirectoryController::class, 'index'])->name('index');
        Route::get('{ulid}',              [DirectoryController::class, 'show'])->name('show');
    });

    // ── Noticeboard (public read) ───────────────────────────────────────────
    Route::prefix('noticeboard')->name('noticeboard.')->group(function () {
        Route::get('/',                   [NoticeboardController::class, 'index'])->name('index');
        Route::get('{id}',                [NoticeboardController::class, 'show'])->name('show');
    });

    // ── Public Holidays (public read) ──────────────────────────────────────
    Route::get('public-holidays',         [AdminHolidayController::class, 'indexPublic'])->name('public-holidays');

    // ── Public User Profiles ────────────────────────────────────────────────
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('{ulid}',              [UserController::class, 'publicProfile'])->name('public-profile');
        Route::get('{ulid}/reviews',      [ReviewController::class, 'indexForUser'])->name('reviews');
        Route::get('{ulid}/badges',       [UserController::class, 'badges'])->name('badges');
    });

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED ROUTES — Requires Sanctum token
    |--------------------------------------------------------------------------
    */

    Route::middleware(['auth:sanctum', 'update.last.seen'])->group(function () {

        // ── Auth Actions ────────────────────────────────────────────────────
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::post('logout',                    [AuthController::class, 'logout'])->name('logout');
            Route::post('resend-verification',       [AuthController::class, 'resendVerification'])->name('resend-verification');
            Route::post('verify-phone',              [AuthController::class, 'verifyPhone'])->name('verify-phone');
            Route::post('verify-phone/confirm',      [AuthController::class, 'confirmPhone'])->name('confirm-phone');

            // Two-Factor Authentication
            Route::prefix('2fa')->name('2fa.')->group(function () {
                Route::post('setup',                 [TwoFactorController::class, 'setup'])->name('setup');
                Route::post('confirm',               [TwoFactorController::class, 'confirm'])->name('confirm');
                Route::post('disable',               [TwoFactorController::class, 'disable'])->name('disable');
                Route::post('verify',                [TwoFactorController::class, 'verify'])->name('verify');
            });

            // Transaction PIN
            Route::prefix('pin')->name('pin.')->group(function () {
                Route::post('setup',                 [PinController::class, 'setup'])->name('setup');
                Route::post('change',                [PinController::class, 'change'])->name('change');
                Route::post('verify',                [PinController::class, 'verify'])->name('verify');
            });

            // Session / Login Activity
            Route::prefix('sessions')->name('sessions.')->group(function () {
                Route::get('/',                      [SessionController::class, 'index'])->name('index');
                Route::delete('/',                   [SessionController::class, 'destroyAll'])->name('destroy-all');
            });
        });

        // ── User Profile ────────────────────────────────────────────────────
        Route::prefix('user')->name('user.')->group(function () {
            Route::get('/',                          [UserController::class, 'show'])->name('show');
            Route::put('profile',                    [UserController::class, 'updateProfile'])->name('update-profile');
            Route::put('password',                   [UserController::class, 'updatePassword'])->name('update-password');
            Route::get('stats',                      [UserController::class, 'stats'])->name('stats');
            Route::get('badges',                     [UserController::class, 'myBadges'])->name('badges');
            Route::get('referral',                   [UserController::class, 'referral'])->name('referral');
            Route::get('savings',                    [UserController::class, 'savings'])->name('savings');
            Route::get('trust-score',                [UserController::class, 'trustScore'])->name('trust-score');

            // Notifications
            Route::prefix('notifications')->name('notifications.')->group(function () {
                Route::get('/',                      [NotificationController::class, 'index'])->name('index');
                Route::post('read',                  [NotificationController::class, 'markRead'])->name('read');
            });

            // Notification Preferences
            Route::prefix('notification-preferences')->name('notification-preferences.')->group(function () {
                Route::get('/',                      [UserController::class, 'notificationPreferences'])->name('show');
                Route::put('/',                      [UserController::class, 'updateNotificationPreferences'])->name('update');
            });
        });

        // ── KYC ─────────────────────────────────────────────────────────────
        Route::prefix('kyc')->name('kyc.')->group(function () {
            Route::get('status',                     [KycController::class, 'status'])->name('status');
            Route::post('submit',                    [KycController::class, 'submit'])
                 ->middleware('throttle:uploads')
                 ->name('submit');
            Route::get('documents',                  [KycController::class, 'documents'])->name('documents');
        });

        // ── Bank Accounts ────────────────────────────────────────────────────
        Route::prefix('bank-accounts')->name('bank-accounts.')->group(function () {
            Route::get('/',                          [BankAccountController::class, 'index'])->name('index');
            Route::post('/',                         [BankAccountController::class, 'store'])->name('store');
            Route::put('{id}',                       [BankAccountController::class, 'update'])->name('update');
            Route::delete('{id}',                    [BankAccountController::class, 'destroy'])->name('destroy');
            Route::post('{id}/set-primary',          [BankAccountController::class, 'setPrimary'])->name('set-primary');
        });

        // ── Saved Recipients ─────────────────────────────────────────────────
        Route::prefix('recipients')->name('recipients.')->group(function () {
            Route::get('/',                          [SavedRecipientController::class, 'index'])->name('index');
            Route::post('/',                         [SavedRecipientController::class, 'store'])->name('store');
            Route::put('{id}',                       [SavedRecipientController::class, 'update'])->name('update');
            Route::delete('{id}',                    [SavedRecipientController::class, 'destroy'])->name('destroy');
            Route::post('{id}/favourite',            [SavedRecipientController::class, 'toggleFavourite'])->name('favourite');
        });

        // ── Order Templates ──────────────────────────────────────────────────
        Route::prefix('templates')->name('templates.')->group(function () {
            Route::get('/',                          [OrderTemplateController::class, 'index'])->name('index');
            Route::post('/',                         [OrderTemplateController::class, 'store'])->name('store');
            Route::put('{id}',                       [OrderTemplateController::class, 'update'])->name('update');
            Route::delete('{id}',                    [OrderTemplateController::class, 'destroy'])->name('destroy');
            Route::post('{id}/use',                  [OrderTemplateController::class, 'use'])->name('use');
        });

        // ── Recurring Orders ─────────────────────────────────────────────────
        Route::prefix('recurring')->name('recurring.')->group(function () {
            Route::get('/',                          [RecurringOrderController::class, 'index'])->name('index');
            Route::post('/',                         [RecurringOrderController::class, 'store'])->name('store');
            Route::put('{id}',                       [RecurringOrderController::class, 'update'])->name('update');
            Route::delete('{id}',                    [RecurringOrderController::class, 'destroy'])->name('destroy');
            Route::post('{id}/pause',                [RecurringOrderController::class, 'pause'])->name('pause');
            Route::post('{id}/resume',               [RecurringOrderController::class, 'resume'])->name('resume');
        });

        // ── Rate Alerts ──────────────────────────────────────────────────────
        Route::prefix('rate-alerts')->name('rate-alerts.')->group(function () {
            Route::get('/',                          [RateAlertController::class, 'index'])->name('index');
            Route::post('/',                         [RateAlertController::class, 'store'])->name('store');
            Route::delete('{id}',                    [RateAlertController::class, 'destroy'])->name('destroy');
        });

        // ── Trusted Contacts ─────────────────────────────────────────────────
        Route::prefix('contacts')->name('contacts.')->group(function () {
            Route::get('/',                          [TrustedContactController::class, 'index'])->name('index');
            Route::post('/',                         [TrustedContactController::class, 'store'])->name('store');
            Route::delete('{id}',                    [TrustedContactController::class, 'destroy'])->name('destroy');
        });

        // ── Swap Orders ──────────────────────────────────────────────────────
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/',                          [SwapOrderController::class, 'index'])->name('index');
            Route::post('/',                         [SwapOrderController::class, 'store'])->name('store');
            Route::get('browse',                     [SwapOrderController::class, 'browse'])->name('browse');
            Route::get('{ulid}',                     [SwapOrderController::class, 'show'])->name('show');
            Route::put('{ulid}/cancel',              [SwapOrderController::class, 'cancel'])->name('cancel');
            Route::put('{ulid}/extend',              [SwapOrderController::class, 'extend'])->name('extend');
            Route::post('{ulid}/boost',              [SwapOrderController::class, 'boost'])->name('boost');
            Route::post('{ulid}/repeat',             [SwapOrderController::class, 'repeat'])->name('repeat');
            Route::post('{ulid}/propose-match',      [SwapMatchController::class, 'proposeMatch'])->name('propose-match');
        });

        // ── Swap Matches ─────────────────────────────────────────────────────
        Route::prefix('matches')->name('matches.')->group(function () {
            Route::get('/',                          [SwapMatchController::class, 'index'])->name('index');
            Route::get('{ulid}',                     [SwapMatchController::class, 'show'])->name('show');
            Route::get('{ulid}/negotiations',        [SwapMatchController::class, 'negotiations'])->name('negotiations');
            Route::post('{ulid}/negotiate',          [SwapMatchController::class, 'negotiate'])->name('negotiate');
            Route::put('{ulid}/cancel',              [SwapMatchController::class, 'cancel'])->name('cancel');

            // Delivery method selection (after rate agreed)
            Route::post('{ulid}/delivery-method',         [SwapMatchController::class, 'selectDeliveryMethod'])->name('delivery-method');
            Route::post('{ulid}/delivery-method/confirm', [SwapMatchController::class, 'confirmDeliveryMethod'])->name('delivery-method.confirm');
            Route::get('{ulid}/delivery-method',          [SwapMatchController::class, 'getDeliveryMethod'])->name('delivery-method.show');

            // Deposits
            Route::get('{ulid}/deposit',             [DepositController::class, 'show'])->name('deposit.show');
            Route::post('{ulid}/deposit/upload',     [DepositController::class, 'upload'])
                 ->middleware('throttle:uploads')
                 ->name('deposit.upload');

            // Cash Delivery
            Route::get('{ulid}/delivery',            [DeliveryController::class, 'show'])->name('delivery.show');
            Route::post('{ulid}/delivery/upload',    [DeliveryController::class, 'upload'])
                 ->middleware('throttle:uploads')
                 ->name('delivery.upload');
            Route::post('{ulid}/delivery/confirm',   [DeliveryController::class, 'confirm'])->name('delivery.confirm');
            Route::post('{ulid}/delivery/denominations', [DeliveryController::class, 'denominations'])->name('delivery.denominations');

            // Chat Messages
            Route::get('{ulid}/messages',            [MessageController::class, 'index'])->name('messages.index');
            Route::post('{ulid}/messages',           [MessageController::class, 'store'])
                 ->middleware('throttle:uploads')
                 ->name('messages.store');
            Route::post('{ulid}/messages/read',      [MessageController::class, 'markRead'])->name('messages.read');
            Route::get('{ulid}/messages/unread-count', [MessageController::class, 'unreadCount'])->name('messages.unread-count');

            // Disputes
            Route::post('{ulid}/dispute',            [DisputeController::class, 'raise'])->name('dispute');

            // Reviews & Ratings
            Route::post('{ulid}/rate',               [ReviewController::class, 'store'])->name('rate');

            // Transaction Feedback
            Route::post('{ulid}/feedback',           [FeedbackController::class, 'store'])->name('feedback');
        });

        // ── Disputes ─────────────────────────────────────────────────────────
        Route::prefix('disputes')->name('disputes.')->group(function () {
            Route::get('/',                          [DisputeController::class, 'index'])->name('index');
            Route::get('{id}',                       [DisputeController::class, 'show'])->name('show');
            Route::post('{id}/messages',             [DisputeController::class, 'sendMessage'])->name('messages');
        });

        // ── User Reports ─────────────────────────────────────────────────────
        Route::post('users/{ulid}/report',           [UserReportController::class, 'store'])->name('users.report');

        // ── Directory (authenticated — initiate transaction) ─────────────────
        Route::post('directory/{ulid}/initiate',     [DirectoryController::class, 'initiate'])->name('directory.initiate');

        // ── Onboarding ────────────────────────────────────────────────────────
        Route::prefix('onboarding')->name('onboarding.')->group(function () {
            Route::get('status',                     [OnboardingController::class, 'status'])->name('status');
            Route::post('complete-step',             [OnboardingController::class, 'completeStep'])->name('complete-step');
            Route::post('complete',                  [OnboardingController::class, 'complete'])->name('complete');
        });

    }); // end auth:sanctum

}); // end v1


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES — Requires Sanctum token + admin role
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {

    // ── Admin Auth (public — no sanctum required) ───────────────────────────
    Route::post('auth/login',                        [AdminAuthController::class, 'login'])
         ->middleware('throttle:login')
         ->name('auth.login');

    // ── All other admin routes require auth + admin role ────────────────────
    Route::middleware(['auth:sanctum', 'admin', 'update.last.seen'])->group(function () {

        Route::post('auth/logout',                   [AdminAuthController::class, 'logout'])->name('auth.logout');

        // ── Dashboard ───────────────────────────────────────────────────────
        Route::get('dashboard',                      [AdminDashboardController::class, 'index'])->name('dashboard');

        // ── User Management ─────────────────────────────────────────────────
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/',                          [AdminUserController::class, 'index'])->name('index');
            Route::get('{id}',                       [AdminUserController::class, 'show'])->name('show');
            Route::put('{id}/kyc/approve',           [AdminUserController::class, 'approveKyc'])->name('kyc.approve');
            Route::put('{id}/kyc/reject',            [AdminUserController::class, 'rejectKyc'])->name('kyc.reject');
            Route::put('{id}/suspend',               [AdminUserController::class, 'suspend'])->name('suspend');
            Route::put('{id}/unsuspend',             [AdminUserController::class, 'unsuspend'])->name('unsuspend');
            Route::put('{id}/ban',                   [AdminUserController::class, 'ban'])->name('ban');
            Route::put('{id}/verify-business',       [AdminUserController::class, 'verifyBusiness'])->name('verify-business');
            Route::put('{id}/toggle-available',      [AdminUserController::class, 'toggleAvailable'])->name('toggle-available');
        });

        // ── Orders ──────────────────────────────────────────────────────────
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/',                          [AdminOrderController::class, 'index'])->name('index');
            Route::get('{ulid}',                     [AdminOrderController::class, 'show'])->name('show');
        });

        // ── Matches ─────────────────────────────────────────────────────────
        Route::prefix('matches')->name('matches.')->group(function () {
            Route::get('/',                          [AdminMatchController::class, 'index'])->name('index');
            Route::get('{ulid}',                     [AdminMatchController::class, 'show'])->name('show');
            Route::put('{ulid}/verify-deposit',      [AdminMatchController::class, 'verifyDeposit'])->name('verify-deposit');
            Route::put('{ulid}/release-funds',       [AdminMatchController::class, 'releaseFunds'])->name('release-funds');
            Route::put('{ulid}/refund',              [AdminMatchController::class, 'refund'])->name('refund');
            Route::put('{ulid}/force-cancel',        [AdminMatchController::class, 'forceCancel'])->name('force-cancel');
        });

        // ── Deposits ─────────────────────────────────────────────────────────
        Route::prefix('deposits')->name('deposits.')->group(function () {
            Route::get('/',                          [AdminDepositController::class, 'index'])->name('index');
            Route::get('{id}',                       [AdminDepositController::class, 'show'])->name('show');
        });

        // ── Disputes ─────────────────────────────────────────────────────────
        Route::prefix('disputes')->name('disputes.')->group(function () {
            Route::get('/',                          [AdminDisputeController::class, 'index'])->name('index');
            Route::get('{id}',                       [AdminDisputeController::class, 'show'])->name('show');
            Route::put('{id}/resolve',               [AdminDisputeController::class, 'resolve'])->name('resolve');
            Route::post('{id}/messages',             [AdminDisputeController::class, 'sendMessage'])->name('messages');
        });

        // ── Exchange Rates ────────────────────────────────────────────────────
        Route::prefix('exchange-rates')->name('exchange-rates.')->group(function () {
            Route::get('/',                          [AdminExchangeRateController::class, 'index'])->name('index');
            Route::post('/',                         [AdminExchangeRateController::class, 'store'])->name('store');
            Route::put('{id}/deactivate',            [AdminExchangeRateController::class, 'deactivate'])->name('deactivate');
            Route::put('{id}/schedule',              [AdminExchangeRateController::class, 'schedule'])->name('schedule');
        });

        // ── Countries ─────────────────────────────────────────────────────────
        Route::prefix('countries')->name('countries.')->group(function () {
            Route::get('/',                          [AdminCountryController::class, 'index'])->name('index');
            Route::post('/',                         [AdminCountryController::class, 'store'])->name('store');
            Route::put('{id}',                       [AdminCountryController::class, 'update'])->name('update');
            Route::put('{id}/toggle-active',         [AdminCountryController::class, 'toggleActive'])->name('toggle-active');
        });

        // ── Delivery Locations ────────────────────────────────────────────────
        Route::prefix('locations')->name('locations.')->group(function () {
            Route::get('/',                          [AdminLocationController::class, 'index'])->name('index');
            Route::post('/',                         [AdminLocationController::class, 'store'])->name('store');
            Route::put('{id}',                       [AdminLocationController::class, 'update'])->name('update');
            Route::put('{id}/toggle-active',         [AdminLocationController::class, 'toggleActive'])->name('toggle-active');
            Route::delete('{id}',                    [AdminLocationController::class, 'destroy'])->name('destroy');
        });

        // ── System Settings ────────────────────────────────────────────────────
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/',                          [AdminSettingsController::class, 'index'])->name('index');
            Route::put('/',                          [AdminSettingsController::class, 'bulkUpdate'])->name('update');
        });

        // ── Audit Logs ─────────────────────────────────────────────────────────
        Route::get('audit-logs',                     [AdminAuditLogController::class, 'index'])->name('audit-logs.index');

        // ── User Reports ───────────────────────────────────────────────────────
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/',                          [AdminReportController::class, 'index'])->name('index');
            Route::get('{id}',                       [AdminReportController::class, 'show'])->name('show');
            Route::put('{id}/resolve',               [AdminReportController::class, 'resolve'])->name('resolve');
        });

        // ── Noticeboard ────────────────────────────────────────────────────────
        Route::prefix('noticeboard')->name('noticeboard.')->group(function () {
            Route::get('/',                          [AdminNoticeboardController::class, 'index'])->name('index');
            Route::post('/',                         [AdminNoticeboardController::class, 'store'])->name('store');
            Route::put('{id}',                       [AdminNoticeboardController::class, 'update'])->name('update');
            Route::delete('{id}',                    [AdminNoticeboardController::class, 'destroy'])->name('destroy');
            Route::put('{id}/publish',               [AdminNoticeboardController::class, 'publish'])->name('publish');
            Route::put('{id}/pin',                   [AdminNoticeboardController::class, 'pin'])->name('pin');
        });

        // ── Platform Announcements ──────────────────────────────────────────────
        Route::prefix('announcements')->name('announcements.')->group(function () {
            Route::get('/',                          [AdminAnnouncementController::class, 'index'])->name('index');
            Route::post('/',                         [AdminAnnouncementController::class, 'store'])->name('store');
            Route::put('{id}',                       [AdminAnnouncementController::class, 'update'])->name('update');
            Route::delete('{id}',                    [AdminAnnouncementController::class, 'destroy'])->name('destroy');
        });

        // ── Public Holidays ────────────────────────────────────────────────────
        Route::prefix('holidays')->name('holidays.')->group(function () {
            Route::get('/',                          [AdminHolidayController::class, 'index'])->name('index');
            Route::post('/',                         [AdminHolidayController::class, 'store'])->name('store');
            Route::put('{id}',                       [AdminHolidayController::class, 'update'])->name('update');
            Route::delete('{id}',                    [AdminHolidayController::class, 'destroy'])->name('destroy');
        });

        // ── Bank Reconciliation ────────────────────────────────────────────────
        Route::post('reconciliation/upload',         [AdminReconciliationController::class, 'upload'])
             ->middleware('throttle:uploads')
             ->name('reconciliation.upload');

        // ── Referrals ──────────────────────────────────────────────────────────
        Route::get('referrals',                      [AdminReferralController::class, 'index'])->name('referrals.index');

        // ── Order Boosts ───────────────────────────────────────────────────────
        Route::get('boosts',                         [AdminBoostController::class, 'index'])->name('boosts.index');

    }); // end admin middleware

}); // end admin prefix
