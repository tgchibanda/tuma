export default {
    name: 'AdminDisputeDetail',
    data() { return { dispute: null, loading: true, msg: '', msgLoading: false, resolveLoading: false, resolveNotes: '' } },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/../../api/admin/disputes/' + this.$route.params.id)
                this.dispute = data.data
            } catch { this.$router.push('/admin/disputes') }
            this.loading = false
        },
        async sendMessage() {
            if (!this.msg.trim()) return
            this.msgLoading = true
            try {
                await this.$http.post('/../../api/admin/disputes/' + this.dispute.id + '/messages', { message: this.msg })
                this.msg = ''
                this.$toast.success('Message sent.')
                await this.load()
            } catch { this.$toast.error('Failed to send message.') }
            this.msgLoading = false
        },
        async resolve(resolution) {
            const notes = this.resolveNotes || prompt('Resolution notes (required):')
            if (!notes) return
            this.resolveLoading = true
            try {
                await this.$http.put('/../../api/admin/disputes/' + this.dispute.id + '/resolve', { resolution, notes })
                this.$toast.success('Dispute resolved.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.resolveLoading = false
        }
    },
    template: `<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/disputes" class="text-gray-400 hover:text-gray-700"><i class="fas fa-arrow-left"></i></router-link>
    <img src="/images/logo-icon.svg" alt="eZimConnect" class="h-7 w-auto">
    <span class="font-bold text-gray-900 text-sm">Admin</span>
    <span class="text-gray-400 mx-1">›</span>
    <span class="text-sm text-gray-600">Dispute #{{ $route.params.id }}</span>
  </div>

  <div class="max-w-5xl mx-auto px-6 py-6">
    <loading-spinner v-if="loading" />
    <div v-else-if="dispute" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Info + Resolve -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <status-badge :status="dispute.status" />
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full',
              dispute.urgency==='critical'?'bg-red-100 text-red-700':dispute.urgency==='high'?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-600']">
              {{ dispute.urgency }}
            </span>
          </div>
          <p class="text-sm font-medium text-gray-800 mb-1">Raised {{ dispute.hours_open }}h ago</p>
          <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{{ dispute.reason }}</p>
        </div>

        <div v-if="dispute.match" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Transaction</h3>
          <div class="text-sm space-y-1.5">
            <div class="flex justify-between"><span class="text-gray-500">Amount</span><span class="font-bold">{{ $fmt.aud(dispute.match.agreed_aud) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="capitalize">{{ dispute.match.delivery_method }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Deposit</span><span class="capitalize">{{ dispute.match.deposit_status }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="capitalize">{{ dispute.match.delivery_status }}</span></div>
          </div>
          <router-link :to="'/admin/matches/'+dispute.match_ulid" class="text-xs text-green-700 hover:underline block mt-3">View match →</router-link>
          <div class="flex gap-2 mt-3">
            <a v-if="dispute.match.proof_url" :href="dispute.match.proof_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Deposit Proof</a>
            <a v-if="dispute.match.delivery_id_photo_url" :href="dispute.match.delivery_id_photo_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">ID Photo</a>
            <a v-if="dispute.match.delivery_handover_url" :href="dispute.match.delivery_handover_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Handover</a>
          </div>
        </div>

        <!-- Resolve -->
        <div v-if="['open','under_review'].includes(dispute.status)" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Resolve Dispute</h3>
          <textarea v-model="resolveNotes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 resize-none focus:outline-none focus:border-green-500" placeholder="Resolution notes…"></textarea>
          <div class="space-y-2">
            <button @click="resolve('receiver')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50">
              <i class="fas fa-hand-holding-usd mr-1"></i> Favour Receiver (release funds)
            </button>
            <button @click="resolve('refund')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-medium border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50">
              <i class="fas fa-undo mr-1"></i> Refund Sender
            </button>
            <button @click="resolve('sender')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50">
              Favour Sender (no payment to receiver)
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Message thread -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style="height:600px">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 class="text-sm font-semibold text-gray-900">Message Thread</h3>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="msg in (dispute.messages||[])" :key="msg.id"
              :class="['p-3 rounded-xl text-sm', msg.is_admin_message?'bg-green-50 ml-8':'bg-gray-50 mr-8']">
              <div class="flex justify-between items-start mb-1">
                <span :class="['font-medium', msg.is_admin_message?'text-green-800':'text-gray-800']">
                  <i v-if="msg.is_admin_message" class="fas fa-shield-alt mr-1 text-xs"></i>
                  {{ msg.sender?.name }}
                  <span class="text-xs font-normal text-gray-400 ml-1">{{ msg.sender?.role }}</span>
                </span>
                <span class="text-xs text-gray-400">{{ msg.created_at ? new Date(msg.created_at).toLocaleString() : '' }}</span>
              </div>
              <p class="text-gray-700">{{ msg.message }}</p>
            </div>
          </div>
          <div v-if="['open','under_review'].includes(dispute.status)" class="p-3 border-t border-gray-200 flex gap-2">
            <input v-model="msg" type="text" @keyup.enter="sendMessage"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              placeholder="Send message to both parties…">
            <button @click="sendMessage" :disabled="msgLoading || !msg.trim()"
              class="px-4 py-2 bg-green-700 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-green-800">
              <i v-if="msgLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
