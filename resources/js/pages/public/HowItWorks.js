export default {
    name: 'HowItWorks',
    template: `
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-8 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800">Sign up</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-4xl mx-auto px-4 py-14">
    <div class="text-center mb-12">
      <span class="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">How TuMa Works</span>
      <h1 class="text-4xl font-black text-gray-900 mt-4 mb-3" style="font-family:Georgia,serif;">Send money to Zimbabwe<br>without the bank fees</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto">TuMa connects Australians who want to send AUD with people in Zimbabwe who deliver USD cash — peer-to-peer, secured by escrow.</p>
    </div>

    <!-- Steps -->
    <div class="grid md:grid-cols-2 gap-6 mb-14">
      <div v-for="(step, i) in [
        { n:'1', icon:'fa-user-plus',     title:'Create an account',     desc:'Sign up and verify your identity. KYC takes less than 5 minutes with a photo ID.' },
        { n:'2', icon:'fa-list-alt',      title:'Create an order',       desc:'Specify how much AUD you want to swap. Our calculator shows an estimated USD amount.' },
        { n:'3', icon:'fa-handshake',     title:'Match and negotiate',   desc:'Browse open orders or get matched automatically. Negotiate the AUD/USD rate directly with your partner.' },
        { n:'4', icon:'fa-university',    title:'Deposit AUD to escrow', desc:'Transfer AUD to TuMa\'s trust account. We hold it securely until delivery is confirmed.' },
        { n:'5', icon:'fa-money-bill-wave',title:'Cash delivered in Zimbabwe',desc:'Your match delivers USD cash to your recipient. They upload a photo with the recipient\'s ID as proof.' },
        { n:'6', icon:'fa-check-circle',  title:'Confirm and complete',  desc:'You confirm receipt. We release your AUD to your partner. Transaction complete — usually within hours.' },
      ]" :key="step.n"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">{{ step.n }}</div>
        <div>
          <p class="font-bold text-gray-900 mb-1">{{ step.title }}</p>
          <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <div class="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
      <h2 class="text-xl font-black text-gray-900 mb-2">Ready to get started?</h2>
      <p class="text-gray-600 mb-5">Join thousands of Zimbabweans in Australia saving on every transfer.</p>
      <router-link to="/register" class="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        Create free account <i class="fas fa-arrow-right text-xs"></i>
      </router-link>
    </div>
  </div>
</div>`
}
