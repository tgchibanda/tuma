# eZimConnect — Project Handover Document

> **Last updated:** April 2026 (fixes1–fixes14)
> **Purpose:** Complete handover for continuing development in a new session

---

## 1. Project Overview

**eZimConnect** (Swap · Send · Settle) is a peer-to-peer AUD↔USD cash exchange platform connecting Australians who need to send money to Zimbabwe with people in Zimbabwe who hold USD cash and need AUD. No banks, no wire transfers — community-to-community, secured by escrow.

| Detail | Value |
|--------|-------|
| Stack | Laravel 10, PHP 8.2, MySQL 8, Vue.js 2.7, Tailwind CSS 3, Vite 4 |
| Dev environment | Laragon (Windows), `http://127.0.0.1:8000` |
| API prefix | `/api/v1/` |
| Auth | Laravel Sanctum (token-based, stored in `localStorage` as `tuma_token`) |
| Queue | `QUEUE_CONNECTION=database` — run `php artisan queue:work` in a separate terminal |
| File storage | `storage/app/` (local disk) + `storage/app/public/` (public disk for avatars) |

---

## 2. Fix Batch History

| Batch | Key contents |
|-------|-------------|
| ezimconnect-fixes1 | Kernel ValidatePostSize namespace, KycService, login_activities migration |
| ezimconnect-fixes2 | jobs migration, KycController, ReviewController indexForMe, ExchangeRateController current() |
| ezimconnect-fixes3 | Browse route 404, LocationController grouped/flat, multi-city filter, Landing.js, router.js |
| ezimconnect-fixes4 | 13 missing controllers (SavedRecipient, TrustedContact, OrderTemplate, RecurringOrder, etc.) |
| ezimconnect-fixes5 | Browse.js propose URL (TARGET ulid), MatchingService 5-arg call |
| ezimconnect-fixes6 | SwapMatchController involvesUser/isUsersTurnToNegotiate stdClass fix |
| ezimconnect-fixes7 | MessageController + 5 controllers involvesUser fix, NegotiateRequest counter_aud mapping, 9 notifications duplicate via() removed |
| ezimconnect-fixes8 | UserController has_bank_account, BankAccounts.js, CreateOrder.js bank guard, Directory.js, 7 admin pages, router.js with AdminReports |
| ezimconnect-fixes9 | MessageController isChatOpen + involvesUser, DepositInstructionsNotification optional ref, DepositController correct EscrowService API, DeliveryController correct EscrowService API, SwapMatchController delivery_method_proposed_by, MatchDetail.js deposit v-if fix |
| ezimconnect-fixes10 | MessageController created_at now() + url() for chat attachment, routes/api.php named routes, FileController chatAttachment+userAvatar, User.php avatar Storage::url() |
| ezimconnect-fixes11 | Authenticate middleware (Route [login] not defined), User.php updateLastSeen(), MessageController refresh() fix, 4 missing notification classes (FundsSecured, DeliveryProofUploaded, RiskDeliveryGoFirst, RiskDeliveryPartnerGoingFirst) |
| ezimconnect-fixes12 | PublicProfile.js full implementation, Browse.js send-money-via, UserController reviewer object, SwapOrderController user_ulid filter |
| ezimconnect-fixes13 | AdminLocations/AuditLogs data mapping fix, 8 notification messages fixed, FundsReleasedNotification fee breakdown, ReviewController upsert+delete+comment fix, SupportController+models+migration, MatchDetail partner info+review edit/delete, Support.js, Dashboard first→next order, Browse/Directory avatars (window crash), SmartCalculator guide rate, AppFooter legal links, legal pages (4), DirectoryController anonymous filter |
| ezimconnect-fixes14 | Browse.js window.location crash fix, Directory.js same fix, AppNav help icon, AdminNav component created+registered, AdminSupportController, AdminSupport.js, Landing.js footer links fixed, HowItWorks page, SafetyAndEscrow page, router.js all new routes, api.php admin support routes |

---

## 3. Critical Architecture Rules

