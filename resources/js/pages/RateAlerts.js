export default {
    name: 'RateAlerts',
    data() { return { alerts: [], loading: true, form: { target_rate: '', direction: 'above', notify_once: true }, saving: false, showForm: false, error: null, currentRate: null } },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const [alerts, rate] = await Promise.all([
                    this.$http.get('/rate-alerts'),
                    this.$http.get('/exchange-rates/AUD/USD')
                ])
                this.alerts      = alerts.data.data || []
                this.currentRate = rate.data.data
            } catch {}
            this.loading = false
        },
        async addAlert() {
            this.saving = true; this.error = null
            try {
                await this.$http.post('/rate-alerts', { from_currency: 'AUD', to_currency: 'USD', ...this.form })
                this.$toast.success('Rate alert created!')
                this.showForm = false; this.form = { target_rate: '', direction: 'above', notify_once: true }
                await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed.' }
            this.saving = false
        },
        async toggle(alert) {
            try { await this.$http.put('/rate-alerts/' + alert.id, { is_active: !alert.is_active }); await this.load() } catch {}
        },
        async remove(id) {
            if (!confirm('Delete this alert?')) return
            try { await this.$http.delete('/rate-alerts/' + id); await this.load() } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Rate Alerts</h1>
        <p v-if="currentRate" class="text-sm text-gray-500 mt-0.5">
          Current rate: <strong class="text-green-700">{{ parseFloat(currentRate.rate).toFixed(4) }}</strong> AUD/USD
        </p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Add alert
      </button>
    </div>
    <!-- Add form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">New Rate Alert</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Target rate (AUD/USD)</label>
          <input v-model="form.target_rate" type="number" step="0.0001" min="0.0001"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. 0.6500">
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Alert me when rate is</label>
          <select v-model="form.direction" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="above">Above target</option>
            <option value="below">Below target</option>
          </select>
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
        <input v-model="form.notify_once" type="checkbox" class="w-4 h-4 text-green-600 rounded">
        Notify once then deactivate
      </label>
      <div class="flex gap-2">
        <button @click="addAlert" :disabled="saving || !form.target_rate"
          class="flex-1 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i>Create alert
        </button>
        <button @click="showForm = false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="alerts.length" class="space-y-3">
      <div v-for="a in alerts" :key="a.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-gray-900">
              AUD/USD {{ a.direction === 'above' ? 'rises above' : 'drops below' }}
              <span class="text-green-700">{{ parseFloat(a.target_rate).toFixed(4) }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ a.is_active ? 'Active' : 'Inactive' }}
              <span v-if="a.triggered_at"> &middot; Triggered {{ $fmt.date(a.triggered_at) }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggle(a)" :class="['relative inline-flex w-10 h-5 rounded-full transition-colors', a.is_active ? 'bg-green-600' : 'bg-gray-200']">
              <span :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', a.is_active ? 'translate-x-5' : 'translate-x-0']"></span>
            </button>
            <button @click="remove(a.id)" class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-chart-line" title="No rate alerts" subtitle="Create an alert to be notified when the AUD/USD rate reaches your target." />
  </div>
  <app-footer />
</div>`
}
