export default {
  name: 'CreateOrder',
  data() {
    return {
      step: 1,
      form: {
        order_type: '',
        amount_aud: '',
        zim_delivery_location_id: '',
        zim_delivery_address: '',
        zim_delivery_notes: '',
        zim_recipient_name: '',
        zim_recipient_phone: '',
        aud_bank_account_id: '',
        saved_recipient_id: '',
        save_recipient: false,
        recipient_nickname: ''
      },
      rate: null, locations: [], groupedLocations: [],
      bankAccounts: [], savedRecipients: [],
      submitting: false, error: null, feeCalc: null
    }
  },
  computed: {
    parsedAmountAud() {
        return parseFloat(this.form.amount_aud) || 0
    },
    quickAmounts() {
        return [100, 200, 300, 500, 800, 1000]
    },
    selectedLocation() { return this.locations.find(l => l.id == this.form.zim_delivery_location_id) },
    selectedAccount() { return this.bankAccounts.find(a => a.id == this.form.aud_bank_account_id) },
    canProceed() {
      const checks = [
        !!this.form.order_type,
        parseFloat(this.form.amount_aud) >= 50,
        !!this.form.zim_delivery_location_id,
        !!(this.form.zim_recipient_name && this.form.zim_recipient_phone),
        !!this.form.aud_bank_account_id
      ]
      return checks[this.step - 1] ?? false
    },
    reviewRows() {
      const acc = this.selectedAccount
      return [
        { label: 'Direction', value: this.form.order_type === 'send_to_zim' ? '🇦🇺 Send to Zimbabwe' : '🇿🇼 Receive from Zimbabwe' },
        { label: 'Amount (AUD)', value: this.$fmt.aud(parseFloat(this.form.amount_aud) || 0) },
        { label: 'Platform fee', value: this.feeCalc ? this.$fmt.aud(this.feeCalc.feeAud) + ' (' + this.feeCalc.feePercent + '%)' : '—' },
        { label: 'Recipient gets', value: this.feeCalc ? this.$fmt.usd(this.feeCalc.usd) : '—', highlight: true },
        { label: 'City', value: this.selectedLocation?.name || '—' },
        { label: 'Recipient', value: this.form.zim_recipient_name ? this.form.zim_recipient_name + ' · ' + this.form.zim_recipient_phone : '—' },
        { label: 'Your bank', value: acc ? acc.bank_name + ' ····' + (acc.account_number || '').slice(-4) : '—' }
      ]
    }
  },
  async mounted() {
    await Promise.all([this.fetchRate(), this.fetchLocations(), this.fetchBankAccounts(), this.fetchRecipients()])
    // Auto-select primary bank account
    const primary = this.bankAccounts.find(a => a.is_primary)
    if (primary) this.form.aud_bank_account_id = primary.id
  },
  watch: {
    'form.amount_aud': 'updateCalc',
    'form.saved_recipient_id'(id) {
      const r = this.savedRecipients.find(r => r.id == id)
      if (r) {
        this.form.zim_recipient_name = r.recipient_name
        this.form.zim_recipient_phone = r.recipient_phone
        this.form.zim_delivery_location_id = r.delivery_location_id
        this.form.zim_delivery_address = r.delivery_address || ''
        this.form.zim_delivery_notes = r.delivery_notes || ''
      }
    }
  },
  methods: {
    setAmount(value) {
        this.form.amount_aud = value
        this.updateCalc()
    },

    amountButtonClass(value) {
        const isSelected = parseFloat(this.form.amount_aud) === value

        return [
            'px-3.5 py-2 text-sm rounded-xl border font-medium transition',
            isSelected
                ? 'bg-green-700 text-white border-green-700'
                : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
        ]
    },
    async fetchRate() {
      try { const { data } = await this.$http.get('/exchange-rates/AUD/USD'); this.rate = data.data; this.updateCalc() } catch { }
    },
    async fetchLocations() {
      try { const { data } = await this.$http.get('/countries/2/locations'); this.locations = data.data.flat || []; this.groupedLocations = data.data.grouped || [] } catch { }
    },
    async fetchBankAccounts() {
      try { const { data } = await this.$http.get('/bank-accounts'); this.bankAccounts = data.data || [] } catch { }
    },
    async fetchRecipients() {
      try { const { data } = await this.$http.get('/recipients'); this.savedRecipients = data.data || [] } catch { }
    },
    updateCalc() {
      const amt = parseFloat(this.form.amount_aud)
      if (!amt || !this.rate) { this.feeCalc = null; return }
      const fee = parseFloat(this.rate.platform_fee_percent || 1.5)
      const feeAud = parseFloat((amt * fee / 100).toFixed(2))
      const usd = parseFloat(((amt - feeAud) * parseFloat(this.rate.rate)).toFixed(2))
      this.feeCalc = { feeAud, usd, feePercent: fee }
    },
    next() { if (this.step < 6) this.step++ },
    back() { if (this.step > 1) this.step-- },
    async submit() {
      this.submitting = true; this.error = null
      try {
        const { data } = await this.$http.post('/orders', {
          ...this.form,
          amount_aud: parseFloat(this.form.amount_aud),
          zim_delivery_location_id: parseInt(this.form.zim_delivery_location_id),
          aud_bank_account_id: parseInt(this.form.aud_bank_account_id)
        })
        this.$toast.success('Order created!')
        this.$router.push('/orders/' + data.data.order.ulid)
      } catch (e) { this.error = e.response?.data?.message || 'Failed to create order.' }
      this.submitting = false
    }
  },
  template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">

    <div class="mb-8">
      <router-link to="/orders" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
        <i class="fas fa-arrow-left text-xs"></i> My Orders
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">Create Order</h1>
      <div class="flex items-center gap-2 mt-4">
        <div v-for="i in 6" :key="i"
          :class="['flex-1 h-1.5 rounded-full transition-all duration-300',
            i < step ? 'bg-green-600' : i === step ? 'bg-green-400' : 'bg-gray-200']"></div>
      </div>
      <p class="text-xs text-gray-400 mt-1.5">Step {{ step }} of 6</p>
    </div>

    <!-- Bank account guard -->
    <bank-account-guard>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <!-- Step 1: Direction -->
        <div v-if="step === 1">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">What would you like to do?</h2>
          <p class="text-sm text-gray-500 mb-6">Choose the direction of your transaction.</p>
          <div class="grid gap-3">
            <button v-for="opt in [
              {type:'send_to_zim',      icon:'fa-paper-plane',     label:'Send to Zimbabwe',      desc:'You deposit AUD. Recipient gets USD cash in Zimbabwe.', color:'blue'},
              {type:'receive_from_zim', icon:'fa-hand-holding-usd', label:'Receive from Zimbabwe', desc:'You deliver USD cash. Sender deposits AUD here.',       color:'purple'},
            ]" :key="opt.type" @click="form.order_type = opt.type"
              :class="['p-5 rounded-2xl border-2 text-left transition-all cursor-pointer',
                form.order_type === opt.type ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300']">
              <div class="flex items-center gap-3">
                <div :class="'w-10 h-10 rounded-xl flex items-center justify-center bg-' + opt.color + '-100'">
                  <i :class="'fas ' + opt.icon + ' text-' + opt.color + '-600'"></i>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ opt.label }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ opt.desc }}</p>
                </div>
                <div :class="['w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition',
                  form.order_type === opt.type ? 'border-green-600 bg-green-600' : 'border-gray-300']">
                  <i v-if="form.order_type === opt.type" class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Amount -->
          <div v-if="step === 2">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">How much AUD?</h2>
            <p class="text-sm text-gray-500 mb-5">Minimum AUD $50.</p>

            <div class="mb-4">
              <label class="text-sm font-medium text-gray-700 block mb-1.5">
                Amount (AUD) <span class="text-red-500">*</span>
              </label>

              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>

                <input
                  v-model="form.amount_aud"
                  type="number"
                  min="50"
                  step="10"
                  class="w-full pl-8 pr-4 py-3.5 border border-gray-200 rounded-xl text-xl font-bold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="0.00"
                  @input="updateCalc"
                >
              </div>
            </div>

            <!-- Calculator -->
            <smart-calculator 
              :amount-aud="parsedAmountAud" 
              :rate="rate" 
            />

            <!-- Quick amounts -->
            <div class="flex gap-2 mt-4 flex-wrap">
              <button
                v-for="value in quickAmounts"
                :key="value"
                @click="setAmount(value)"
                :class="amountButtonClass(value)"
              >
                AUD ${{ value }}
              </button>
            </div>
          </div>

        <!-- Step 3: Zimbabwe city -->
        <div v-if="step === 3">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Select Zimbabwe city</h2>
          <p class="text-sm text-gray-500 mb-5">Choose the delivery city. You can only match with orders for the same city.</p>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-700 block mb-1.5">City <span class="text-red-500">*</span></label>
            <select v-model="form.zim_delivery_location_id"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-white text-gray-900">
              <option value="">Select a city...</option>
              <optgroup v-for="group in groupedLocations" :key="group.province" :label="group.province">
                <option v-for="loc in group.locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </optgroup>
            </select>
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-700 block mb-1.5">
              Specific area or address <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <input v-model="form.zim_delivery_address" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="e.g. Near OK Supermarket, Borrowdale">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1.5">
              Delivery notes <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <input v-model="form.zim_delivery_notes" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="e.g. Call 30 minutes before arrival">
          </div>
        </div>

        <!-- Step 4: Recipient -->
        <div v-if="step === 4">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Zimbabwe recipient</h2>
          <p class="text-sm text-gray-500 mb-5">Who will receive the USD cash in Zimbabwe?</p>
          <div v-if="savedRecipients.length" class="mb-4">
            <label class="text-sm font-medium text-gray-700 block mb-1.5">Use a saved recipient</label>
            <select v-model="form.saved_recipient_id"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option value="">Enter details manually...</option>
              <option v-for="r in savedRecipients" :key="r.id" :value="r.id">
                {{ r.nickname }} — {{ r.recipient_name }}
              </option>
            </select>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1.5">Full name <span class="text-red-500">*</span></label>
              <input v-model="form.zim_recipient_name" type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="e.g. Chido Moyo">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1.5">Phone number <span class="text-red-500">*</span></label>
              <input v-model="form.zim_recipient_phone" type="tel"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="+263 77 123 4567">
            </div>
          </div>
          <div v-if="!form.saved_recipient_id" class="mt-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.save_recipient" type="checkbox" class="w-4 h-4 text-green-600 rounded">
              <span class="text-sm text-gray-700">Save this recipient for future orders</span>
            </label>
            <input v-if="form.save_recipient" v-model="form.recipient_nickname" type="text"
              class="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Nickname (e.g. Mum, Brother James)">
          </div>
        </div>

        <!-- Step 5: Bank account -->
        <div v-if="step === 5">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Your bank account</h2>
          <p class="text-sm text-gray-500 mb-5">Select which Australian bank account to use for this transaction.</p>
          <div class="space-y-3">
            <button v-for="acc in bankAccounts" :key="acc.id" @click="form.aud_bank_account_id = acc.id"
              :class="['w-full p-4 rounded-2xl border-2 text-left transition-all',
                form.aud_bank_account_id == acc.id ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300']">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-900">{{ acc.bank_name }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ acc.account_name }} &middot; &middot;&middot;&middot;&middot;{{ acc.account_number?.slice(-4) }}</p>
                  <div class="flex gap-1.5 mt-1">
                    <span v-if="acc.is_primary" class="text-xs text-green-700 font-medium bg-green-100 px-1.5 py-0.5 rounded">Primary</span>
                    <span v-if="acc.is_verified" class="text-xs text-blue-700 font-medium bg-blue-100 px-1.5 py-0.5 rounded">Verified</span>
                  </div>
                </div>
                <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition flex-shrink-0',
                  form.aud_bank_account_id == acc.id ? 'border-green-600 bg-green-600' : 'border-gray-300']">
                  <i v-if="form.aud_bank_account_id == acc.id" class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 6: Review -->
        <div v-if="step === 6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5">Review your order</h2>
          <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
          <div class="bg-gray-50 rounded-2xl overflow-hidden">
            <div v-for="row in reviewRows" :key="row.label"
              :class="['flex justify-between items-center px-5 py-3.5 border-b border-gray-100 last:border-0',
                row.highlight ? 'bg-green-50' : '']">
              <span class="text-sm text-gray-500">{{ row.label }}</span>
              <span :class="['text-sm font-semibold', row.highlight ? 'text-green-700 text-base' : 'text-gray-900']">
                {{ row.value }}
              </span>
            </div>
          </div>
          <div class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
            <i class="fas fa-info-circle mr-1.5"></i>
            Your order will be listed publicly so other members can propose a match. No money moves until both parties agree.
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8">
          <button v-if="step > 1" @click="back"
            class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <i class="fas fa-arrow-left text-xs"></i> Back
          </button>
          <div v-else></div>

          <button v-if="step < 6" @click="next" :disabled="!canProceed"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Continue <i class="fas fa-arrow-right text-xs"></i>
          </button>

          <button v-if="step === 6" @click="submit" :disabled="submitting"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
            <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-check text-xs"></i>
            Create Order
          </button>
        </div>
      </div>
    </bank-account-guard>
  </div>
  <app-footer />
</div>`
}