### Route ordering (MUST be maintained)
```php
// api.php — these MUST come before /{ulid} catch-all
Route::get('/orders/browse', ...);  // BEFORE /orders/{ulid}
Route::get('/orders/create', ...);  // In router.js, BEFORE /orders/:ulid
```

### Vue imports — ALL default, never named
```js
// ✅ CORRECT
import Dashboard from './pages/Dashboard'
// ❌ WRONG — throws "does not provide export named"
import { Dashboard } from './pages/Dashboard'
```

### EscrowService installed API (DO NOT call other method names)
```php
secureFlow_initiate($match)                                           // delivery method confirmed
secureFlow_uploadProof($match, $user, $file, $ref)                   // sender uploads AUD proof
secureFlow_verifyDeposit($match, $admin)                             // admin verifies deposit
uploadSecureDeliveryProof($match, $deliverer, $idPhoto, $idType, $handoverPhoto, $combinedPhoto, $note)
confirmDelivery($match, $sender)                                      // handles BOTH secure AND risk confirmation
riskFlow_initiate($match)
riskFlow_uploadDeliveryProof($match, $deliverer, $idPhoto, $idType, $handoverPhoto, $combinedPhoto, $note)
riskFlow_confirmReceipt($match, $sender)
riskFlow_uploadDeposit($match, $user, $file, $ref)
riskFlow_verifyDeposit($match, $admin)
releaseFunds($match, $admin)
refundDeposit($match, $admin, $reason)
```

### MatchingService (5 args, target order first)
```php
$matchingService->proposeMatch($targetOrder, $proposer, $aud, $usd, $message)
```

### Model method type rules
- `SwapMatch::involvesUser(User $user)` — must pass real User, NOT `(object)['id'=>$id]`
- `SwapMatch::isUsersTurnToNegotiate(User $user)` — same
- All controllers now use inline checks instead: `$match->sendOrder?->user_id !== $userId`

### TransactionMessage — no auto timestamps
```php
// $timestamps = false — must explicitly set created_at:
TransactionMessage::create([..., 'created_at' => now()])
// Then call $message->refresh() to get DB-populated value if needed
```

### Avatar URLs
- Profile photos stored on `public` disk → use `Storage::disk('public')->url($path)`
- `User::getAvatarUrlAttribute()` uses `Storage::disk('public')->url()`
- Frontend uses `fixUrl(url)` helper to rewrite any domain to `window.location.origin`

### `window.location.origin` in Vue templates
Vue 2.7 templates do NOT have access to `window`. Always add a `fixUrl(url)` method to the component and call it instead of inline `.replace(/^https?:\/\/[^/]+/, window.location.origin)`.

---

## 4. Database Tables (42 migrations)

| Table | Purpose |
|-------|---------|
| `support_tickets` | User support requests |
| `support_ticket_messages` | Thread messages per ticket |
| + all original 41 tables from fixes1 |

---

## 5. Transaction State Machine

```
open → negotiating → rate_agreed → delivery_method_selecting
     → agreed → awaiting_deposit → deposit_uploaded → deposit_verified
     → awaiting_delivery → delivery_uploaded → awaiting_confirmation
     → confirmed → completing → completed

Risk path:
agreed → awaiting_risk_delivery → delivery_uploaded → awaiting_risk_confirmation
       → risk_confirmed → awaiting_risk_deposit → risk_deposit_uploaded
       → risk_deposit_verified → completing → completed

Terminal: cancelled | expired | refunded | disputed
```

---

## 6. Key Features Implemented

### Exchange rate
- The platform rate is a **guide only** — actual rate is negotiated between parties
- `SmartCalculator.js` shows "Guide rate (indicative)" with `≈` prefix
- Orange info line: "The actual USD amount is negotiated between you and the other party"

### Anonymous profiles
- `DirectoryController` excludes users with `profile_visibility = 'anonymous'`
- `UserController::publicProfile()` respects visibility settings
- Anonymous users do not appear in Directory or Browse

