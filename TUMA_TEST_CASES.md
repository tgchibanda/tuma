# TuMa — Test Case Document (v2)

> **Updated:** April 2026 · Covers fixes1–fixes14
> **Requires:** 3 test accounts (Sender, Receiver, Admin) + `php artisan queue:work` running

---

## Test Accounts

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Sender | tendai@test.com | Test1234! | Australian — sends AUD |
| Receiver | rudo@test.com | Test1234! | Delivers USD in Zimbabwe |
| Admin | admin@tuma.com | changeme | Pre-seeded |

---

## MODULE 1 — Public Pages & Landing

### TC-001: Landing page loads
Navigate to `/`. Expect: hero, how-it-works section, features, reviews, footer with real links.

### TC-002: How It Works page
Click "How it works" in landing footer. Expect: `/how-it-works` loads with 6 steps, no blank content.

### TC-003: Safety & Escrow page
Click "Safety and Escrow" in footer. Expect: `/safety-and-escrow` loads with escrow explanation.

### TC-004: Privacy Policy
Click "Privacy Policy" in footer. Expect: `/privacy` loads with full policy text, not a blank page.

### TC-005: Terms of Service
Click "Terms of Service" in footer. Expect: `/terms` loads with full terms.

### TC-006: AML Policy
Navigate to `/aml-policy`. Expect: page loads with AML content.

### TC-007: Contact Support NOT on landing footer
Verify "Contact support" link is **absent** from landing footer. Support is only for logged-in users.

### TC-008: Footer legal links work (logged-in)
Log in and check footer. Expect: Privacy Policy, Terms, AML, Acceptable Use, Support, Directory all navigate correctly.

---

## MODULE 2 — Registration & Authentication

### TC-010: Register new account
Fill all fields. Expect: account created, redirected to dashboard or onboarding.

### TC-011: Duplicate email rejected
Register with same email. Expect: "The email has already been taken."

### TC-012: Login / logout flow
Login, verify token in localStorage, logout, verify token removed, `/dashboard` redirects to `/login`.

### TC-013: API returns 401 JSON (not redirect)
Access `/api/v1/user` without token. Expect: `{"message":"Unauthenticated."}` with HTTP 401, NOT a redirect to `route('login')`.

---

## MODULE 3 — KYC

### TC-020: Upload passport + selfie → submitted status
Upload two documents. Expect: `kyc_status` → "submitted".

### TC-021: Delete document → status reverts
Delete selfie. Expect: `kyc_status` → "pending".

### TC-022: Admin approves KYC
Admin → Users → approve. Expect: `kyc_status` → "approved", user notified.

### TC-023: Admin rejects KYC with reason
Admin rejects with reason text. Expect: `kyc_status` → "rejected", reason stored, user notified with specific message.

### TC-024: Trading allowed regardless of KYC
Create order with `kyc_status = 'pending'`. Expect: order created successfully.

---

## MODULE 4 — Bank Accounts

### TC-030: Add bank account
Add NAB account. Expect: saved, marked as primary.

### TC-031: No bank account → CreateOrder redirects
Delete all bank accounts. Navigate to `/orders/create`. Expect: toast "Please add an Australian bank account" and redirect to `/bank-accounts`.

### TC-032: Bank account warning banner
On `/bank-accounts` with no accounts. Expect: orange warning banner visible saying account required before creating orders.

---

## MODULE 5 — Orders

### TC-040: Create Send order
Create order: type=Send, AUD 500, Harare. Expect: order created, status "open". Calculator shows "≈ USD" with guide rate note.

### TC-041: Create Receive order (as Rudo)
Create Receive order, AUD 500, Harare. Expect: order created.

### TC-042: Browse — page loads correctly
Navigate to `/browse`. Expect: orders listed, no blank page, no console errors.

### TC-043: Browse — avatar shows next to user name
Expect: profile picture (or letter initial) visible next to each order owner's name.

### TC-044: Browse — multi-city filter works
Select Harare + Bulawayo checkboxes. Expect: both cities filtered, active pills shown.

### TC-045: Browse — own orders not shown
Tendai's own orders must not appear in Tendai's browse results.

---

## MODULE 6 — Matching & Negotiation

### TC-050: Propose match
Browse as Tendai, find Rudo's order, propose. Expect: match created, Rudo notified with specific message (not generic "You have a notification").

### TC-051: Counter-offer (sends `counter_aud`)
As Rudo, counter with AUD 490 / USD 309. Expect: match status "negotiating", Tendai notified. **Verify the field name `counter_aud` is accepted — it maps to `proposed_aud` internally.**

### TC-052: Accept rate
As Tendai, accept. Expect: match status "rate_agreed".

### TC-053: Delivery method — proposer cannot confirm own proposal
As Tendai, propose Secure delivery. As Tendai, try to confirm. Expect: error "You cannot confirm your own delivery method proposal." As Rudo, confirm. Expect: status "awaiting_deposit".

