export default {
  name: 'AdminUserDetail',
  data() {
    return {
      user: null, documents: [], bankAccounts: [], recentMatches: [],
      reviews: [], loginActivity: [], badges: [],
      loading: true, actionLoading: false,
      activeTab: 'overview',
      suspendForm: { reason: '', days: 7 },
      rejectForm: { reason: '' },
      showSuspendModal: false,
      showRejectModal: false,
    }
  },
  computed: {
    userId() { return this.$route.params.id }
  },
  async mounted() { await this.load() },
  methods: {
    async viewDocument(id) {
      try {
        const { data } = await this.$http.get(
          `/admin/documents/${id}/file`,
          { responseType: 'blob' }
        )

        const link = document.createElement('a')
        link.href = URL.createObjectURL(data)
        link.target = '_blank'
        link.click()

      } catch (e) {
        console.error(e)
        this.$toast?.error?.('Failed to open document')
      }
    },
    async load() {
      this.loading = true
      try {
        const { data } = await this.$http.get('/admin/users/' + this.userId)
        // API returns data.data = { user, documents, bank_accounts, recent_matches, reviews, login_activity, badges }
        const d = data.data
        this.user = d.user
        this.documents = d.documents || []
        this.bankAccounts = d.bank_accounts || []
        this.recentMatches = d.recent_matches || []
        this.reviews = d.reviews || []
        this.loginActivity = d.login_activity || []
        this.badges = d.badges || []
      } catch { this.$router.push('/admin/users') }
      this.loading = false
    },
    async approveKyc() {
      if (!confirm('Approve KYC for ' + this.user.first_name + '?')) return
      this.actionLoading = true
      try { await this.$http.put('/admin/users/' + this.userId + '/kyc/approve'); this.$toast.success('KYC approved.'); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
      this.actionLoading = false
    },
    async rejectKyc() {
      if (!this.rejectForm.reason) { this.$toast.error('Please enter a rejection reason.'); return }
      this.actionLoading = true
      try { await this.$http.put('/admin/users/' + this.userId + '/kyc/reject', { reason: this.rejectForm.reason }); this.$toast.success('KYC rejected.'); this.showRejectModal = false; await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
      this.actionLoading = false
    },
    async suspend() {
      if (!this.suspendForm.reason) { this.$toast.error('Please enter a reason.'); return }
      this.actionLoading = true
      try { await this.$http.put('/admin/users/' + this.userId + '/suspend', this.suspendForm); this.$toast.success('User suspended.'); this.showSuspendModal = false; await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
      this.actionLoading = false
    },
    async unsuspend() {
      if (!confirm('Unsuspend this user?')) return
      this.actionLoading = true
      try { await this.$http.put('/admin/users/' + this.userId + '/unsuspend'); this.$toast.success('User unsuspended.'); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
      this.actionLoading = false
    },
    async ban() {
      if (!confirm('PERMANENTLY BAN this user? This cannot be undone.')) return
      this.actionLoading = true
      try { await this.$http.put('/admin/users/' + this.userId + '/ban'); this.$toast.success('User banned.'); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
      this.actionLoading = false
    },
    statusBadge(s) {
      const m = { active: 'bg-green-100 text-green-700', suspended: 'bg-orange-100 text-orange-700', banned: 'bg-red-100 text-red-700' }
      return m[s] || 'bg-gray-100 text-gray-600'
    },
    kycBadge(s) {
      const m = { approved: 'bg-green-100 text-green-700', submitted: 'bg-blue-100 text-blue-700', pending: 'bg-gray-100 text-gray-600', rejected: 'bg-red-100 text-red-700' }
      return m[s] || 'bg-gray-100 text-gray-600'
    },
    matchStatusColor(s) {
      if (['completed'].includes(s)) return 'bg-green-100 text-green-700'
      if (['cancelled', 'expired', 'refunded', 'disputed'].includes(s)) return 'bg-red-100 text-red-700'
      return 'bg-blue-100 text-blue-700'
    }
  },
  template: `
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />

  <!-- Suspend modal -->
  <div v-if="showSuspendModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Suspend account</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason <span class="text-red-500">*</span></label>
          <input v-model="suspendForm.reason" type="text" placeholder="e.g. Suspicious activity"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Duration (days)</label>
          <input v-model.number="suspendForm.days" type="number" min="1" max="365"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="suspend" :disabled="actionLoading" class="flex-1 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Suspend
          </button>
          <button @click="showSuspendModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reject KYC modal -->
  <div v-if="showRejectModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Reject KYC</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason for rejection <span class="text-red-500">*</span></label>
          <textarea v-model="rejectForm.reason" rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-red-400"
            placeholder="e.g. Photo is blurry — please resubmit a clearer ID photo"></textarea>
        </div>
        <div class="flex gap-2">
          <button @click="rejectKyc" :disabled="actionLoading" class="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Reject KYC
          </button>
          <button @click="showRejectModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="flex items-center gap-2 mb-5 text-sm">
      <router-link to="/admin/users" class="text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> Users
      </router-link>
      <span class="text-gray-300">/</span>
      <span v-if="user" class="text-gray-700 font-medium">{{ user.first_name }} {{ user.last_name }}</span>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="user" class="space-y-5">

      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460)">
              {{ user.first_name ? user.first_name[0].toUpperCase() : '?' }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h1 class="text-xl font-black text-gray-900">{{ user.first_name }} {{ user.last_name }}</h1>
                <span v-if="user.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  <i class="fas fa-check-circle mr-0.5"></i>Business
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <p class="text-sm text-gray-400">{{ user.phone }}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', statusBadge(user.account_status)]">
                  {{ user.account_status }}
                </span>
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', kycBadge(user.kyc_status)]">
                  KYC: {{ user.kyc_status }}
                </span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                  Trust: {{ user.trust_score }}
                </span>
                <span class="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                  {{ user.account_type || 'personal' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap gap-2">
            <template v-if="user.kyc_status === 'submitted'">
              <button @click="approveKyc" :disabled="actionLoading"
                class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
                <i class="fas fa-check"></i> Approve KYC
              </button>
              <button @click="showRejectModal=true"
                class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600">
                <i class="fas fa-times"></i> Reject KYC
              </button>
            </template>
            <button v-if="user.account_status === 'active'" @click="showSuspendModal=true"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600">
              <i class="fas fa-pause"></i> Suspend
            </button>
            <button v-if="user.account_status === 'suspended'" @click="unsuspend" :disabled="actionLoading"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
              <i class="fas fa-play"></i> Unsuspend
            </button>
            <button v-if="user.account_status !== 'banned'" @click="ban" :disabled="actionLoading"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-red-800 text-white rounded-xl hover:bg-red-900 disabled:opacity-50">
              <i class="fas fa-ban"></i> Ban
            </button>
          </div>
        </div>

        <!-- Suspension info -->
        <div v-if="user.account_status === 'suspended' && user.suspension_reason"
          class="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm text-orange-800">
          <i class="fas fa-exclamation-triangle mr-1.5"></i>
          <strong>Suspended:</strong> {{ user.suspension_reason }}
          <span v-if="user.account_suspended_until"> · Until {{ $fmt.date(user.account_suspended_until) }}</span>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="s in [
          {l:'Total Trades',     v: user.total_trades},
          {l:'Successful',       v: user.successful_trades},
          {l:'Rating',           v: user.rating ? parseFloat(user.rating).toFixed(1) + ' ★' : '—'},
          {l:'Trust Score',      v: user.trust_score},
        ]" :key="s.l" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <p class="text-2xl font-black text-gray-900 mb-0.5">{{ s.v }}</p>
          <p class="text-xs text-gray-500">{{ s.l }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-white rounded-2xl border border-gray-200 p-1 shadow-sm overflow-x-auto">
        <button v-for="tab in [
          {k:'overview',  l:'Overview'},
          {k:'kyc',       l:'KYC Docs (' + documents.length + ')'},
          {k:'bank',      l:'Bank Accounts'},
          {k:'matches',   l:'Matches (' + recentMatches.length + ')'},
          {k:'reviews',   l:'Reviews (' + reviews.length + ')'},
          {k:'activity',  l:'Login Activity'},
        ]" :key="tab.k" @click="activeTab = tab.k"
          :class="['flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap',
            activeTab === tab.k
              ? 'text-white'
              : 'text-gray-600 hover:bg-gray-50']"
          :style="activeTab === tab.k ? 'background:linear-gradient(135deg,#1a6b3c,#2d9460)' : ''">
          {{ tab.l }}
        </button>
      </div>

      <!-- Overview tab -->
      <div v-if="activeTab === 'overview'" class="grid sm:grid-cols-2 gap-5">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-user text-green-600"></i> Account Details
          </h3>
          <div class="space-y-2.5">
            <div v-for="row in [
              ['User ID',           '#' + user.id],
              ['Country',           user.country || '—'],
              ['Last seen',         user.last_seen || '—'],
              ['Last login',        user.last_login_at ? $fmt.date(user.last_login_at) : '—'],
              ['Member since',      $fmt.date(user.created_at)],
              ['Referral code',     user.referral_code || '—'],
              ['Referrals made',    user.referral_count || 0],
              ['Business name',     user.business_name || '—'],
              ['Reports against',   user.report_count || 0],
            ]" :key="row[0]" class="flex items-center justify-between gap-2 text-sm">
              <span class="text-gray-500">{{ row[0] }}</span>
              <span class="font-semibold text-gray-800 text-right">{{ row[1] }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-shield-alt text-green-600"></i> Verification Status
          </h3>
          <div class="space-y-2.5 text-sm">
            <div v-for="row in [
              ['Email verified',   user.email_verified],
              ['Phone verified',   user.phone_verified],
              ['2FA enabled',      user.two_fa_enabled],
              ['PIN set',          user.pin_set],
              ['Onboarding done',  user.onboarding_completed],
            ]" :key="row[0]" class="flex items-center justify-between gap-2">
              <span class="text-gray-500">{{ row[0] }}</span>
              <span :class="row[1] ? 'text-green-600 font-bold' : 'text-gray-400'">
                <i :class="row[1] ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ row[1] ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
          <!-- Badges -->
          <div v-if="badges.length" class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs font-bold text-gray-500 mb-2">BADGES EARNED</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="b in badges" :key="b.badge_key"
                class="flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded-full"
                :title="b.badge_name">
                {{ b.badge_icon }} {{ b.badge_name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KYC Documents tab -->
      <div v-if="activeTab === 'kyc'">
        <div v-if="documents.length" class="space-y-3">
          <div v-for="doc in documents" :key="doc.id"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-id-card text-gray-500"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm capitalize">{{ doc.document_type.replace(/_/g,' ') }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', kycBadge(doc.status)]">
                    {{ doc.status }}
                  </span>
                  <span class="text-xs text-gray-400">{{ $fmt.date(doc.created_at) }}</span>
                </div>
                <p v-if="doc.rejection_reason" class="text-xs text-red-500 mt-0.5">{{ doc.rejection_reason }}</p>
              </div>
            </div>
            <a href="#"
              @click.prevent="viewDocument(doc.id)"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50">
              <i class="fas fa-eye"></i> View
            </a>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No KYC documents uploaded yet.
        </div>
      </div>

      <!-- Bank Accounts tab -->
      <div v-if="activeTab === 'bank'">
        <div v-if="bankAccounts.length" class="space-y-3">
          <div v-for="acc in bankAccounts" :key="acc.id"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-university text-blue-600"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-gray-900 text-sm">{{ acc.bank_name }}</p>
                  <span v-if="acc.is_primary" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
                  <span v-if="acc.is_verified" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                </div>
                <p class="text-sm text-gray-600">{{ acc.account_name }}</p>
                <p class="text-xs text-gray-400">
                  <span v-if="acc.bsb_code">BSB {{ acc.bsb_code }} · </span>
                  ····{{ acc.account_number }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No bank accounts on file.
        </div>
      </div>

      <!-- Matches tab -->
      <div v-if="activeTab === 'matches'">
        <div v-if="recentMatches.length" class="space-y-2.5">
          <div v-for="m in recentMatches" :key="m.ulid"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold', matchStatusColor(m.status)]">
                  {{ m.status.replace(/_/g,' ') }}
                </span>
                <span class="text-xs text-gray-400">{{ $fmt.date(m.created_at) }}</span>
              </div>
              <p class="font-bold text-gray-900 text-sm">
                {{ m.agreed_aud ? 'AUD ' + parseFloat(m.agreed_aud).toFixed(2) : 'AUD —' }}
                → {{ m.agreed_usd ? 'USD ' + parseFloat(m.agreed_usd).toFixed(2) : 'USD —' }}
              </p>
            </div>
            <router-link :to="'/admin/matches/' + m.ulid"
              class="text-xs text-green-700 font-semibold hover:underline flex-shrink-0">
              View →
            </router-link>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No recent matches.
        </div>
      </div>

      <!-- Reviews tab -->
      <div v-if="activeTab === 'reviews'">
        <div v-if="reviews.length" class="space-y-3">
          <div v-for="(r, i) in reviews" :key="i"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-1">
                <i v-for="s in 5" :key="s"
                  :class="['fas fa-star text-sm', s <= r.score ? 'text-yellow-400' : 'text-gray-200']"></i>
                <span class="text-sm font-bold text-gray-700 ml-1">{{ r.score }}/5</span>
              </div>
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <p v-if="r.review_text" class="text-sm text-gray-600 italic">"{{ r.review_text }}"</p>
            <p class="text-xs text-gray-400 mt-1">by {{ r.reviewer }}</p>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No reviews yet.
        </div>
      </div>

      <!-- Login Activity tab -->
      <div v-if="activeTab === 'activity'">
        <div v-if="loginActivity.length" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">IP Address</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Location</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Device</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(l, i) in loginActivity" :key="i" class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-600">{{ $fmt.date(l.login_at) }}</td>
                <td class="py-3 px-4 font-mono text-xs text-gray-700">{{ l.ip_address }}</td>
                <td class="py-3 px-4 text-gray-600">{{ l.location || '—' }}</td>
                <td class="py-3 px-4">
                  <span class="text-gray-500 capitalize">{{ l.device_type || '—' }}</span>
                  <span v-if="l.is_new_device" class="ml-1.5 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">New device</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No login activity recorded.
        </div>
      </div>

    </div><!-- end user div -->
  </div>
</div>`
}