### Reviews
- One review per person per match — submitting again **updates** it
- Frontend sends `comment` field → backend accepts both `comment` and `review_text`
- `DELETE /matches/{ulid}/my-review` — delete own review
- `GET /matches/{ulid}/my-review` — get own review for pre-filling form

### Support tickets
- Users: `/support` → create, view, reply
- Admin: `/admin/support` → list all, reply as support, update status, internal notes
- Statuses: `open` → `awaiting_support` → `awaiting_user` → `resolved` → `closed`

### Send money via
- Profile page "Send money via [name]" → `/browse?user=ULID`
- Browse.js reads `?user` query param, fetches name, shows dismissable banner
- Backend `browse()` supports `user_ulid` filter via `whereHas('user', ...)`

---

## 7. Frontend Route Map

```
Public (no auth):
  /                     Landing page
  /how-it-works         How eZimConnect works
  /safety-and-escrow    Security and escrow explanation
  /terms                Terms of Service
  /privacy              Privacy Policy
  /aml-policy           AML & Compliance
  /acceptable-use       Acceptable Use Policy
  /directory            Member directory
  /profile/:ulid        Public profile

Authenticated:
  /dashboard            Main dashboard
  /browse               Browse open orders
  /orders               My orders
  /orders/create        Create order (requires bank account)
  /matches              My matches
  /matches/:ulid        Match detail
  /support              Support tickets
  /kyc                  Identity verification
  /bank-accounts        Bank accounts
  /profile              My profile
  /settings             Account settings
  /notifications        Notifications
  /history              Transaction history
  /disputes/:id         Dispute detail

Admin:
  /admin/dashboard      Admin dashboard
  /admin/users          User management
  /admin/users/:id      User detail (KYC approve/reject, suspend, ban)
  /admin/matches        All matches
  /admin/deposits       Deposit verification
  /admin/disputes       Dispute management
  /admin/rates          Exchange rate management
  /admin/locations      Zimbabwe delivery locations
  /admin/noticeboard    Platform announcements
  /admin/support        Support ticket management ← NEW
  /admin/orders         All orders
  /admin/audit-logs     System audit trail
  /admin/settings       Platform settings
```

---

## 8. Named Routes (api.php)

```php
admin.document          GET /api/v1/admin/documents/{id}/file
admin.deposit.proof     GET /api/v1/admin/deposits/{id}/proof
admin.delivery.proof    GET /api/v1/admin/deliveries/{id}/proof/{type}
chat.attachment         GET /api/v1/files/chat/{filename}
user.avatar             GET /api/v1/files/avatar/{filename}
```

---

## 9. Components Registered in app.js

`app-nav`, `admin-nav` *(NEW — was missing, causing admin pages to silently fail)*,
`app-footer`, `loading-spinner`, `alert-banner`, `status-badge`, `user-avatar`,
`rating-stars`, `smart-calculator`, `status-timeline`, `chat-panel`,
`transaction-feed-ticker`, `order-card`, `match-card`, `empty-state`,
`confirm-modal`, `file-upload`, `pagination-links`

---

## 10. Admin Credentials

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | `admin@ezimconnect.com` |
| Password | `changeme` |

---

## 11. Development Commands

```bash
# First run
php artisan migrate
php artisan db:seed
php artisan storage:link   # Required for public disk avatars

# After code changes
php artisan route:clear
php artisan cache:clear
composer dump-autoload
npm run build

# Runtime (two terminals)
php artisan serve          # Terminal 1
php artisan queue:work     # Terminal 2 (emails, notifications)
```

---

## 12. Known Remaining Items

- **2FA** — Placeholder only. Needs `pragmarx/google2fa` for production.
- **Email** — Configured but not end-to-end tested. Set `MAIL_*` in `.env`.
- **SMS/Push** — Notification channel stubs only. Needs Twilio/AWS.
- **Rate history chart** — `rate_history` table exists, no seeder data.
- **Recurring orders** — Controller exists, no scheduler job yet.
- **Order boost payment** — Boost records exist, no payment gateway.
- **AdminDashboard** — Has its own inline nav (does not use `<admin-nav />`). Consider refactoring to use the component.
