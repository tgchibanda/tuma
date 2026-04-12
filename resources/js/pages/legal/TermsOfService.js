export default {
    name: 'TermsOfService',
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">Terms of Service</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Effective: 1 January 2025</p>
      </div>

      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using eZimConnect ("Platform", "we", "us"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use this platform. eZimConnect is operated by eZimConnect Pty Ltd, registered in Australia (ABN pending).</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">2. Platform Description</h2>
          <p>eZimConnect is a peer-to-peer currency exchange platform facilitating AUD-to-USD cash transactions between members in Australia and Zimbabwe. eZimConnect acts as an escrow intermediary — we hold AUD deposits while cash delivery is arranged between members. eZimConnect is not a bank, money remitter, or financial institution.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">3. Eligibility</h2>
          <p>You must be at least 18 years of age and legally permitted to conduct financial transactions in your jurisdiction to use eZimConnect. By registering, you confirm that all information provided is accurate and complete. Providing false information may result in permanent account termination.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">4. Identity Verification (KYC)</h2>
          <p>eZimConnect is committed to Anti-Money Laundering (AML) compliance. You may be required to submit identity documents for verification. We reserve the right to suspend or terminate accounts that do not meet verification requirements or where verification documents are found to be fraudulent.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">5. Transaction Process and Escrow</h2>
          <p>When using the Secure Delivery option, AUD funds deposited into eZimConnect's trust account are held in escrow until delivery of cash is confirmed. Funds are released only after both parties confirm the transaction. For Risk Delivery, parties transact at their own risk without escrow protection. eZimConnect takes no responsibility for losses arising from Risk Delivery transactions.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">6. Fees</h2>
          <p>eZimConnect charges a platform fee on each completed transaction. The current fee schedule is displayed during order creation. Fees are deducted from the AUD amount before release. eZimConnect reserves the right to modify fees with 30 days' notice.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">7. Exchange Rate</h2>
          <p>eZimConnect provides an indicative AUD/USD exchange rate for reference only. The actual exchange rate for each transaction is negotiated directly between the two parties. eZimConnect does not guarantee any particular rate and is not responsible for rate differences between the indicative and agreed rate.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">8. Prohibited Conduct</h2>
          <p>You must not use eZimConnect for: money laundering or terrorism financing; sanctions evasion; fraudulent transactions; harassing or threatening other members; creating multiple accounts; or any activity that violates Australian law or Zimbabwe law.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">9. Disputes</h2>
          <p>If a dispute arises, both parties should attempt to resolve it via the in-platform dispute system. eZimConnect staff may investigate and make a final determination on disputed transactions. eZimConnect's decision is binding and final regarding fund release from escrow.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">10. Limitation of Liability</h2>
          <p>eZimConnect's total liability in any circumstances shall not exceed the transaction fees paid by you in the 6 months preceding the event giving rise to the claim. We are not liable for delays, losses, or failures caused by events outside our control.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">11. Governing Law</h2>
          <p>These terms are governed by the laws of New South Wales, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">12. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:admin@ezimconnect.com.au" class="text-green-700 hover:underline">admin@ezimconnect.com.au</a>.</p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
