export default {
    name: 'Support',
    data() {
        return {
            tickets: [], loading: true,
            view: 'list', // list | new | detail
            selected: null, selectedMessages: [],
            form: { subject: '', category: 'general', message: '', match_ulid: '' },
            replyText: '',
            saving: false, error: null,
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/support'); this.tickets = data.data || [] } catch {}
            this.loading = false
        },
        async submit() {
            if (!this.form.subject || !this.form.category || !this.form.message) {
                this.error = 'Please fill in all required fields.'; return
            }
            this.saving = true; this.error = null
            try {
                await this.$http.post('/support', this.form)
                this.$toast.success('Ticket submitted. We\'ll respond within 24 hours.')
                this.form = { subject: '', category: 'general', message: '', match_ulid: '' }
                this.view = 'list'; await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed to submit.' }
            this.saving = false
        },
        async openTicket(t) {
            this.selected = t; this.view = 'detail'
            try { const { data } = await this.$http.get('/support/' + t.id); this.selectedMessages = data.data?.messages || [] } catch {}
        },
        async reply() {
            if (!this.replyText.trim()) return
            this.saving = true
            try {
                await this.$http.post('/support/' + this.selected.id + '/reply', { message: this.replyText })
                this.replyText = ''
                await this.openTicket(this.selected)
                this.$toast.success('Reply sent.')
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
            this.saving = false
        },
        statusColor(s) {
            const m = { open:'bg-blue-100 text-blue-700', awaiting_support:'bg-yellow-100 text-yellow-700', awaiting_user:'bg-purple-100 text-purple-700', resolved:'bg-green-100 text-green-700', closed:'bg-gray-100 text-gray-500' }
            return m[s] || 'bg-gray-100 text-gray-600'
        },
        statusLabel(s) {
            const m = { open:'Open', awaiting_support:'Awaiting Support', awaiting_user:'Reply Needed', resolved:'Resolved', closed:'Closed' }
            return m[s] || s
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Support</h1>
        <p class="text-sm text-gray-500 mt-0.5">Get help from the TuMa team.</p>
      </div>
      <button v-if="view === 'list'" @click="view = 'new'"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> New ticket
      </button>
      <button v-else @click="view='list'; selected=null"
        class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <i class="fas fa-arrow-left text-xs"></i> Back
      </button>
    </div>

    <!-- New ticket form -->
    <div v-if="view === 'new'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-base font-bold text-gray-900 mb-4">Submit a support request</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Category <span class="text-red-500">*</span></label>
          <select v-model="form.category"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="general">General Enquiry</option>
            <option value="payment">Payment / Deposit</option>
            <option value="transaction">Transaction Issue</option>
            <option value="account">Account Problem</option>
            <option value="technical">Technical Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Subject <span class="text-red-500">*</span></label>
          <input v-model="form.subject" type="text" placeholder="Brief description of your issue"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Transaction reference <span class="text-gray-400 font-normal">(optional)</span></label>
          <input v-model="form.match_ulid" type="text" placeholder="e.g. TM-A1B2C3D4 or match ULID"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Message <span class="text-red-500">*</span></label>
          <textarea v-model="form.message" rows="5"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Please describe your issue in detail. Include any relevant dates, amounts, and transaction references."></textarea>
        </div>
        <button @click="submit" :disabled="saving"
          class="w-full py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          Submit ticket
        </button>
        <p class="text-xs text-center text-gray-400">Average response time: under 24 hours on business days.</p>
      </div>
    </div>

    <!-- Ticket detail -->
    <div v-else-if="view === 'detail' && selected">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-bold text-gray-900">{{ selected.subject }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ selected.ref }} · {{ $fmt.date(selected.created_at) }}</p>
          </div>
          <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(selected.status)]">
            {{ statusLabel(selected.status) }}
          </span>
        </div>
        <!-- Messages -->
        <div class="space-y-3 mt-4">
          <div v-for="msg in selectedMessages" :key="msg.id"
            :class="['flex', msg.sender_role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="['max-w-sm rounded-2xl px-4 py-3 text-sm',
              msg.sender_role === 'user'
                ? 'bg-green-700 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm']">
              <p class="font-semibold text-xs mb-1 opacity-70">{{ msg.sender_name }}</p>
              <p class="leading-relaxed">{{ msg.message }}</p>
              <p class="text-xs mt-1.5 opacity-60">{{ $fmt.date(msg.created_at) }}</p>
            </div>
          </div>
        </div>
        <!-- Reply -->
        <div v-if="!['resolved','closed'].includes(selected.status)" class="mt-4 pt-4 border-t border-gray-100">
          <textarea v-model="replyText" rows="3"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-2"
            placeholder="Type your reply..."></textarea>
          <button @click="reply" :disabled="saving || !replyText.trim()"
            class="w-full py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i> Send reply
          </button>
        </div>
        <div v-else class="mt-4 pt-3 border-t border-gray-100 text-center text-sm text-gray-400">
          This ticket is {{ selected.status }}. Open a new ticket if you need more help.
        </div>
      </div>
    </div>

    <!-- Tickets list -->
    <div v-else>
      <loading-spinner v-if="loading" />
      <div v-else-if="tickets.length" class="space-y-3">
        <div v-for="t in tickets" :key="t.id"
          @click="openTicket(t)"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition-shadow">
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0', statusColor(t.status)]">
                  {{ statusLabel(t.status) }}
                </span>
                <p class="font-semibold text-gray-900 truncate text-sm">{{ t.subject }}</p>
              </div>
              <p class="text-xs text-gray-400">{{ t.ref }} · {{ $fmt.date(t.updated_at) }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0"></i>
          </div>
        </div>
      </div>
      <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <i class="fas fa-headset text-4xl text-gray-300 mb-3 block"></i>
        <p class="font-semibold text-gray-600 mb-1">No support tickets</p>
        <p class="text-sm text-gray-400 mb-4">Need help? Our team is here for you.</p>
        <button @click="view = 'new'"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-plus"></i> Submit a ticket
        </button>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
