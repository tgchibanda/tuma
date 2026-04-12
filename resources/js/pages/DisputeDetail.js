export default {
    name: 'DisputeDetail',
    data() { return { dispute: null, messages: [], loading: true, message: '', sending: false } },
    async mounted() {
        try { await this.load() } catch {}
        this.loading = false
    },
    methods: {
        async load() {
            const id = this.$route.params.id
            const [d, m] = await Promise.all([
                this.$http.get('/disputes/' + id),
                this.$http.get('/disputes/' + id + '/messages').catch(() => ({ data: { data: [] } }))
            ])
            this.dispute  = d.data.data
            this.messages = m.data.data || []
        },
        async send() {
            if (!this.message.trim()) return
            this.sending = true
            try {
                await this.$http.post('/disputes/' + this.dispute.id + '/messages', { message: this.message })
                this.message = ''
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed to send.') }
            this.sending = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <router-link to="/disputes" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
      <i class="fas fa-arrow-left text-xs"></i> Disputes
    </router-link>
    <loading-spinner v-if="loading" />
    <div v-else-if="dispute" class="space-y-5">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <status-badge :status="dispute.status" />
          <span class="text-xs text-gray-500">Opened {{ $fmt.date(dispute.created_at) }}</span>
        </div>
        <h2 class="text-base font-semibold text-gray-900 mb-1">Dispute Reason</h2>
        <p class="text-sm text-gray-600">{{ dispute.reason }}</p>
        <div v-if="dispute.resolution_notes" class="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
          <p class="text-sm font-semibold text-green-800 mb-1">Resolution</p>
          <p class="text-sm text-green-700">{{ dispute.resolution_notes }}</p>
        </div>
      </div>
      <!-- Message thread -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Message Thread</h3>
        </div>
        <div class="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          <div v-for="m in messages" :key="m.id" :class="['px-5 py-4', m.is_admin_message ? 'bg-blue-50' : '']">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['text-xs font-semibold', m.is_admin_message ? 'text-blue-700' : 'text-gray-700']">
                {{ m.is_admin_message ? 'eZimConnect Admin' : (m.sender?.first_name || 'You') }}
              </span>
              <span class="text-xs text-gray-400">{{ $fmt.datetime(m.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ m.message }}</p>
          </div>
          <div v-if="!messages.length" class="px-5 py-8 text-center text-sm text-gray-400">No messages yet.</div>
        </div>
        <!-- Reply -->
        <div v-if="!['resolved_sender','resolved_receiver','refunded','closed'].includes(dispute.status)" class="px-5 py-4 border-t border-gray-100">
          <div class="flex gap-2">
            <input v-model="message" @keyup.enter="send" type="text"
              class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Type your message...">
            <button @click="send" :disabled="sending || !message.trim()"
              class="px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
              <i v-if="sending" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
