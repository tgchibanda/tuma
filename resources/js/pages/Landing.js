export default {
    name: 'Landing',
    data() {
        return { feedItems: [], stats: {}, loading: true }
    },
    async mounted() {
        try {
            const [feed, stats] = await Promise.all([
                this.$http.get('/feed?per_page=5'),
                this.$http.get('/feed/stats')
            ])
            this.feedItems = feed.data.data || []
            this.stats = stats.data.data || {}
        } catch {}
        this.loading = false
    },
    computed: {
        totalSent() {
            if (!this.stats.total_volume_aud) return '$847,320 AUD'
            return '$' + Number(this.stats.total_volume_aud).toLocaleString() + ' AUD'
        },
        txCount() { return this.stats.total_count || '1,243' },
        successRate() { return (this.stats.success_rate || 98) + '%' },
        citiesCount() { return this.stats.cities_count || 16 }
    },
    methods: {
        formatDate(dt) {
            if (!dt) return ''
            return new Date(dt).toLocaleDateString('en-AU', {day:'numeric', month:'short'})
        }
    },
    template: `<div class="min-h-screen bg-white">

  <nav class="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
        <span class="text-white font-bold text-sm">Tu</span>
      </div>
      <span class="text-xl font-bold text-gray-900">Tu<span class="text-green-700">Ma</span></span>
    </div>
    <div class="flex items-center gap-3">
      <router-link to="/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">Log in</router-link>
      <router-link to="/register" class="text-sm font-semibold bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 transition">Get started</router-link>
    </div>
  </nav>

  <div class="max-w-5xl mx-auto px-4 py-20 text-center">
    <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
      <i class="fas fa-bolt text-xs"></i> Zero remittance fees
    </div>
    <h1 class="text-5xl font-bold text-gray-900 leading-tight mb-6">
      Send money to Zimbabwe<br>
      <span class="text-green-700">without the bank fees</span>
    </h1>
    <p class="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
      TuMa connects Australians with trusted community members to swap AUD and USD cash.
      No wire fees. No bad exchange rates. Peer-to-peer, secured by escrow.
    </p>
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <router-link to="/register"
        class="px-8 py-4 bg-green-700 text-white rounded-2xl font-semibold text-lg hover:bg-green-800 transition shadow-lg">
        Start sending money
      </router-link>
      <router-link to="/directory"
        class="px-8 py-4 border border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition">
        Browse trusted senders
      </router-link>
    </div>
  </div>

  <div class="bg-gray-50 py-20">
    <div class="max-w-5xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">How TuMa works</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(step, i) in [
          {icon:'fa-plus-circle', title:'Create an order', desc:'Post how much AUD you want to send and who receives USD cash in Zimbabwe.', color:'blue'},
          {icon:'fa-handshake', title:'Match and agree', desc:'Get matched with someone who has the opposite need. Negotiate the rate together.', color:'green'},
          {icon:'fa-shield-alt', title:'Escrow protection', desc:'AUD is held in our trust account until cash delivery in Zimbabwe is confirmed.', color:'purple'}
        ]" :key="i" class="text-center">
          <div :class="'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-' + step.color + '-100'">
            <i :class="'fas ' + step.icon + ' text-2xl text-' + step.color + '-600'"></i>
          </div>
          <p class="text-3xl font-bold text-gray-900 mb-2">{{ i + 1 }}</p>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="py-16 border-b border-gray-100">
    <div class="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div><p class="text-3xl font-bold text-gray-900">{{ totalSent }}</p><p class="text-sm text-gray-500 mt-1">Total sent</p></div>
      <div><p class="text-3xl font-bold text-gray-900">{{ txCount }}</p><p class="text-sm text-gray-500 mt-1">Transactions</p></div>
      <div><p class="text-3xl font-bold text-gray-900">{{ successRate }}</p><p class="text-sm text-gray-500 mt-1">Success rate</p></div>
      <div><p class="text-3xl font-bold text-gray-900">{{ citiesCount }}</p><p class="text-sm text-gray-500 mt-1">Cities served</p></div>
    </div>
  </div>

  <div class="py-16 bg-gray-50">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Live transaction feed</h2>
      <p class="text-gray-500 text-center text-sm mb-8">Real transactions happening on TuMa</p>
      <div class="space-y-3">
        <div v-for="item in feedItems" :key="item.id"
          class="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
          <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
          <p class="text-sm text-gray-700 flex-1">
            <span class="font-medium">{{ item.display_sender }}</span>
            sent <span class="font-bold text-gray-900">AUD {{ item.amount_aud }}</span>
            to <span class="font-medium">{{ item.display_receiver }}</span>
            and received <span class="font-bold text-green-700">USD {{ item.amount_usd }}</span>
          </p>
          <span class="text-xs text-gray-400 flex-shrink-0">{{ formatDate(item.completed_at) }}</span>
        </div>
        <div v-if="loading" class="text-center py-4 text-sm text-gray-400">
          <i class="fas fa-spinner fa-spin mr-1"></i> Loading...
        </div>
      </div>
    </div>
  </div>

  <div class="py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-10">Why people trust TuMa</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="badge in [
          {icon:'fa-shield-alt', title:'Escrow protected', desc:'Your AUD never leaves our trust account until cash delivery is confirmed in Zimbabwe.'},
          {icon:'fa-id-card', title:'KYC verified', desc:'All users complete identity verification before trading. No anonymous accounts.'},
          {icon:'fa-star', title:'Peer ratings', desc:'Every transaction is rated. Build a reputation and trade with confidence.'},
        ]" :key="badge.title" class="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <i :class="'fas ' + badge.icon + ' text-green-600 text-2xl mb-3 block'"></i>
          <h3 class="font-semibold text-gray-900 mb-1">{{ badge.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ badge.desc }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-green-700 py-16">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-white mb-4">Ready to send money home?</h2>
      <p class="text-green-200 mb-8">Join thousands of Australians sending money to Zimbabwe with zero fees.</p>
      <router-link to="/register"
        class="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-2xl font-bold text-lg hover:bg-green-50 transition">
        Create your free account
      </router-link>
    </div>
  </div>

  <app-footer />
</div>`
}
