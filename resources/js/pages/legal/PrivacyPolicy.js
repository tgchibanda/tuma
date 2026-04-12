export default {
    name: 'PrivacyPolicy',
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">Privacy Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Compliant with the Australian Privacy Act 1988</p>
      </div>

      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p><strong>Identity data:</strong> Name, date of birth, nationality, and identity documents submitted for KYC verification.</p>
          <p class="mt-2"><strong>Contact data:</strong> Email address, phone number, and Australian residential address.</p>
          <p class="mt-2"><strong>Financial data:</strong> Bank account details (BSB and account number) for AUD transactions. We do not store full card numbers or CVV codes.</p>
          <p class="mt-2"><strong>Transaction data:</strong> Records of all orders, matches, deposits, and cash deliveries you participate in.</p>
          <p class="mt-2"><strong>Device and usage data:</strong> IP address, browser type, login history, and interaction patterns for security and fraud prevention purposes.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>We use your data to: provide and operate the eZimConnect platform; verify your identity under our AML/KYC obligations; process and secure transactions; prevent fraud and money laundering; respond to support requests; send transaction notifications and service communications; and improve our platform.</p>
          <p class="mt-2">We will not sell your personal information to third parties or use it for advertising purposes unrelated to eZimConnect.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">3. Legal Basis for Processing</h2>
          <p>We process your data on the following bases: performance of contract (to provide the service); legal obligation (AML, KYC requirements under Australian law); legitimate interests (fraud prevention, platform security); and consent (where you have opted in to optional communications).</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">4. Data Sharing</h2>
          <p>We share limited personal data with: identity verification providers; payment processing partners; law enforcement or government bodies when required by law; and our cloud infrastructure providers, all bound by data processing agreements.</p>
          <p class="mt-2">Between matched transaction parties, only limited profile information (display name, trust score, rating) is shared. Identity documents are never shared with other members.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">5. Data Retention</h2>
          <p>We retain your data for as long as your account is active plus 7 years for financial and AML compliance records, as required by Australian law. You may request deletion of marketing data at any time.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">6. Your Rights</h2>
          <p>Under the Australian Privacy Act 1988 (and the GDPR if applicable), you have the right to: access your personal data; correct inaccurate data; request deletion (subject to legal retention obligations); restrict or object to certain processing; and lodge a complaint with the Office of the Australian Information Commissioner (OAIC).</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">7. Security</h2>
          <p>We use industry-standard encryption, secure servers, and access controls to protect your data. All passwords are hashed and never stored in plain text. Financial data is encrypted at rest and in transit.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">8. Cookies</h2>
          <p>We use session cookies for authentication and performance cookies to improve the platform experience. We do not use advertising or tracking cookies from third parties.</p>
        </section>

        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">9. Contact</h2>
          <p>For privacy enquiries or to exercise your rights, contact our Privacy Officer at <a href="mailto:adminezimconnect.com.au" class="text-green-700 hover:underline">adminezimconnect.com.au</a> or via our support system.</p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
