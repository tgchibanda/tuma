export default {
    name: 'AdminUserDetail',
    data() {
        return {
            user: null, documents: [], orders: [], matches: [],
            loading: true, actionLoading: false,
            activeTab: 'overview',
            suspendForm: { reason: '', days: 7 },
            rejectForm:  { reason: '' },
            showSuspendModal: false,
            showRejectModal:  false,
        }
    },
    computed: {
        userId() { return this.$route.params.id }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const [u, docs, ord] = await Promise.all([
                    this.$http.get('/admin/users/' + this.userId),
                    this.$http.get('/admin/users/' + this.userId + '/documents').catch(() => ({ data: { data: [] } })),
                    this.$http.get('/admin/orders', { params: { user_id: this.userId, per_page: 10 } }).catch(() => ({ data: { data: [] } })),
                ])
                this.user      = u.data.data
                this.documents = docs.data.data || []
                this.orders    = ord.data.data  || []
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
            if (!this.suspendForm.reason) { this.$toast.error('Please enter a suspension reason.'); return }
            this.actionLoading = true
            try { await this.$http.put('/admin/users/' + this.userId + '/suspend', { reason: this.suspendForm.reason, days: this.suspendForm.days }); this.$toast.success('User suspended.'); this.showSuspendModal = false; await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
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
        async verifyBusiness() {
            this.actionLoading = true
            try { await this.$http.put('/admin/users/' + this.userId + '/verify-business'); this.$toast.success('Business verified.'); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
            this.actionLoading = false
        },
        statusBadge(s) {
            const m = { active:'bg-green-100 text-green-700', suspended:'bg-orange-100 text-orange-700', banned:'bg-red-100 text-red-700' }
            return m[s] || 'bg-gray-100 text-gray-600'
        },
        kycBadge(s) {
            const m = { approved:'bg-green-100 text-green-700', submitted:'bg-blue-100 text-blue-700', pending:'bg-gray-100 text-gray-600', rejected:'bg-red-100 text-red-700' }
            return m[s] || 'bg-gray-100 text-gray-600'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <admin-nav />

  <!-- Suspend modal -->
  <div v-if="showSuspendModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Suspend user</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason</label>
          <input v-model="suspendForm.reason" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400" placeholder="Reason for suspension">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Duration (days)</label>
          <input v-model="suspendForm.days" type="number" min="1" max="365" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400">
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="suspend" :disabled="actionLoading" class="flex-1 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Suspend
          </button>
          <button @click="showSuspendModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reject KYC modal -->
  <div v-if="showRejectModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Reject KYC</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason for rejection</label>
          <textarea v-model="rejectForm.reason" rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-red-400" placeholder="e.g. Photo is blurry, please resubmit clearer ID"></textarea>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="rejectKyc" :disabled="actionLoading" class="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Reject KYC
          </button>
          <button @click="showRejectModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center gap-2 mb-6">
      <router-link to="/admin/users" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
        <i class="fas fa-arrow-left text-xs"></i> Users
      </router-link>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="user" class="space-y-5">
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-black text-2xl flex-shrink-0">
              {{ user.first_name?.[0]?.toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h1 class="text-xl font-black text-gray-900" style="font-family:Georgia,serif;">{{ user.first_name }} {{ user.last_name }}</h1>
                <span v-if="user.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  <i class="fas fa-check-circle mr-0.5"></i>Business
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ user.email }} · {{ user.phone }}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusBadge(user.account_status)]">
                  {{ user.account_status }}
                </span>
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', kycBadge(user.kyc_status)]">
                  KYC: {{ user.kyc_status }}
                </span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                  Trust: {{ user.trust_score }}
                </span>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
            <button v-if="user.kyc_status === 'submitted'" @click="approveKyc" :disabled="actionLoading"
              class="px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
              <i class="fas fa-check mr-1"></i>Approve KYC
            </button>
            <button v-if="user.kyc_status === 'submitted'" @click="showRejectModal=true"
              class="px-3 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600">
              <i class="fas fa-times mr-1"></i>Reject KYC
            </button>
            <button v-if="user.account_status === 'active'" @click="showSuspendModal=true"
              class="px-3 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600">
              <i class="fas fa-pause mr-1"></i>Suspend
            </button>
            <button v-if="user.account_status === 'suspended'" @click="unsuspend" :disabled="actionLoading"
              class="px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
              <i class="fas fa-play mr-1"></i>Unsuspend
            </button>
            <button v-if="user.account_status !== 'banned'" @click="ban" :disabled="actionLoading"
              class="px-3 py-2 text-xs font-bold bg-red-700 text-white rounded-xl hover:bg-red-800 disabled:opacity-50">
              <i class="fas fa-ban mr-1"></i>Ban
            </button>
            <button v-if="!user.is_verified_business" @click="verifyBusiness" :disabled="actionLoading"
              class="px-3 py-2 text-xs font-bold border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 disabled:opacity-50">
              <i class="fas fa-building mr-1"></i>Verify Business
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-white rounded-2xl border border-gray-200 p-1 shadow-sm">
        <button v-for="tab in [{k:'overview',l:'Overview'},{k:'kyc',l:'KYC Docs'},{k:'orders',l:'Orders'}]"
          :key="tab.k" @click="activeTab = tab.k"
          :class="['flex-1 py-2 text-sm font-semibold rounded-xl transition-colors',
            activeTab === tab.k ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-50']">
          {{ tab.l }}
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid sm:grid-cols-2 gap-5">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Account Details</h3>
          <div class="space-y-2.5 text-sm">
            <div v-for="row in [
              ['User ID',        user.id],
              ['ULID',           user.ulid],
              ['Role',           user.role],
              ['Country',        user.country?.name],
              ['Account type',   user.account_type],
              ['Referral code',  user.referral_code],
              ['Joined',         $fmt.date(user.created_at)],
              ['Last seen',      user.last_seen || 'Unknown'],
            ]" :key="row[0]" class="flex items-center justify-between gap-2">
              <span class="text-gray-500">{{ row[0] }}</span>
              <span class="font-medium text-gray-800 text-right">{{ row[1] || '—' }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Trading Stats</h3>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div v-for="s in [
              {l:'Total trades',    v: user.total_trades},
              {l:'Successful',      v: user.successful_trades},
              {l:'Rating',          v: user.rating ? parseFloat(user.rating).toFixed(1) : '—'},
              {l:'Trust score',     v: user.trust_score},
            ]" :key="s.l" class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xl font-black text-gray-900">{{ s.v }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ s.l }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Email verified</span>
              <span :class="user.email_verified_at ? 'text-green-600 font-semibold' : 'text-red-500'">
                {{ user.email_verified_at ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Phone verified</span>
              <span :class="user.phone_verified_at ? 'text-green-600 font-semibold' : 'text-red-500'">
                {{ user.phone_verified_at ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">2FA enabled</span>
              <span :class="user.two_fa_enabled ? 'text-green-600 font-semibold' : 'text-gray-400'">
                {{ user.two_fa_enabled ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KYC Docs Tab -->
      <div v-if="activeTab === 'kyc'">
        <div v-if="documents.length" class="space-y-3">
          <div v-for="doc in documents" :key="doc.id" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-id-card text-gray-500"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900 capitalize text-sm">{{ doc.document_type.replace(/_/g,' ') }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', kycBadge(doc.status)]">{{ doc.status }}</span>
                  <span class="text-xs text-gray-400">{{ $fmt.date(doc.uploaded_at) }}</span>
                </div>
                <p v-if="doc.rejection_reason" class="text-xs text-red-500 mt-0.5">{{ doc.rejection_reason }}</p>
              </div>
            </div>
            <a :href="'/api/v1/admin/documents/' + doc.id + '/file'" target="_blank"
              class="px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50">
              <i class="fas fa-eye mr-1"></i>View
            </a>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm text-gray-400">
          No KYC documents uploaded yet.
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'">
        <div v-if="orders.length" class="space-y-2.5">
          <router-link v-for="ord in orders" :key="ord.ulid" :to="'/admin/matches'"
            class="block bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span :class="['text-xs font-bold px-2 py-0.5 rounded-lg', ord.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ ord.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
                  </span>
                  <status-badge :status="ord.status" />
                </div>
                <p class="font-bold text-gray-900">{{ $fmt.aud(ord.amount_aud) }} → {{ $fmt.usd(ord.amount_usd) }}</p>
                <p class="text-xs text-gray-400">{{ $fmt.date(ord.created_at) }} · {{ ord.delivery_location?.name }}</p>
              </div>
              <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
            </div>
          </router-link>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-sm text-gray-400">
          No orders found for this user.
        </div>
      </div>
    </div>
  </div>
</div>`
}
