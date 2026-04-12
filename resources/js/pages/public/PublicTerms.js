export default {
    name: 'PublicTermsOfService',
    template: `
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Sign up free</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div class="mb-8">
        <span class="text-xs font-bold px-3 py-1 rounded-full" style="background:#f0fdf4;color:#1a6b3c;">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-4 mb-2" style="font-family:Georgia,serif;">Terms of Service</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Effective: 1 January 2025</p>
        <div class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
          By using eZimConnect you agree to these terms. Please read them carefully before creating an account.
        </div>
      </div>

      <div class="space-y-7 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using eZimConnect ("Platform", "we", "us"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use this platform. eZimConnect is operated by eZimConnect Pty Ltd, registered in Australia (ABN pending).</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">2. Platform Description</h2>
          <p>eZimConnect is a peer-to-peer currency exchange platform facilitating AUD-to-USD cash transactions between members in Australia and Zimbabwe. eZimConnect acts as an escrow intermediary — we hold AUD deposits while cash delivery is arranged between members. eZimConnect is not a bank, money remitter, or financial institution.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">3. Eligibility</h2>
          <p>You must be at least 18 years of age and legally permitted to conduct financial transactions in your jurisdiction. By registering, you confirm that all information provided is accurate and complete. Providing false information may result in permanent account termination.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">4. Identity Verification (KYC)</h2>
          <p>eZimConnect is committed to Anti-Money Laundering (AML) compliance. You may be required to submit identity documents for verification. We reserve the right to suspend or terminate accounts that do not meet verification requirements or where verification documents are found to be fraudulent.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">5. Transaction Process and Escrow</h2>
          <p>When using the Secure Delivery option, AUD funds deposited into eZimConnect's trust account are held in escrow until delivery of cash is confirmed. Funds are released only after both parties confirm the transaction. For Risk Delivery, parties transact at their own risk without full escrow protection. eZimConnect takes no responsibility for losses arising from Risk Delivery transactions.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">6. Exchange Rate</h2>
          <p>eZimConnect provides an indicative AUD/USD exchange rate for reference only. The actual exchange rate for each transaction is negotiated directly between the two parties. eZimConnect does not guarantee any particular rate.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">7. Platform Fees</h2>
          <p>eZimConnect charges a platform fee on each completed transaction, displayed during order creation. Fees are deducted from the AUD amount before release to the receiver. eZimConnect reserves the right to modify fees with 30 days' notice.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">8. Prohibited Conduct</h2>
          <p>You must not use eZimConnect for: money laundering or terrorism financing; sanctions evasion; fraudulent transactions; harassing or threatening other members; creating multiple accounts; or any activity that violates Australian or Zimbabwe law.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">9. Disputes</h2>
          <p>If a dispute arises, both parties should attempt to resolve it via the in-platform dispute system. eZimConnect staff may investigate and make a final determination on disputed transactions. eZimConnect's decision is binding and final regarding fund release from escrow.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">10. Limitation of Liability</h2>
          <p>eZimConnect's total liability shall not exceed the transaction fees paid by you in the 6 months preceding the relevant event. We are not liable for delays, losses, or failures caused by events outside our control, including banking delays, network outages, or third-party failures.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">11. Governing Law</h2>
          <p>These terms are governed by the laws of New South Wales, Australia. Disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">12. Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:adminezimconnect.com" class="font-medium hover:underline" style="color:#1a6b3c;">adminezimconnect.com</a></p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-3 text-xs text-gray-400">
          <router-link to="/privacy"        class="hover:text-gray-600 transition-colors">Privacy Policy</router-link>
          <router-link to="/aml-policy"     class="hover:text-gray-600 transition-colors">AML Policy</router-link>
          <router-link to="/acceptable-use" class="hover:text-gray-600 transition-colors">Acceptable Use</router-link>
        </div>
        <router-link to="/register" class="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          Create account
        </router-link>
      </div>
    </div>
  </div>
</div>`
}
