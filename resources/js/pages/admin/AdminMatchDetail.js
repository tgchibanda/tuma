export default {
    name: 'AdminMatchDetail',
    data() { return { match: null, loading: true, actionLoading: false, error: null } },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/../../api/admin/matches/' + this.$route.params.ulid)
                this.match = data.data
            } catch { this.$router.push('/admin/matches') }
            this.loading = false
        },
        async verifyDeposit() {
            if (!confirm('Confirm AUD deposit has arrived in the TuMa bank account?')) return
            this.actionLoading = true
            try {
                await this.$http.put('/../../api/admin/matches/' + this.match.ulid + '/verify-deposit')
                this.$toast.success('Deposit verified. Deliverer notified.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async releaseFunds() {
            if (!confirm('Confirm you have sent AUD to the receiver\'s bank account?')) return
            this.actionLoading = true
            try {
                await this.$http.put('/../../api/admin/matches/' + this.match.ulid + '/release-funds')
                this.$toast.success('Funds released. Transaction completed!')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async refund() {
            const reason = prompt('Reason for refund:')
            if (!reason) return
            this.actionLoading = true
            try {
                await this.$http.put('/../../api/admin/matches/' + this.match.ulid + '/refund', { reason })
                this.$toast.success('Refund processed.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async forceCancel() {
            const reason = prompt('Reason for force-cancelling:')
            if (!reason) return
            this.actionLoading = true
            try {
                await this.$http.put('/../../api/admin/matches/' + this.match.ulid + '/force-cancel', { reason })
                this.$toast.success('Match force-cancelled.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        }
    },
    template: `<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/matches" class="text-gray-400 hover:text-gray-700"><i class="fas fa-arrow-left"></i></router-link>
    <div class="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
      <span class="text-white font-bold text-xs">Tu</span>
    </div>
    <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
    <span class="text-gray-400 mx-1">›</span>
    <span class="text-sm text-gray-600">Match Detail</span>
  </div>

  <div class="max-w-6xl mx-auto px-6 py-6">
    <loading-spinner v-if="loading" />
    <div v-else-if="match" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Summary + Actions -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <status-badge :status="match.status" />
            <span class="font-mono text-xs text-gray-400">{{ match.ulid?.slice(0,12) }}</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ match.agreed_aud ? $fmt.aud(match.agreed_aud) : 'Negotiating' }}</p>
          <p v-if="match.agreed_usd" class="text-sm text-gray-500">↔ {{ $fmt.usd(match.agreed_usd) }}</p>
          <div class="mt-3 text-sm space-y-1.5">
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="font-medium capitalize">{{ match.delivery_method }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Fee</span><span>{{ match.platform_fee_aud ? $fmt.aud(match.platform_fee_aud) : '—' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Ref</span><span class="font-mono text-xs">{{ match.deposit_reference }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Location</span><span>{{ match.location?.name }}</span></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Actions</h3>

          <button v-if="match.available_actions?.can_verify_deposit"
            @click="verifyDeposit" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
            <i class="fas fa-check mr-1"></i> Verify Deposit
          </button>

          <button v-if="match.available_actions?.can_release_funds"
            @click="releaseFunds" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i class="fas fa-hand-holding-usd mr-1"></i> Release Funds
          </button>

          <button v-if="match.available_actions?.can_refund"
            @click="refund" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-medium border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50">
            <i class="fas fa-undo mr-1"></i> Refund to Sender
          </button>

          <button v-if="match.available_actions?.can_force_cancel"
            @click="forceCancel" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
            <i class="fas fa-times mr-1"></i> Force Cancel
          </button>
        </div>

        <!-- Parties -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Parties</h3>
          <div v-if="match.sender" class="mb-3 pb-3 border-b border-gray-50">
            <p class="text-xs text-gray-400 mb-0.5">Sender (AUD depositor)</p>
            <p class="text-sm font-medium text-gray-900">{{ match.sender.name }}</p>
            <p class="text-xs text-gray-500">{{ match.sender.email }}</p>
            <router-link :to="'/admin/users/'+match.sender.id" class="text-xs text-green-700 hover:underline">View profile →</router-link>
          </div>
          <div v-if="match.receiver">
            <p class="text-xs text-gray-400 mb-0.5">Receiver (cash deliverer)</p>
            <p class="text-sm font-medium text-gray-900">{{ match.receiver.name }}</p>
            <p class="text-xs text-gray-500">{{ match.receiver.email }}</p>
            <router-link :to="'/admin/users/'+match.receiver.id" class="text-xs text-green-700 hover:underline">View profile →</router-link>
          </div>
        </div>
      </div>

      <!-- Right: Details -->
      <div class="md:col-span-2 space-y-5">

        <!-- Deposit proof -->
        <div v-if="match.deposit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-file-invoice-dollar text-blue-600"></i> Deposit Proof
          </h3>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Status</span>
            <span :class="['font-semibold capitalize', match.deposit.status==='verified'?'text-green-700':match.deposit.status==='pending'?'text-yellow-600':'text-gray-700']">
              {{ match.deposit.status }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Amount</span><span class="font-medium">{{ $fmt.aud(match.deposit.amount_aud) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Our reference</span>
            <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{{ match.deposit.our_bank_reference }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-4">
            <span class="text-gray-600">Their reference</span>
            <span class="text-gray-800">{{ match.deposit.depositor_reference || '—' }}</span>
          </div>
          <a v-if="match.deposit.proof_url" :href="match.deposit.proof_url" target="_blank"
            class="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
            <i class="fas fa-image text-blue-500"></i> View Proof Image
          </a>
        </div>

        <!-- Delivery proof — two photos side by side -->
        <div v-if="match.delivery" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-money-bill-wave text-green-600"></i> Delivery Proof
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal ml-1">
              Agreed: {{ $fmt.usd(match.delivery.amount_usd) }}
            </span>
          </h3>
          <div class="text-sm space-y-1.5 mb-4">
            <div class="flex justify-between"><span class="text-gray-500">Status</span>
              <span :class="['font-semibold capitalize', match.delivery.status==='confirmed'?'text-green-700':'text-yellow-600']">{{ match.delivery.status }}</span>
            </div>
            <div class="flex justify-between"><span class="text-gray-500">Recipient</span><span>{{ match.delivery.recipient_name }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Phone</span><span>{{ match.delivery.recipient_phone }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Location</span><span>{{ match.delivery.location?.name }}</span></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <a v-if="match.delivery.recipient_id_photo_url" :href="match.delivery.recipient_id_photo_url" target="_blank"
              class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-center">
              <i class="fas fa-id-card text-2xl text-blue-400"></i>
              <span class="text-xs text-gray-600 font-medium">Recipient ID</span>
              <span class="text-xs text-green-700">View Photo</span>
            </a>
            <a v-if="match.delivery.handover_amount_photo_url" :href="match.delivery.handover_amount_photo_url" target="_blank"
              class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-center">
              <i class="fas fa-money-bill text-2xl text-green-400"></i>
              <span class="text-xs text-gray-600 font-medium">Cash Handover</span>
              <span class="text-xs text-green-700">View Photo</span>
            </a>
            <a v-if="match.delivery.combined_photo_url" :href="match.delivery.combined_photo_url" target="_blank"
              class="col-span-2 flex items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <i class="fas fa-camera text-2xl text-purple-400"></i>
              <div>
                <p class="text-xs font-medium text-gray-700">Combined Verification Photo</p>
                <p class="text-xs text-green-700">Click to view</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Negotiation history -->
        <div v-if="match.negotiations && match.negotiations.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-comments text-gray-400"></i> Negotiation History
          </h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="n in match.negotiations" :key="n.created_at"
              class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm">
              <div class="flex-1">
                <span class="font-medium text-gray-800">{{ n.proposed_by }}</span>
                <span class="text-gray-500 ml-2">proposed</span>
                <span class="font-bold text-gray-900 ml-1">{{ $fmt.aud(n.proposed_aud) }} ↔ {{ $fmt.usd(n.proposed_usd) }}</span>
                <p v-if="n.message" class="text-xs text-gray-500 mt-1">{{ n.message }}</p>
              </div>
              <span :class="['text-xs px-2 py-0.5 rounded-full',
                n.status==='accepted'?'bg-green-100 text-green-700':n.status==='countered'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600']">
                {{ n.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dispute -->
        <div v-if="match.dispute" class="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 class="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-red-500"></i> Active Dispute
          </h3>
          <p class="text-sm text-red-700 mb-3">{{ match.dispute.reason }}</p>
          <router-link :to="'/admin/disputes/'+match.dispute.id"
            class="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline">
            View & Resolve Dispute →
          </router-link>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Progress Timeline</h3>
          <status-timeline :match="match" />
        </div>
      </div>
    </div>
  </div>
</div>`
}
