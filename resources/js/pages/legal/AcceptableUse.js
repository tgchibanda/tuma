export default {
    name: 'AcceptableUse',
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">Acceptable Use Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025</p>
      </div>
      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Purpose</h2>
          <p>This policy defines acceptable conduct on TuMa to protect members and maintain a safe, trustworthy community.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Permitted Use</h2>
          <p>TuMa is designed exclusively for legitimate peer-to-peer AUD/USD currency exchange between Australian-based senders and Zimbabwe-based cash deliverers. You may use TuMa to create orders, propose and negotiate matches, arrange cash deliveries, and manage your account.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Prohibited Use</h2>
          <p>You must not: create fake or duplicate accounts; misrepresent your identity or the nature of funds; threaten, harass, or abuse other members; manipulate the rating system; use automated scripts or bots; attempt to circumvent our security measures; or use TuMa to process unlawfully obtained funds.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Community Standards</h2>
          <p>Members are expected to communicate respectfully, honour agreed transaction terms, upload accurate delivery and deposit proof, and resolve disputes in good faith. We take community trust seriously — members with a pattern of disputes or low trust scores may be removed.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Consequences of Violation</h2>
          <p>Violations may result in warnings, temporary suspension, permanent ban, or referral to law enforcement, depending on severity.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Reporting Violations</h2>
          <p>To report a member who has violated this policy, use the "Report user" feature on their profile or contact <a href="mailto:safety@tuma.com.au" class="text-green-700 hover:underline">safety@tuma.com.au</a>.</p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
