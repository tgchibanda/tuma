export default {
    name: 'AdminRates',
    data() {
        return {
            rates: [], loading: true,
            form: { from_currency: 'AUD', to_currency: 'USD', rate: '' },
            saving: false, error: null, showForm: false,
        }
    },
    computed: {
        currentRate() { return this.rates.find(r => r.is_active) }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/admin/exchange-rates'); this.rates = data.data || [] } catch {}
            this.loading = false
        },
        async save() {
            if (!this.form.rate || parseFloat(this.form.rate) <= 0) { this.error = 'Please enter a valid rate.'; return }
            this.saving = true; this.error = null
            try {
                await this.$http.post('/admin/exchange-rates', { ...this.form, rate: parseFloat(this.form.rate) })
                this.$toast.success('New rate activated. Previous rate deactivated.')
                this.form.rate = ''; this.showForm = false; await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed.' }
            this.saving = false
        },
        async deactivate(id) {
            if (!confirm('Deactivate this rate?')) return
            try { await this.$http.put('/admin/exchange-rates/' + id + '/deactivate'); await this.load() } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <admin-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Exchange Rates</h1>
        <p class="text-sm text-gray-500 mt-0.5">Set the AUD/USD rate used for all new orders and calculators.</p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Set new rate
      </button>
    </div>

    <!-- Current rate hero -->
    <div v-if="currentRate" class="rounded-3xl p-6 mb-5 text-white" style="background:linear-gradient(135deg,#0d4a28,#1a6b3c);">
      <p class="text-sm font-semibold text-green-200 mb-1">Current active rate</p>
      <p class="text-5xl font-black mb-1" style="font-family:Georgia,serif;">{{ parseFloat(currentRate.rate).toFixed(4) }}</p>
      <p class="text-green-200 text-sm">AUD 1 = USD {{ parseFloat(currentRate.rate).toFixed(4) }}</p>
      <p class="text-green-300 text-xs mt-2">Set {{ $fmt.date(currentRate.set_at) }}</p>
    </div>
    <div v-else class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 text-sm text-orange-700">
      <i class="fas fa-exclamation-triangle mr-2"></i>No active exchange rate set. Users cannot create orders until a rate is set.
    </div>

    <!-- Set new rate form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <h3 class="text-base font-bold text-gray-900 mb-4">Set new AUD/USD rate</h3>
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-800">
        <i class="fas fa-exclamation-circle mr-1"></i>
        Setting a new rate will immediately deactivate the current rate. All new orders will use the new rate.
        Existing agreed matches are unaffected.
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="flex gap-3 items-end">
        <div class="flex-1">
          <label class="text-sm font-semibold text-gray-700 block mb-1">New AUD/USD rate</label>
          <input v-model="form.rate" type="number" step="0.0001" min="0.0001"
            @keyup.enter="save"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:border-green-500"
            placeholder="e.g. 0.6350">
          <p class="text-xs text-gray-400 mt-1">
            <span v-if="form.rate && parseFloat(form.rate) > 0">
              AUD 500 → USD {{ (500 * 0.985 * parseFloat(form.rate || 0)).toFixed(2) }} (after 0.5% fee)
            </span>
          </p>
        </div>
        <button @click="save" :disabled="saving || !form.rate"
          class="px-5 py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          Activate rate
        </button>
        <button @click="showForm=false" class="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>

    <!-- Rate history -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">Rate History</h3>
        <span class="text-xs text-gray-400">{{ rates.length }} entries</span>
      </div>
      <loading-spinner v-if="loading" />
      <div v-else class="divide-y divide-gray-50">
        <div v-for="r in rates" :key="r.id" class="flex items-center justify-between px-5 py-3.5 gap-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="r.is_active ? 'bg-green-100' : 'bg-gray-100'">
              <i class="fas fa-chart-line text-sm" :class="r.is_active ? 'text-green-600' : 'text-gray-400'"></i>
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ parseFloat(r.rate).toFixed(4) }} <span class="text-xs text-gray-500 font-normal">AUD/USD</span></p>
              <p class="text-xs text-gray-400">{{ $fmt.date(r.set_at) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ r.is_active ? 'Active' : 'Inactive' }}
            </span>
            <button v-if="r.is_active" @click="deactivate(r.id)"
              class="text-xs text-gray-500 hover:text-red-600 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-red-200">
              Deactivate
            </button>
          </div>
        </div>
        <div v-if="!rates.length" class="px-5 py-8 text-center text-sm text-gray-400">No rates set yet.</div>
      </div>
    </div>
  </div>
</div>`
}
