<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\Auth\PinController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\SwapOrderController;
use App\Http\Controllers\Api\SwapMatchController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\DisputeController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\ExchangeRateController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\RateAlertController;
use App\Http\Controllers\Api\SavedRecipientController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminMatchController;
use App\Http\Controllers\Admin\AdminDepositController;
use App\Http\Controllers\Admin\AdminDisputeController;
use App\Http\Controllers\Admin\AdminExchangeRateController;
use App\Http\Controllers\Admin\AdminCountryController;
use App\Http\Controllers\Admin\AdminLocationController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminNoticeboardController;
use App\Http\Controllers\Admin\AdminAnnouncementController;
use App\Http\Controllers\Admin\AdminHolidayController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminReferralController;
use App\Http\Controllers\Admin\AdminBoostController;
use App\Http\Controllers\Admin\AdminReconciliationController;

Route::prefix('v1')->group(function () {

    // ── Public ─────────────────────────────────────────────────────────────
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password',  [AuthController::class, 'resetPassword']);
    Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

    Route::get('/exchange-rates/{from}/{to}', [ExchangeRateController::class, 'current']);
    Route::get('/countries',                  [CountryController::class, 'index']);
    Route::get('/countries/{id}/locations',   [LocationController::class, 'byCountry']);
    Route::get('/feed',                        [\App\Http\Controllers\Api\PublicFeedController::class, 'index'])->name('feed.index');
    Route::get('/feed/stats',                  [\App\Http\Controllers\Api\PublicFeedController::class, 'stats'])->name('feed.stats');
    Route::get('/noticeboard',                 [\App\Http\Controllers\Api\NoticeboardController::class, 'index'])->name('noticeboard.index');
    Route::get('/public-holidays',             [AdminHolidayController::class, 'indexPublic'])->name('holidays.public');
    Route::get('/users/{ulid}',                [UserController::class, 'publicProfile'])->name('users.public');
    Route::get('/directory',                   [\App\Http\Controllers\Api\DirectoryController::class, 'index'])->name('directory.index');

    // ── Authenticated ──────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/auth/logout',        [AuthController::class, 'logout']);
        Route::post('/auth/verify-phone',  [AuthController::class, 'verifyPhone']);
        Route::post('/auth/confirm-phone', [AuthController::class, 'confirmPhone']);
        Route::post('/auth/2fa/setup',     [TwoFactorController::class, 'setup']);
        Route::post('/auth/2fa/confirm',   [TwoFactorController::class, 'confirm']);
        Route::post('/auth/2fa/disable',   [TwoFactorController::class, 'disable']);
        Route::post('/auth/2fa/verify',    [TwoFactorController::class, 'verify']);
        Route::post('/auth/pin/setup',     [PinController::class, 'setup']);
        Route::post('/auth/pin/change',    [PinController::class, 'change']);
        Route::post('/auth/pin/verify',    [PinController::class, 'verify']);
        Route::get('/sessions',            [SessionController::class, 'index']);
        Route::delete('/sessions',         [SessionController::class, 'destroyAll']);

        // User
        Route::get('/user',               [UserController::class, 'me']);
        Route::put('/user/profile',       [UserController::class, 'updateProfile']);
        Route::post('/user/profile/photo',[UserController::class, 'uploadPhoto']);
        Route::get('/user/stats',         [UserController::class, 'stats']);
        Route::put('/user/password',      [UserController::class, 'changePassword']);
        Route::get('/user/history',       [UserController::class, 'history']);
        Route::post('/user/onboarding/complete', [UserController::class, 'completeOnboarding']);
        Route::get('/user/notifications',            [UserController::class, 'notifications']);
        Route::post('/user/notifications/read-all',  [UserController::class, 'markAllRead']);
        Route::post('/user/notifications/{id}/read', [UserController::class, 'markRead']);
        Route::put('/user/notifications/preferences',[UserController::class, 'updateNotificationPreferences']);
        Route::get('/user/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'indexForMe']);

        // KYC
        Route::get('/kyc',                       [KycController::class, 'status']);
        Route::post('/kyc/upload',               [KycController::class, 'upload']);
        Route::delete('/kyc/documents/{id}',     [KycController::class, 'deleteDocument']);

        // Bank Accounts
        Route::get('/bank-accounts',                    [BankAccountController::class, 'index']);
        Route::post('/bank-accounts',                   [BankAccountController::class, 'store']);
        Route::put('/bank-accounts/{id}',               [BankAccountController::class, 'update']);
        Route::put('/bank-accounts/{id}/set-primary',   [BankAccountController::class, 'setPrimary']);
        Route::delete('/bank-accounts/{id}',            [BankAccountController::class, 'destroy']);

        // Rate Alerts
        Route::get('/rate-alerts',          [RateAlertController::class, 'index']);
        Route::post('/rate-alerts',         [RateAlertController::class, 'store']);
        Route::put('/rate-alerts/{id}',     [RateAlertController::class, 'update']);
        Route::delete('/rate-alerts/{id}',  [RateAlertController::class, 'destroy']);

        // Saved Recipients
        Route::get('/recipients',           [SavedRecipientController::class, 'index']);
        Route::post('/recipients',          [SavedRecipientController::class, 'store']);
        Route::put('/recipients/{id}',      [SavedRecipientController::class, 'update']);
        Route::delete('/recipients/{id}',   [SavedRecipientController::class, 'destroy']);

        // Secure file serving
        Route::get('/files/deposits/{id}/proof',          [FileController::class, 'depositProof'])->name('files.deposit.proof');
        Route::get('/files/deliveries/{id}/proof/{type}', [FileController::class, 'deliveryProof'])->name('files.delivery.proof');
        Route::get('/files/kyc/{id}',                     [FileController::class, 'kycDocument'])->name('files.kyc');

        // Orders
        Route::get('/orders',              [SwapOrderController::class, 'index']);
        Route::post('/orders',             [SwapOrderController::class, 'store']);
        Route::get('/orders/browse',       [SwapOrderController::class, 'browse']);
        Route::get('/orders/{ulid}',       [SwapOrderController::class, 'show']);
        Route::put('/orders/{ulid}/cancel',[SwapOrderController::class, 'cancel']);
        Route::put('/orders/{ulid}/extend',[SwapOrderController::class, 'extend']);
        Route::post('/orders/{ulid}/boost',[SwapOrderController::class, 'boost']);
        Route::post('/orders/{ulid}/repeat',[SwapOrderController::class, 'repeat']);
        Route::post('/orders/{ulid}/propose-match', [SwapMatchController::class, 'proposeMatch']);

        // Matches
        Route::get('/matches',               [SwapMatchController::class, 'index']);
        Route::get('/matches/{ulid}',        [SwapMatchController::class, 'show']);
        Route::put('/matches/{ulid}/cancel', [SwapMatchController::class, 'cancel']);
        Route::get('/matches/{ulid}/negotiations', [SwapMatchController::class, 'negotiations']);
        Route::post('/matches/{ulid}/negotiate',   [SwapMatchController::class, 'negotiate']);
        Route::post('/matches/{ulid}/delivery-method',          [SwapMatchController::class, 'selectDeliveryMethod']);
        Route::post('/matches/{ulid}/delivery-method/confirm',  [SwapMatchController::class, 'confirmDeliveryMethod']);
        Route::get('/matches/{ulid}/delivery-method',           [SwapMatchController::class, 'getDeliveryMethod']);

        // Deposit
        Route::get('/matches/{ulid}/deposit',          [DepositController::class, 'show']);
        Route::post('/matches/{ulid}/deposit/upload',  [DepositController::class, 'upload']);

        // Delivery
        Route::get('/matches/{ulid}/delivery',          [DeliveryController::class, 'show']);
        Route::post('/matches/{ulid}/delivery/upload',  [DeliveryController::class, 'upload']);
        Route::post('/matches/{ulid}/delivery/confirm', [DeliveryController::class, 'confirm']);
        Route::get('/matches/{ulid}/delivery/denominations', [DeliveryController::class, 'denominations']);

        // Messages
        Route::get('/matches/{ulid}/messages',       [MessageController::class, 'index']);
        Route::post('/matches/{ulid}/messages',      [MessageController::class, 'store']);
        Route::post('/matches/{ulid}/messages/read', [MessageController::class, 'markRead']);
        Route::get('/unread-count',                  [MessageController::class, 'unreadCount']);

        // Disputes
        Route::post('/matches/{ulid}/dispute', [DisputeController::class, 'raise']);
        Route::get('/disputes',                [DisputeController::class, 'index']);
        Route::get('/disputes/{id}',           [DisputeController::class, 'show']);
        Route::post('/disputes/{id}/messages', [DisputeController::class, 'sendMessage']);

        // Reviews & Feedback
        Route::post('/matches/{ulid}/rate',    [ReviewController::class, 'store']);
        Route::get('/users/{ulid}/reviews',    [ReviewController::class, 'indexForUser']);
        Route::post('/matches/{ulid}/feedback',[FeedbackController::class, 'store']);
    });

    // ── Admin ─────────────────────────────────────────────────────────────
    Route::prefix('admin')->group(function () {

        Route::post('/auth/login',  [AdminAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::post('/auth/logout', [AdminAuthController::class, 'logout']);
            Route::get('/dashboard',    [AdminDashboardController::class, 'index']);

            // Users
            Route::get('/users',                          [AdminUserController::class, 'index']);
            Route::get('/users/{id}',                     [AdminUserController::class, 'show']);
            Route::put('/users/{id}/kyc/approve',         [AdminUserController::class, 'approveKyc']);
            Route::put('/users/{id}/kyc/reject',          [AdminUserController::class, 'rejectKyc']);
            Route::put('/users/{id}/suspend',             [AdminUserController::class, 'suspend']);
            Route::put('/users/{id}/unsuspend',           [AdminUserController::class, 'unsuspend']);
            Route::put('/users/{id}/ban',                 [AdminUserController::class, 'ban']);
            Route::put('/users/{id}/verify-business',     [AdminUserController::class, 'verifyBusiness']);
            Route::put('/users/{id}/toggle-available',    [AdminUserController::class, 'toggleAvailable']);

            // Secure file serving for admin
            Route::get('/documents/{id}/file',                 [FileController::class, 'kycDocument'])->name('admin.document');
            Route::get('/deposits/{id}/proof',                 [FileController::class, 'depositProof'])->name('admin.deposit.proof');
            Route::get('/deliveries/{id}/proof/{type}',        [FileController::class, 'deliveryProof'])->name('admin.delivery.proof');

            // Orders
            Route::get('/orders',       [AdminOrderController::class, 'index']);
            Route::get('/orders/{ulid}',[AdminOrderController::class, 'show']);

            // Matches
            Route::get('/matches',                  [AdminMatchController::class, 'index']);
            Route::get('/matches/{ulid}',           [AdminMatchController::class, 'show']);
            Route::put('/matches/{ulid}/verify-deposit', [AdminMatchController::class, 'verifyDeposit']);
            Route::put('/matches/{ulid}/release-funds',  [AdminMatchController::class, 'releaseFunds']);
            Route::put('/matches/{ulid}/refund',         [AdminMatchController::class, 'refund']);
            Route::put('/matches/{ulid}/force-cancel',   [AdminMatchController::class, 'forceCancel']);

            // Deposits
            Route::get('/deposits',     [AdminDepositController::class, 'index']);
            Route::get('/deposits/{id}',[AdminDepositController::class, 'show']);

            // Disputes
            Route::get('/disputes',              [AdminDisputeController::class, 'index']);
            Route::get('/disputes/{id}',         [AdminDisputeController::class, 'show']);
            Route::put('/disputes/{id}/resolve', [AdminDisputeController::class, 'resolve']);
            Route::post('/disputes/{id}/messages',[AdminDisputeController::class, 'sendMessage']);

            // Exchange rates
            Route::get('/exchange-rates',               [AdminExchangeRateController::class, 'index']);
            Route::post('/exchange-rates',              [AdminExchangeRateController::class, 'store']);
            Route::put('/exchange-rates/{id}/deactivate',[AdminExchangeRateController::class, 'deactivate']);
            Route::put('/exchange-rates/{id}/schedule', [AdminExchangeRateController::class, 'schedule']);

            // Countries & Locations
            Route::get('/countries',                    [AdminCountryController::class, 'index']);
            Route::post('/countries',                   [AdminCountryController::class, 'store']);
            Route::put('/countries/{id}',               [AdminCountryController::class, 'update']);
            Route::put('/countries/{id}/toggle-active', [AdminCountryController::class, 'toggleActive']);

            Route::get('/locations',                      [AdminLocationController::class, 'index']);
            Route::post('/locations',                     [AdminLocationController::class, 'store']);
            Route::put('/locations/{id}',                 [AdminLocationController::class, 'update']);
            Route::put('/locations/{id}/toggle-active',   [AdminLocationController::class, 'toggleActive']);
            Route::delete('/locations/{id}',              [AdminLocationController::class, 'destroy']);

            // Settings
            Route::get('/settings',  [AdminSettingsController::class, 'index']);
            Route::put('/settings',  [AdminSettingsController::class, 'bulkUpdate']);

            // Noticeboard
            Route::get('/noticeboard',          [AdminNoticeboardController::class, 'index']);
            Route::post('/noticeboard',         [AdminNoticeboardController::class, 'store']);
            Route::put('/noticeboard/{id}',     [AdminNoticeboardController::class, 'update']);
            Route::delete('/noticeboard/{id}',  [AdminNoticeboardController::class, 'destroy']);
            Route::put('/noticeboard/{id}/publish', [AdminNoticeboardController::class, 'publish']);
            Route::put('/noticeboard/{id}/pin',     [AdminNoticeboardController::class, 'pin']);

            // Announcements
            Route::get('/announcements',        [AdminAnnouncementController::class, 'index']);
            Route::post('/announcements',       [AdminAnnouncementController::class, 'store']);
            Route::put('/announcements/{id}',   [AdminAnnouncementController::class, 'update']);
            Route::delete('/announcements/{id}',[AdminAnnouncementController::class, 'destroy']);

            // Holidays
            Route::get('/holidays',        [AdminHolidayController::class, 'index']);
            Route::post('/holidays',       [AdminHolidayController::class, 'store']);
            Route::put('/holidays/{id}',   [AdminHolidayController::class, 'update']);
            Route::delete('/holidays/{id}',[AdminHolidayController::class, 'destroy']);

            // Reports, referrals, boosts
            Route::get('/reports',              [AdminReportController::class, 'index']);
            Route::get('/reports/{id}',         [AdminReportController::class, 'show']);
            Route::put('/reports/{id}/resolve', [AdminReportController::class, 'resolve']);
            Route::get('/referrals',            [AdminReferralController::class, 'index']);
            Route::get('/boosts',               [AdminBoostController::class, 'index']);

            // Audit logs
            Route::get('/audit-logs', [AdminAuditLogController::class, 'index']);

            // Reconciliation
            Route::post('/reconciliation/upload', [AdminReconciliationController::class, 'upload']);
        });
    });
});