### TC-054: Exchange rate is negotiated
Verify that the calculator on CreateOrder shows "(indicative)" label and orange note: "The actual USD amount is negotiated between you and the other party."

---

## MODULE 7 — Deposit

### TC-060: Deposit section visible at `awaiting_deposit`
After delivery method confirmed, deposit section with bank details must be visible. Expect: bank name, BSB, account number, reference TM-XXXXXXXX shown.

### TC-061: Upload deposit proof (optional reference)
Upload screenshot. Leave `depositor_reference` blank. Expect: upload succeeds — field is now optional.

### TC-062: Admin verifies deposit
Admin verifies. Expect: match → "awaiting_delivery", Rudo notified with "AUD is secured — proceed to deliver cash" (not generic).

### TC-063: Admin rejects deposit
Admin rejects. Expect: match reverts, Tendai notified.

---

## MODULE 8 — Delivery

### TC-070: Upload delivery proof (combined photo)
As Rudo, upload one combined photo. Expect: match → "delivery_uploaded".

### TC-071: Upload delivery proof (two photos)
As Rudo, upload ID photo + handover photo separately. Expect: match → "delivery_uploaded".

### TC-072: Confirm cash received
As Tendai, confirm receipt. Expect: match → "confirmed" → Admin notified to release funds.

### TC-073: Admin releases funds with fee breakdown
Admin releases funds. Expect: Rudo receives notification: "AUD $490.00 released to your bank (after AUD $7.50 platform fee from AUD $497.50)."

---

## MODULE 9 — Chat

### TC-080: Send chat message
Send message in active match. Expect: message saved, other party notified, `created_at` populated (not null).

### TC-081: Chat closes after completion
In completed match, chat input disabled. Expect: "This transaction is completed. The chat has been closed."

---

## MODULE 10 — Reviews

### TC-090: Partner info shown on completed match
Open completed match. Expect: partner card visible showing their avatar, name, rating, trust score, and "View profile" button.

### TC-091: Submit review
Click stars (★), type comment, click Submit. Expect: review saved with comment text.

### TC-092: Comment text is saved (regression)
After submitting review, navigate away and back. Expect: comment text visible in review — not blank.

### TC-093: One review per match — update not duplicate
Submit review, then submit again with different score. Expect: review **updated** (not rejected as duplicate).

### TC-094: Edit existing review
Click "Edit" on existing review. Change score. Expect: review updated.

### TC-095: Delete review
Click "Delete" on existing review. Confirm. Expect: review removed, rating recalculated.

---

## MODULE 11 — Public Profiles & Directory

### TC-100: Directory shows profile pictures
On `/directory`, each member card shows their profile picture (or initial fallback). No blank cards.

### TC-101: Anonymous users NOT in directory
Set a test account `profile_visibility = 'anonymous'`. Reload directory. Expect: that user does not appear.

### TC-102: Click member card → public profile
Click any directory card. Expect: navigates to `/profile/:ulid` and shows full profile.

### TC-103: Public profile — reviews formatted correctly
On `/profile/:ulid`, reviews show reviewer name as string, not raw JSON object.

### TC-104: Send money via
On public profile, click "Send money via [name]". Expect: navigates to `/browse?user=ULID` with green banner "Showing orders by [name]" and only that user's orders listed.

### TC-105: Clear "send money via" filter
Click "Clear filter" on the browse banner. Expect: filter cleared, all orders show.

---

## MODULE 12 — Notifications

### TC-110: Match proposed — specific message
After match proposed, check notifications. Expect: specific message referencing the match, NOT "You have a new notification."

### TC-111: Deposit verified — specific message
After deposit verified, check. Expect: "AUD is secured. Cash delivery is underway."

### TC-112: Delivery proof uploaded — specific message
After delivery uploaded, sender's notification. Expect: "Cash delivery proof uploaded. Please confirm receipt."

### TC-113: Funds released — fee breakdown
After admin releases funds, receiver's notification. Expect: shows gross, fee, and net amount clearly.

---

## MODULE 13 — Support

### TC-120: Create support ticket
Navigate to `/support`, click New ticket. Fill category, subject, message. Submit. Expect: ticket created with TKT-XXXXX reference, confirmation shown.

### TC-121: Help icon on navbar
Expect: `?` icon visible in top navbar. Clicking it navigates to `/support`.

### TC-122: View ticket detail
Click a ticket. Expect: messages thread visible, reply box available.

### TC-123: Reply to ticket
Type reply. Send. Expect: message appears in thread, ticket status → "awaiting_support".

### TC-124: Admin sees all tickets
Log in as admin, navigate to `/admin/support`. Expect: all user tickets listed in table.

### TC-125: Admin replies to ticket
Admin opens ticket, types reply, clicks Send. Expect: message appears as "TuMa Support", user's ticket shows admin reply.

