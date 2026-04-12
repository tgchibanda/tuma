export default {
    name: 'Referral',
    data() {
        return { user: null, referrals: [], loading: true, copied: false }
    },
    computed: {
        referralLink() {
            if (!this.user) return ''
            return window.location.origin + '/register?ref=' + this.user.referral_code
        },
        qualifiedCount() { return this.referrals.filter(r => r.status === 'qualified' || r.status === 'rewarded').length }
    },
    async mounted() {
        try {
            const [userRes, refRes] = await Promise.all([
                this.$http.get('/user'),
                this.$http.get('/user/referrals').catch(() => ({ data: { data: [] } }))
            ])
            this.user     = userRes.data.data
            this.referrals = refRes.data.data || []
        } catch {}
        this.loading = false
    },
    methods: {
        copy() {
            navigator.clipboard.writeText(this.referralLink)
            this.copied = true
            setTimeout(() => this.copied = false, 2000)
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Refer a Friend</h1>
    <p class="text-gray-500 text-sm mb-6">
      Invite friends to eZimConnect. When they complete their first trade,
      you both get <strong>50% off</strong> the platform fee on your next trade.
    </p>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ user?.referral_count || 0 }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total referrals</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-700">{{ qualifiedCount }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Qualified</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(user?.referral_earnings_aud || 0) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Earned</p>
        </div>
      </div>

      <!-- Referral link -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-base font-semibold text-gray-900 mb-3">Your referral link</h2>
        <div class="flex gap-2">
          <input :value="referralLink" readonly
            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none"
            @click="$event.target.select()">
          <button @click="copy"
            :class="['px-4 py-3 rounded-xl text-sm font-semibold transition flex-shrink-0',
              copied ? 'bg-green-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-800']">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          Referral code: <strong class="font-mono text-gray-600">{{ user?.referral_code }}</strong>
        </p>
      </div>

      <!-- How it works -->
      <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h2 class="text-base font-semibold text-green-900 mb-3">How it works</h2>
        <div class="space-y-2 text-sm text-green-800">
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <p>Share your referral link with a friend in the Australian–Zimbabwean community.</p>
          </div>
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <p>They sign up with your link and complete their first trade on eZimConnect.</p>
          </div>
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <p>Both of you receive a <strong>50% discount</strong> on the platform fee for your next trade.</p>
          </div>
        </div>
      </div>

      <!-- Referral list -->
      <div v-if="referrals.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">Your referrals</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="r in referrals" :key="r.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ r.referred?.display_name || 'Anonymous user' }}</p>
              <p class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</p>
            </div>
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full',
              r.status === 'rewarded' ? 'bg-green-100 text-green-700' :
              r.status === 'qualified' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-500']">
              {{ r.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
