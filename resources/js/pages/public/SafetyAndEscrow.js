export default {
    name: 'SafetyAndEscrow',
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
      <span class="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">Safety & Escrow</span>
      <h1 class="text-4xl font-black text-gray-900 mt-4 mb-3" style="font-family:Georgia,serif;">Your money is protected<br>every step of the way</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto">TuMa's escrow system ensures neither party can lose funds in a legitimate transaction.</p>
    </div>

    <div class="space-y-6 mb-12">
      <div v-for="f in [
        { icon:'fa-lock', color:'green', title:'AUD held in escrow', desc:'When you deposit AUD, it goes into TuMa\'s regulated trust account — not to the other person. It stays there until you confirm the cash was received in Zimbabwe.' },
        { icon:'fa-id-card', color:'blue', title:'Identity verified', desc:'Every member must verify their identity with a government-issued ID before trading. Anonymous users cannot participate in transactions.' },
        { icon:'fa-camera', color:'purple', title:'Proof of delivery required', desc:'The cash deliverer must upload a photo of the recipient\'s ID plus a handover photo showing the cash and amount. This creates an undeniable record.' },
        { icon:'fa-gavel', color:'orange', title:'Dispute resolution', desc:'If something goes wrong, raise a dispute. TuMa staff review all evidence and make a binding decision. Funds are never released without proper confirmation.' },
        { icon:'fa-shield-alt', color:'red', title:'Fraud prevention', desc:'Our system monitors transactions for suspicious patterns. Accounts with repeated disputes or fraud indicators are suspended immediately.' },
        { icon:'fa-star', color:'yellow', title:'Community trust scores', desc:'Every member has a trust score based on completed trades, ratings, and on-time delivery. Choose partners with high trust scores for extra peace of mind.' },
      ]" :key="f.title"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4 items-start">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-'+f.color+'-100']">
          <i :class="['fas', f.icon, 'text-'+f.color+'-600', 'text-lg']"></i>
        </div>
        <div>
          <h3 class="font-bold text-gray-900 mb-1">{{ f.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Secure vs Risk -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Two delivery options</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <p class="font-bold text-green-800 mb-1"><i class="fas fa-lock mr-2"></i>Secure Delivery (recommended)</p>
          <p class="text-sm text-green-700">AUD is deposited to escrow first. Cash is delivered after verification. Maximum protection for both parties.</p>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p class="font-bold text-orange-800 mb-1"><i class="fas fa-exclamation-triangle mr-2"></i>Risk Delivery</p>
          <p class="text-sm text-orange-700">Cash is delivered first, then AUD is deposited. Only use with trusted, verified partners with high trust scores.</p>
        </div>
      </div>
    </div>

    <div class="text-center">
      <router-link to="/register" class="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        Start securely <i class="fas fa-arrow-right text-xs"></i>
      </router-link>
    </div>
  </div>
</div>`
}
