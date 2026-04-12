export default {
    name: 'PublicPrivacyPolicy',
    template: `
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-8 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Sign up free</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div class="mb-8">
        <span class="text-xs font-bold px-3 py-1 rounded-full" style="background:#f0fdf4;color:#1a6b3c;">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-4 mb-2" style="font-family:Georgia,serif;">Privacy Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Compliant with the Australian Privacy Act 1988</p>
      </div>

      <div class="space-y-7 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">1. Information We Collect</h2>
          <p><strong>Identity data:</strong> Name, date of birth, nationality, and identity documents for KYC verification.</p>
          <p class="mt-2"><strong>Contact data:</strong> Email address, phone number, and Australian address.</p>
          <p class="mt-2"><strong>Financial data:</strong> Bank account details (BSB and account number) for AUD transactions. We do not store card numbers or CVV codes.</p>
          <p class="mt-2"><strong>Transaction data:</strong> Records of all orders, matches, deposits, and cash deliveries you participate in.</p>
          <p class="mt-2"><strong>Device data:</strong> IP address, browser type, and login history for security and fraud prevention.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">2. How We Use Your Information</h2>
          <p>We use your data to: provide and operate TuMa; verify your identity under AML/KYC obligations; process and secure transactions; prevent fraud; respond to support; send transaction notifications; and improve our platform. We will not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">3. Legal Basis for Processing</h2>
          <p>Performance of contract; legal obligation (AML, KYC requirements); legitimate interests (fraud prevention, security); and consent where you have opted in to optional communications.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">4. Data Sharing</h2>
          <p>We share limited data with: identity verification providers; payment partners; law enforcement when required by law; and cloud infrastructure providers under data processing agreements. Between matched parties, only display name, trust score, and rating are shared — never identity documents.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">5. Data Retention</h2>
          <p>We retain your data for as long as your account is active, plus 7 years for financial and AML compliance records as required by Australian law.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">6. Your Rights</h2>
          <p>Under the Australian Privacy Act 1988 you have the right to: access your personal data; correct inaccuracies; request deletion (subject to legal obligations); restrict processing; and lodge a complaint with the OAIC (oaic.gov.au).</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">7. Security</h2>
          <p>We use industry-standard encryption, secure servers, and strict access controls. All passwords are hashed. Financial data is encrypted at rest and in transit.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">8. Cookies</h2>
          <p>We use session cookies for authentication and performance cookies only. No advertising or third-party tracking cookies are used.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">9. Contact</h2>
          <p>Privacy enquiries: <a href="mailto:privacy@tuma.com.au" class="font-medium hover:underline" style="color:#1a6b3c;">privacy@tuma.com.au</a></p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-3 text-xs text-gray-400">
          <router-link to="/terms"          class="hover:text-gray-600">Terms of Service</router-link>
          <router-link to="/aml-policy"     class="hover:text-gray-600">AML Policy</router-link>
          <router-link to="/acceptable-use" class="hover:text-gray-600">Acceptable Use</router-link>
        </div>
        <router-link to="/register" class="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          Create account
        </router-link>
      </div>
    </div>
  </div>
</div>`
}
