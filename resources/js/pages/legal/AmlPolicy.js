export default {
    name: 'AmlPolicy',
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">AML & Compliance Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025</p>
      </div>
      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Our Commitment</h2>
          <p>eZimConnect is committed to complying with Australian Anti-Money Laundering and Counter-Terrorism Financing (AML/CTF) laws, including the <em>Anti-Money Laundering and Counter-Terrorism Financing Act 2006</em> (Cth) and all relevant AUSTRAC obligations.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Know Your Customer (KYC)</h2>
          <p>All users must verify their identity before conducting transactions. We collect and verify government-issued photo ID and may request additional documentation for enhanced due diligence on high-value transactions or flagged accounts.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Transaction Monitoring</h2>
          <p>eZimConnect monitors all transactions for suspicious patterns. Transactions that trigger risk thresholds are reviewed by our compliance team. We report suspicious matters to AUSTRAC as required by law.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Prohibited Activities</h2>
          <p>The following activities are strictly prohibited on eZimConnect: transactions involving sanctioned individuals or entities; structuring transactions to avoid reporting thresholds; use of the platform for terrorism financing; and transactions involving proceeds of crime.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Record Keeping</h2>
          <p>We retain transaction records, KYC documents, and audit trails for a minimum of 7 years in accordance with Australian law. These records are available to regulators upon lawful request.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Contact</h2>
          <p>To report suspicious activity or for compliance enquiries: <a href="mailto:compliance@ezimconnect.com.au" class="text-green-700 hover:underline">compliance@ezimconnect.com.au</a></p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
