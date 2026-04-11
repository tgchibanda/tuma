export default {
    name: 'AdminSettings',
    data() {
        return {
            settings: {}, edited: {}, loading: true, saving: false,
            search: '',
            categories: {
                'Core': ['platform_fee_percent','order_expiry_hours','min_order_amount_aud','max_order_amount_aud','new_user_limit_aud','confirmation_window_hours'],
                'Negotiation': ['negotiation_round_hours','max_negotiation_rounds'],
                'Bank Details': ['tuma_bank_name','tuma_account_name','tuma_bsb','tuma_account_number'],
                'Risk Delivery': ['risk_deposit_window_hours','risk_delivery_enabled','secure_delivery_enabled','delivery_method_timeout_hours'],
                'Referral': ['referral_discount_percent','referral_reward_enabled'],
                'Boost': ['order_boost_fee_aud','order_boost_duration_hours','order_boost_enabled'],
                'Features': ['leaderboard_enabled','directory_enabled','recurring_orders_enabled','rate_alerts_enabled','chat_enabled','push_notifications_enabled','sms_notifications_enabled'],
                'Maintenance': ['maintenance_mode','maintenance_message'],
            }
        }
    },
    computed: {
        filteredCategories() {
            if (!this.search) return this.categories
            const s = this.search.toLowerCase()
            const result = {}
            for (const [cat, keys] of Object.entries(this.categories)) {
                const filtered = keys.filter(k => k.includes(s) ||
                    (this.settings[k]?.description || '').toLowerCase().includes(s))
                if (filtered.length) result[cat] = filtered
            }
            return result
        },
        isDirty() { return Object.keys(this.edited).length > 0 }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/../../api/admin/settings')
                this.settings = data.data
                // Initialise edited values from current
                this.edited = {}
            } catch {}
            this.loading = false
        },
        edit(key, val) {
            this.$set(this.edited, key, val)
        },
        getValue(key) {
            return key in this.edited ? this.edited[key] : (this.settings[key]?.value ?? '')
        },
        isBool(val) { return val === 'true' || val === 'false' },
        async save() {
            if (!this.isDirty) return
            this.saving = true
            try {
                await this.$http.put('/../../api/admin/settings', this.edited)
                this.$toast.success(Object.keys(this.edited).length + ' setting(s) saved.')
                this.edited = {}
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed to save.') }
            this.saving = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
    <div class="flex items-center gap-3">
      <router-link to="/admin/dashboard"><div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">Tu</span></div></router-link>
      <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
    </div>
    <button v-if="isDirty" @click="save" :disabled="saving"
      class="flex items-center gap-2 px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
      <i v-if="saving" class="fas fa-spinner fa-spin"></i>
      <i v-else class="fas fa-save"></i>
      Save {{ Object.keys(edited).length }} change(s)
    </button>
  </div>

  <div class="max-w-4xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between mb-5">
      <h1 class="text-xl font-bold text-gray-900">System Settings</h1>
      <input v-model="search" type="text" placeholder="Search settings..."
        class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 w-56">
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-5">
      <div v-for="(keys, category) in filteredCategories" :key="category"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h2 class="text-sm font-semibold text-gray-700">{{ category }}</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="key in keys" :key="key" class="px-5 py-3 flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <p :class="['text-sm font-mono font-medium', key in edited ? 'text-orange-600' : 'text-gray-800']">
                {{ key }}
                <span v-if="key in edited" class="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1 font-sans">modified</span>
              </p>
              <p v-if="settings[key]?.description" class="text-xs text-gray-500 mt-0.5">
                {{ settings[key].description }}
              </p>
            </div>
            <!-- Boolean toggle -->
            <div v-if="isBool(getValue(key))" class="flex-shrink-0">
              <button @click="edit(key, getValue(key) === 'true' ? 'false' : 'true')"
                :class="['relative inline-flex w-11 h-6 rounded-full transition-colors',
                  getValue(key) === 'true' ? 'bg-green-600' : 'bg-gray-200']">
                <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  getValue(key) === 'true' ? 'translate-x-5' : 'translate-x-0']"></span>
              </button>
            </div>
            <!-- Text/number input -->
            <div v-else class="flex-shrink-0">
              <input :value="getValue(key)" @input="edit(key, $event.target.value)"
                :class="['px-3 py-1.5 border rounded-lg text-sm text-right w-48 focus:outline-none transition',
                  key in edited ? 'border-orange-400 bg-orange-50 focus:border-orange-500' : 'border-gray-200 focus:border-green-500']"
                :type="!isNaN(parseFloat(getValue(key))) ? 'text' : 'text'">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
