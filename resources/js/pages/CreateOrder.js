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
            loading: false, submitting: false, error: null,
            feeCalc: null
        }
    },
    computed: {
        selectedLocation() {
            return this.locations.find(l => l.id == this.form.zim_delivery_location_id)
        },
        selectedAccount() {
            return this.bankAccounts.find(a => a.id == this.form.aud_bank_account_id)
        },
        canProceedStep1() { return !!this.form.order_type },
        canProceedStep2() { return parseFloat(this.form.amount_aud) >= 50 },
        canProceedStep3() { return !!this.form.zim_delivery_location_id },
        canProceedStep4() { return !!(this.form.zim_recipient_name && this.form.zim_recipient_phone) },
        canProceedStep5() { return !!this.form.aud_bank_account_id },
        canProceed() {
            return [
                this.canProceedStep1,
                this.canProceedStep2,
                this.canProceedStep3,
                this.canProceedStep4,
                this.canProceedStep5
            ][this.step - 1]
        },
        reviewRows() {
            return [
                {
                    label: 'Direction',
                    value: this.form.order_type === 'send_to_zim'
                        ? '🇦🇺 Send to Zimbabwe'
                        : '🇿🇼 Receive from Zimbabwe',
                    highlight: false
                },
                {
                    label: 'Amount (AUD)',
                    value: this.$fmt.aud(parseFloat(this.form.amount_aud) || 0),
                    highlight: false
                },
                {
                    label: 'Platform fee',
                    value: this.feeCalc
                        ? this.$fmt.aud(this.feeCalc.feeAud) + ' (' + this.feeCalc.feePercent + '%)'
                        : '—',
                    highlight: false
                },
                {
                    label: 'Recipient gets',
                    value: this.feeCalc ? this.$fmt.usd(this.feeCalc.usd) : '—',
                    highlight: true
                },
                {
                    label: 'City',
                    value: this.selectedLocation ? this.selectedLocation.name : '—',
                    highlight: false
                },
                {
                    label: 'Recipient',
                    value: this.form.zim_recipient_name && this.form.zim_recipient_phone
                        ? this.form.zim_recipient_name + ' · ' + this.form.zim_recipient_phone
                        : '—',
                    highlight: false
                },
                {
                    label: 'Your bank',
                    value: this.selectedAccount
                        ? this.selectedAccount.bank_name + ' ····' + (this.selectedAccount.account_number || '').slice(-4)
                        : '—',
                    highlight: false
                }
            ]
        },
        quickAmounts() { return [100, 200, 300, 500, 1000] }
    },
    async mounted() {
        await Promise.all([
            this.fetchRate(),
            this.fetchLocations(),
            this.fetchBankAccounts(),
            this.fetchRecipients()
        ])
        // Guard: user must have a bank account to create an order
        if (!this.bankAccounts.length) {
            this.$toast.error('Please add an Australian bank account before creating an order.')
            this.$router.replace('/bank-accounts')
        }
    },
    watch: {
        'form.amount_aud': 'updateCalc',
        'form.saved_recipient_id'(id) {
            const r = this.savedRecipients.find(r => r.id == id)
            if (r) {
                this.form.zim_recipient_name       = r.recipient_name
                this.form.zim_recipient_phone      = r.recipient_phone
                this.form.zim_delivery_location_id = r.delivery_location_id
                this.form.zim_delivery_address     = r.delivery_address || ''
                this.form.zim_delivery_notes       = r.delivery_notes || ''
            }
        }
    },
    methods: {
        async fetchRate() {
            try {
                const { data } = await this.$http.get('/exchange-rates/AUD/USD')
                this.rate = data.data
                this.updateCalc()
            } catch {}
        },
        async fetchLocations() {
            try {
                const { data } = await this.$http.get('/countries/2/locations')
                this.locations      = data.data.flat || []
                this.groupedLocations = data.data.grouped || []
            } catch {}
        },
        async fetchBankAccounts() {
            try {
                const { data } = await this.$http.get('/bank-accounts')
                this.bankAccounts = data.data || []
            } catch {}
        },
        async fetchRecipients() {
            try {
                const { data } = await this.$http.get('/recipients')
                this.savedRecipients = data.data || []
            } catch {}
        },
        updateCalc() {
            const amt = parseFloat(this.form.amount_aud)
            if (!amt || !this.rate) { this.feeCalc = null; return }
            const fee    = parseFloat(this.rate.platform_fee_percent || 1.5)
            const feeAud = parseFloat((amt * fee / 100).toFixed(2))
            const net    = amt - feeAud
            const usd    = parseFloat((net * parseFloat(this.rate.rate)).toFixed(2))
            this.feeCalc = { feeAud, usd, feePercent: fee }
        },
        next() { if (this.step < 6) this.step++ },
        back() { if (this.step > 1) this.step-- },
        isQuickAmountSelected(amt) {
            return parseFloat(this.form.amount_aud) === amt
        },
        selectQuickAmount(amt) {
            this.form.amount_aud = amt
            this.updateCalc()
        },
        async submit() {
            this.submitting = true
            this.error = null
            try {
                const { data } = await this.$http.post('/orders', {
                    ...this.form,
                    amount_aud: parseFloat(this.form.amount_aud),
                    zim_delivery_location_id: parseInt(this.form.zim_delivery_location_id),
                    aud_bank_account_id: parseInt(this.form.aud_bank_account_id)
                })
                this.$toast.success('Order created successfully!')
                this.$router.push('/orders/' + data.data.order.ulid)
            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to create order.'
            }
            this.submitting = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">

    <div class="mb-8">
      <router-link to="/orders" class="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> Back to orders
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">Create Order</h1>
      <div class="flex items-center gap-2 mt-4">
        <div v-for="i in 6" :key="i"
          :class="['flex-1 h-1.5 rounded-full transition-colors',
            i <= step ? 'bg-green-600' : 'bg-gray-200']"></div>
      </div>
      <p class="text-xs text-gray-400 mt-1">Step {{ step }} of 6</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <!-- Step 1: Direction -->
      <div v-if="step === 1">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">What would you like to do?</h2>
        <p class="text-sm text-gray-500 mb-6">Choose the direction of your transaction.</p>
        <div class="grid gap-4">
          <button v-for="opt in [
            {type:'send_to_zim',      icon:'fa-paper-plane',     label:'Send to Zimbabwe',       desc:'Deposit AUD here. Recipient gets USD cash in Zimbabwe.', color:'blue'},
            {type:'receive_from_zim', icon:'fa-hand-holding-usd', label:'Receive from Zimbabwe', desc:'Someone delivers USD cash in Zimbabwe. You get AUD here.', color:'purple'}
          ]" :key="opt.type" @click="form.order_type = opt.type"
            :class="['p-5 rounded-2xl border-2 text-left transition cursor-pointer',
              form.order_type === opt.type
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300']">
            <div class="flex items-center gap-3">
              <div :class="'w-10 h-10 rounded-xl flex items-center justify-center bg-' + opt.color + '-100'">
                <i :class="'fas ' + opt.icon + ' text-' + opt.color + '-600'"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ opt.label }}</p>
                <p class="text-sm text-gray-500 mt-0.5">{{ opt.desc }}</p>
              </div>
              <i v-if="form.order_type === opt.type"
                class="fas fa-check-circle text-green-600 ml-auto text-lg"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 2: Amount -->
      <div v-if="step === 2">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">How much AUD?</h2>
        <p class="text-sm text-gray-500 mb-6">Minimum AUD $50. Your KYC tier determines your maximum.</p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Amount (AUD)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input v-model="form.amount_aud" type="number" min="50" step="10"
              class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:border-green-500"
              placeholder="0.00" @input="updateCalc">
          </div>
        </div>

        <smart-calculator :amount-aud="parseFloat(form.amount_aud) || 0" :rate="rate" />

        <div class="flex gap-2 mt-4 flex-wrap">
          <button v-for="amt in quickAmounts" :key="amt"
            @click="selectQuickAmount(amt)"
            :class="['px-3 py-1.5 text-xs rounded-lg border transition font-medium',
              isQuickAmountSelected(amt)
                ? 'bg-green-700 text-white border-green-700'
                : 'border-gray-200 text-gray-600 hover:border-green-400']">&#36;{{ amt }}</button>
        </div>
      </div>

      <!-- Step 3: City -->
      <div v-if="step === 3">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Select Zimbabwe city</h2>
        <p class="text-sm text-gray-500 mb-4">Choose the city for cash delivery. You can only match with orders for the same city.</p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">City <span class="text-red-500">*</span></label>
          <select v-model="form.zim_delivery_location_id"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
            <option value="">Select a city...</option>
            <optgroup v-for="group in groupedLocations" :key="group.province" :label="group.province">
              <option v-for="loc in group.locations" :key="loc.id" :value="loc.id">
                {{ loc.name }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Specific area or street
            <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.zim_delivery_address" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="e.g. Near OK Supermarket, Borrowdale">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Delivery notes
            <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.zim_delivery_notes" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="e.g. Call 30 minutes before arrival">
        </div>
      </div>

      <!-- Step 4: Recipient -->
      <div v-if="step === 4">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Zimbabwe recipient details</h2>
        <p class="text-sm text-gray-500 mb-4">Who will receive the USD cash in Zimbabwe?</p>

        <div v-if="savedRecipients.length" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Use a saved recipient</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Full name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.zim_recipient_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="e.g. Chido Moyo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Phone number <span class="text-red-500">*</span>
            </label>
            <input v-model="form.zim_recipient_phone" type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="+263 77 123 4567">
          </div>
        </div>

        <div v-if="!form.saved_recipient_id" class="mt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.save_recipient" type="checkbox" class="w-4 h-4 text-green-600">
            <span class="text-sm text-gray-700">Save this recipient for future orders</span>
          </label>
          <input v-if="form.save_recipient" v-model="form.recipient_nickname" type="text"
            class="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Nickname (e.g. Mum, Brother James)">
        </div>
      </div>

      <!-- Step 5: Bank Account -->
      <div v-if="step === 5">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Your Australian bank account</h2>
        <p class="text-sm text-gray-500 mb-4">This is where you will deposit from (or receive AUD to).</p>

        <div v-if="bankAccounts.length" class="space-y-3">
          <button v-for="acc in bankAccounts" :key="acc.id" @click="form.aud_bank_account_id = acc.id"
            :class="['w-full p-4 rounded-xl border-2 text-left transition',
              form.aud_bank_account_id == acc.id
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300']">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ acc.bank_name }}</p>
                <p class="text-sm text-gray-500 mt-0.5">
                  {{ acc.account_name }} &middot; &middot;&middot;&middot;&middot;{{ (acc.account_number || '').slice(-4) }}
                </p>
                <span v-if="acc.is_primary" class="text-xs text-green-700 font-medium">Primary</span>
              </div>
              <i v-if="form.aud_bank_account_id == acc.id"
                class="fas fa-check-circle text-green-600 text-lg"></i>
            </div>
          </button>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 text-sm mb-4">No bank accounts yet.</p>
          <router-link to="/bank-accounts" class="text-green-700 text-sm font-medium hover:underline">
            Add a bank account &rarr;
          </router-link>
        </div>
      </div>

      <!-- Step 6: Review -->
      <div v-if="step === 6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Review your order</h2>
        <alert-banner v-if="error" type="error" :message="error" />

        <div class="space-y-0">
          <div v-for="row in reviewRows" :key="row.label"
            class="flex justify-between py-3 border-b border-gray-100 last:border-0">
            <span class="text-sm text-gray-500">{{ row.label }}</span>
            <span :class="['text-sm font-medium',
              row.highlight ? 'text-green-700 text-base font-bold' : 'text-gray-900']">
              {{ row.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between mt-8">
        <button v-if="step > 1" @click="back"
          class="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
          <i class="fas fa-arrow-left mr-1"></i> Back
        </button>
        <div v-else></div>

        <button v-if="step < 6" @click="next" :disabled="!canProceed"
          class="px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 transition disabled:opacity-40">
          Continue <i class="fas fa-arrow-right ml-1"></i>
        </button>

        <button v-if="step === 6" @click="submit" :disabled="submitting"
          class="px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 transition disabled:opacity-50">
          <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
          Create Order
        </button>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