### TC-126: Admin updates ticket status
Admin clicks "Resolved". Expect: ticket status updates, visible in both admin and user views.

### TC-127: Admin adds internal notes
Admin types in "Admin Notes" field, clicks Save. Expect: notes saved, visible to admin only.

### TC-128: Closed ticket reply blocked
Attempt to reply to a closed ticket. Expect: "This ticket is closed" message shown.

---

## MODULE 14 — Admin Pages

### TC-130: Admin audit logs load
Navigate to `/admin/audit-logs`. Expect: logs listed with action, user name, email, timestamp. NOT a loading spinner stuck indefinitely.

### TC-131: Admin locations load
Navigate to `/admin/locations`. Expect: 16 Zimbabwe cities listed grouped by province. NOT stuck loading.

### TC-132: Admin exchange rate management
Set new rate 0.6350. Expect: new rate shown as active, old rate deactivated.

### TC-133: Admin noticeboard — create and publish
Create a notice (Info type, All audience). Publish it. Expect: visible on user-facing noticeboard.

### TC-134: Admin KYC approve/reject
From `/admin/users/:id`, approve KYC. Expect: user kyc_status → "approved". Reject with reason. Expect: rejection reason stored and sent to user.

### TC-135: Admin suspend / unsuspend
Suspend a user with reason. Expect: user cannot log in. Unsuspend. Expect: login restored.

---

## MODULE 15 — Full End-to-End

### TC-200: Complete Secure Delivery transaction

| # | Actor | Action | Expected |
|---|-------|--------|----------|
| 1 | Tendai | Create Send order, AUD 500, Harare | Status: open |
| 2 | Rudo | Create Receive order, AUD 500, Harare | Status: open |
| 3 | Tendai | Browse → propose to Rudo's order | Match: proposed |
| 4 | Rudo | Counter-offer AUD 490 / USD 309 | Match: negotiating |
| 5 | Tendai | Accept rate | Match: rate_agreed |
| 6 | Tendai | Propose Secure delivery | Match: delivery_method_selecting |
| 7 | Rudo | Accept delivery method | Match: awaiting_deposit |
| 8 | Tendai | Upload deposit screenshot | Match: deposit_uploaded |
| 9 | Admin | Verify deposit | Match: awaiting_delivery |
| 10 | Rudo | Upload ID + handover photos | Match: delivery_uploaded |
| 11 | Tendai | Open match, see partner card | Rudo's name/avatar visible |
| 12 | Tendai | Confirm cash received | Match: confirmed |
| 13 | Admin | Release funds | Match: completed — Rudo notified with fee breakdown |
| 14 | Tendai | Submit review (5 stars + comment) | Review saved with comment text |
| 15 | Rudo | Submit review | Review saved |
| ✓ | Both | Check notifications | All specific — no generic messages |

### TC-201: Complete Risk Delivery transaction

| # | Actor | Action | Expected |
|---|-------|--------|----------|
| 1–5 | Both | Create orders, propose, negotiate, accept rate | Match: rate_agreed |
| 6 | Rudo | Propose Risk delivery | Match: delivery_method_selecting |
| 7 | Tendai | Accept Risk delivery | Match: awaiting_risk_delivery |
| 8 | Rudo | Upload delivery proof | Match: delivery_uploaded |
| 9 | Tendai | Confirm receipt | Match: awaiting_risk_deposit |
| 10 | Tendai | Upload AUD deposit proof | Match: risk_deposit_uploaded |
| 11 | Admin | Verify and release | Match: completed |

---

## Pre-Launch Sign-Off Checklist

- [ ] TC-001 to TC-008: All public info pages load with real content
- [ ] TC-010 to TC-013: Auth works, 401 returns JSON not redirect
- [ ] TC-020 to TC-024: KYC flow complete
- [ ] TC-030 to TC-032: Bank account guard working
- [ ] TC-040 to TC-045: Orders and browse working, avatars visible
- [ ] TC-050 to TC-054: Matching, negotiation, delivery method proposer check
- [ ] TC-060 to TC-063: Deposit section visible, optional reference
- [ ] TC-070 to TC-073: Delivery with fee breakdown notification
- [ ] TC-080 to TC-081: Chat with created_at fix
- [ ] TC-090 to TC-095: Reviews: comment saved, update not duplicate, edit/delete
- [ ] TC-100 to TC-105: Directory no anonymous, avatars, send money via
- [ ] TC-110 to TC-113: All notifications specific not generic
- [ ] TC-120 to TC-128: Support tickets user + admin side
- [ ] TC-130 to TC-135: Admin pages loading correctly
- [ ] TC-200: Full secure delivery end-to-end
- [ ] TC-201: Full risk delivery end-to-end
- [ ] No JavaScript console errors on any page
- [ ] Mobile responsive on phone browser
- [ ] `php artisan queue:work` running — emails/notifications delivered
