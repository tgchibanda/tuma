export default {
    name: 'MatchDetail',
    data() {
        return {
            match: null, negotiations: null,
            loading: true, actionLoading: false, error: null,
            negotiateAction: '', counterAud: '', counterUsd: '', counterMsg: '',
            deliveryMethod: '', riskPayoutMethod: 'platform_then_bank',
            depositFile: null, depositorRef: '',
            idPhoto: null, idType: 'national_id', handoverPhoto: null,
            combinedPhoto: null, verificationNote: '',
            useOption: 'two',
            ratingScore: 0, ratingComment: '',
            ratingSubmitted: false
        }
    },
    computed: {
        myId() { return this.$auth.user?.id },
        myRole() { return this.match?.my_role },
        isSender() { return this.myRole === 'sender' },
        chatClosed() {
            return ['completed', 'cancelled', 'refunded'].includes(this.match?.status)
        },
        canUploadDeposit() {
            return ['awaiting_deposit', 'awaiting_risk_deposit'].includes(this.match?.status) && this.isSender
        },
        canUploadDelivery() {
            return ['awaiting_delivery', 'awaiting_risk_delivery'].includes(this.match?.status) && !this.isSender
        },
        canConfirmDelivery() {
            return ['awaiting_confirmation', 'awaiting_risk_confirmation'].includes(this.match?.status) && this.isSender
        },
        canSelectDeliveryMethod() { return this.match?.status === 'rate_agreed' },
        canConfirmDeliveryMethod() {
            return this.match?.status === 'delivery_method_selecting'
                && this.match?.delivery_method_proposed_by !== this.myId
        },
        canRate() { return this.match?.status === 'completed' && !this.ratingSubmitted },
        showNegotiation() { return ['proposed', 'negotiating'].includes(this.match?.status) },
        isMyTurn() { return this.match?.is_my_turn_to_negotiate },
        deliveryInstruction() {
            if (!this.match) return ''
            const s = this.match.status
            const usd = this.match.agreed_usd
            if (s === 'awaiting_delivery') {
                return 'AUD is secured in escrow. Please deliver USD $' + usd + ' cash to the recipient and upload verification photos.'
            }
            if (s === 'awaiting_risk_delivery') {
                return 'Risk Delivery: Please deliver USD $' + usd + ' cash first. The sender will deposit AUD after you confirm delivery.'
            }
            if (['awaiting_confirmation', 'awaiting_risk_confirmation'].includes(s)) {
                return 'Cash has been delivered. Please confirm the recipient received the money.'
            }
            return ''
        },
        depositBankRef() {
            return this.match?.deposit_reference || ''
        },
        agreedUsdLabel() {
            return this.match ? 'USD $' + this.match.agreed_usd : ''
        },
        handoverHint() {
            return this.match
                ? 'Photo of USD $' + this.match.agreed_usd + ' with handwritten amount on paper'
                : 'Photo showing cash amount'
        },
        combinedHint() {
            return this.match
                ? 'One photo showing: recipient holding their ID next to the cash with USD $' + this.match.agreed_usd + ' written on paper.'
                : 'Combined verification photo'
        },
        recipientName() {
            return this.match?.send_order?.zim_recipient_name || 'the recipient'
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/matches/' + this.$route.params.ulid)
                this.match = data.data
                if (this.showNegotiation) await this.loadNegotiations()
            } catch { this.$router.push('/matches') }
            this.loading = false
        },
        async loadNegotiations() {
            try {
                const { data } = await this.$http.get('/matches/' + this.$route.params.ulid + '/negotiations')
                this.negotiations = data.data
            } catch {}
        },
        async accept() {
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/negotiate', { action: 'accept' })
                this.$toast.success('Rate agreed! Now choose your delivery method.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async counter() {
            if (!this.counterAud || !this.counterUsd) return
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/negotiate', {
                    action: 'counter',
                    proposed_aud: parseFloat(this.counterAud),
                    proposed_usd: parseFloat(this.counterUsd),
                    message: this.counterMsg
                })
                this.$toast.success('Counter-offer sent.')
                this.negotiateAction = ''
                this.counterAud = ''
                this.counterUsd = ''
                this.counterMsg = ''
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async cancelMatch() {
            if (!confirm('Cancel this match? Your order will return to open.')) return
            this.actionLoading = true
            try {
                await this.$http.put('/matches/' + this.match.ulid + '/cancel')
                this.$toast.success('Match cancelled.')
                this.$router.push('/matches')
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async proposeDeliveryMethod() {
            this.actionLoading = true
            try {
                const payload = { method: this.deliveryMethod }
                if (this.deliveryMethod === 'risk') payload.risk_payout_method = this.riskPayoutMethod
                await this.$http.post('/matches/' + this.match.ulid + '/delivery-method', payload)
                this.$toast.success('Delivery method proposed.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async confirmDeliveryMethod(confirmed) {
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/delivery-method/confirm', { confirmed })
                this.$toast.success(confirmed ? 'Delivery method confirmed.' : 'Match cancelled.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async uploadDeposit() {
            if (!this.depositFile || !this.depositorRef) return
            this.actionLoading = true
            const fd = new FormData()
            fd.append('proof_file', this.depositFile)
            fd.append('depositor_reference', this.depositorRef)
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/deposit/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.$toast.success('Deposit proof uploaded. Admin will verify shortly.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async uploadDelivery() {
            this.actionLoading = true
            const fd = new FormData()
            if (this.useOption === 'combined') {
                if (!this.combinedPhoto) {
                    this.$toast.error('Please upload a combined photo.')
                    this.actionLoading = false
                    return
                }
                fd.append('combined_verification_photo', this.combinedPhoto)
            } else {
                if (!this.idPhoto || !this.handoverPhoto) {
                    this.$toast.error('Please upload both photos.')
                    this.actionLoading = false
                    return
                }
                fd.append('recipient_id_photo', this.idPhoto)
                fd.append('recipient_id_type', this.idType)
                fd.append('handover_amount_photo', this.handoverPhoto)
            }
            if (this.verificationNote) fd.append('verification_note', this.verificationNote)
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/delivery/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.$toast.success('Delivery proof uploaded.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async confirmDelivery() {
            if (!confirm('Confirm the cash was received in Zimbabwe?')) return
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/delivery/confirm')
                this.$toast.success('Receipt confirmed!')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async submitRating() {
            if (!this.ratingScore) return
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/rate', {
                    score: this.ratingScore,
                    comment: this.ratingComment
                })
                this.$toast.success('Rating submitted!')
                this.ratingSubmitted = true
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        async raiseDispute() {
            const reason = prompt('Please describe the issue (minimum 20 characters):')
            if (!reason || reason.length < 20) return
            this.actionLoading = true
            try {
                await this.$http.post('/matches/' + this.match.ulid + '/dispute', { reason })
                this.$toast.success('Dispute raised.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed') }
            this.actionLoading = false
        },
        formatNegDate(dt) {
            return dt ? new Date(dt).toLocaleString() : ''
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/matches" class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h1 class="text-xl font-bold text-gray-900">Match Detail</h1>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="match" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Timeline + Summary -->
      <div class="md:col-span-1 space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <status-badge :status="match.status" />
          <div v-if="match.agreed_aud" class="mt-3">
            <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(match.agreed_aud) }}</p>
            <p class="text-sm text-gray-500">{{ $fmt.usd(match.agreed_usd) }}</p>
          </div>
          <div class="mt-3 text-sm space-y-1.5">
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">My role</span>
              <span class="font-medium capitalize text-gray-900">{{ myRole }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Delivery</span>
              <span :class="['font-medium capitalize',
                match.delivery_method === 'secure' ? 'text-green-700' :
                match.delivery_method === 'risk' ? 'text-orange-600' : 'text-gray-500']">
                {{ match.delivery_method === 'pending' ? 'Not set' : match.delivery_method }}
              </span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-gray-500">Ref</span>
              <span class="font-mono text-xs text-gray-700">{{ match.deposit_reference }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-800 mb-4">Progress</h3>
          <status-timeline :match="match" />
        </div>

        <div v-if="['proposed','negotiating','rate_agreed','delivery_method_selecting'].includes(match.status)">
          <button @click="cancelMatch" :disabled="actionLoading"
            class="w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
            Cancel Match
          </button>
        </div>

        <div v-if="['awaiting_delivery','awaiting_risk_delivery','delivery_uploaded','risk_delivery_uploaded','awaiting_confirmation','awaiting_risk_confirmation'].includes(match.status)">
          <button @click="raiseDispute"
            class="w-full py-2.5 text-sm text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50">
            <i class="fas fa-flag mr-1"></i> Raise Dispute
          </button>
        </div>
      </div>

      <!-- Right: Main content -->
      <div class="md:col-span-2 space-y-5">

        <!-- Negotiation thread -->
        <div v-if="showNegotiation" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-comments text-green-600"></i> Negotiation
            <span v-if="negotiations" class="text-xs text-gray-400 font-normal ml-1">
              Round {{ negotiations.negotiation_rounds || 1 }} of {{ negotiations.max_rounds || 5 }}
            </span>
          </h3>

          <div v-if="negotiations" class="space-y-3 mb-5 max-h-64 overflow-y-auto">
            <div v-for="n in negotiations.negotiations" :key="n.id"
              :class="['p-3 rounded-xl text-sm', n.proposed_by.is_me ? 'bg-green-50 ml-8' : 'bg-gray-50 mr-8']">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-gray-800">
                  {{ n.proposed_by.is_me ? 'You' : n.proposed_by.display_name }}
                </span>
                <span class="text-xs text-gray-400">{{ formatNegDate(n.created_at) }}</span>
              </div>
              <p class="font-bold text-gray-900">
                {{ $fmt.aud(n.proposed_aud) }} &harr; {{ $fmt.usd(n.proposed_usd) }}
              </p>
              <p v-if="n.message" class="text-gray-600 mt-1 text-xs">{{ n.message }}</p>
            </div>
          </div>

          <div v-if="isMyTurn">
            <div v-if="!negotiateAction" class="flex gap-3">
              <button @click="accept" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
                <i class="fas fa-check mr-1"></i> Accept
              </button>
              <button @click="negotiateAction = 'counter'"
                class="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                <i class="fas fa-exchange-alt mr-1"></i> Counter-offer
              </button>
            </div>

            <div v-if="negotiateAction === 'counter'" class="space-y-3 mt-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">AUD amount</label>
                  <input v-model="counterAud" type="number"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                    placeholder="500.00">
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">USD amount</label>
                  <input v-model="counterUsd" type="number"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                    placeholder="313.00">
                </div>
              </div>
              <input v-model="counterMsg" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                placeholder="Optional message...">
              <div class="flex gap-2">
                <button @click="counter" :disabled="actionLoading || !counterAud || !counterUsd"
                  class="flex-1 py-2 text-sm font-medium bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50">
                  Send Counter-offer
                </button>
                <button @click="negotiateAction = ''"
                  class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-sm text-center text-gray-500 py-2 bg-gray-50 rounded-lg">
            <i class="fas fa-clock mr-1"></i> Waiting for the other party to respond...
          </div>
        </div>

        <!-- Delivery method selection -->
        <div v-if="canSelectDeliveryMethod || canConfirmDeliveryMethod"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-route text-green-600"></i> Choose Delivery Method
          </h3>

          <div v-if="canSelectDeliveryMethod" class="space-y-3">
            <button v-for="opt in [
              {value:'secure', icon:'fa-shield-alt', label:'Secure Delivery (Recommended)',
               desc:'Sender deposits AUD first. Cash is delivered after funds are in escrow.',
               color:'green'},
              {value:'risk', icon:'fa-exclamation-triangle', label:'Risk Delivery',
               desc:'Deliverer goes first. Only choose if you trust the other party.',
               color:'orange'}
            ]" :key="opt.value" @click="deliveryMethod = opt.value"
              :class="['w-full p-4 rounded-xl border-2 text-left transition',
                deliveryMethod === opt.value
                  ? 'border-' + opt.color + '-500 bg-' + opt.color + '-50'
                  : 'border-gray-200 hover:border-gray-300']">
              <div class="flex items-start gap-3">
                <i :class="'fas mt-0.5 text-' + opt.color + '-600 ' + opt.icon"></i>
                <div>
                  <p class="font-semibold text-sm text-gray-900">{{ opt.label }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ opt.desc }}</p>
                </div>
                <i v-if="deliveryMethod === opt.value"
                  class="fas fa-check-circle text-green-600 ml-auto"></i>
              </div>
            </button>

            <div v-if="deliveryMethod === 'risk'" class="mt-2">
              <label class="text-xs text-gray-600 mb-1.5 block font-medium">Payout preference</label>
              <select v-model="riskPayoutMethod"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-green-500">
                <option value="platform_then_bank">Via TuMa escrow then to my bank</option>
                <option value="direct_bank">Direct to my Australian bank account</option>
              </select>
            </div>

            <button @click="proposeDeliveryMethod" :disabled="!deliveryMethod || actionLoading"
              class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition mt-2">
              <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
              Propose This Method
            </button>
          </div>

          <div v-if="canConfirmDeliveryMethod" class="space-y-3">
            <div class="p-4 bg-gray-50 rounded-xl text-sm">
              <p class="font-medium text-gray-800">
                The other party proposed:
                <span :class="['font-bold',
                  match.delivery_method === 'secure' ? 'text-green-700' : 'text-orange-600']">
                  {{ match.delivery_method === 'secure' ? 'Secure Delivery' : 'Risk Delivery' }}
                </span>
              </p>
            </div>
            <div class="flex gap-3">
              <button @click="confirmDeliveryMethod(true)" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50">
                Accept
              </button>
              <button @click="confirmDeliveryMethod(false)" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
                Reject &amp; Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Deposit section -->
        <div v-if="match.deposit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-university text-green-600"></i> AUD Deposit
          </h3>

          <div v-if="canUploadDeposit">
            <div class="bg-blue-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
              <p class="font-semibold text-blue-800 mb-2">Transfer details:</p>
              <p><span class="text-blue-600">Bank:</span> <strong>National Australia Bank</strong></p>
              <p><span class="text-blue-600">Account:</span> <strong>TuMa Pty Ltd Trust Account</strong></p>
              <p>
                <span class="text-blue-600">Amount:</span>
                <strong>{{ $fmt.aud(match.agreed_aud) }}</strong>
              </p>
              <p>
                <span class="text-blue-600">Reference:</span>
                <strong class="font-mono text-blue-900">{{ depositBankRef }}</strong>
                <span class="text-xs text-red-600 ml-1">Use exact reference</span>
              </p>
            </div>

            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block">
                  Your bank transfer reference
                </label>
                <input v-model="depositorRef" type="text"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  :placeholder="depositBankRef">
              </div>
              <file-upload label="Payment screenshot" accept="image/*,.pdf"
                hint="JPG, PNG or PDF, max 5MB" :required="true"
                @change="depositFile = $event" />
              <button @click="uploadDeposit"
                :disabled="!depositFile || !depositorRef || actionLoading"
                class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
                <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
                Upload Proof
              </button>
            </div>
          </div>

          <div v-else class="flex items-center gap-2 text-sm">
            <span :class="['w-2 h-2 rounded-full',
              ['verified','released'].includes(match.deposit.status)
                ? 'bg-green-500' : 'bg-yellow-500']"></span>
            <span class="capitalize">Deposit {{ match.deposit.status }}</span>
          </div>
        </div>

        <!-- Delivery upload -->
        <div v-if="canUploadDelivery" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <i class="fas fa-money-bill-wave text-green-600"></i> Upload Delivery Proof
          </h3>
          <p class="text-xs text-gray-500 mb-4">{{ deliveryInstruction }}</p>

          <div class="flex gap-3 mb-4">
            <button v-for="opt in [{v:'two', l:'Two photos'}, {v:'combined', l:'One combined photo'}]"
              :key="opt.v" @click="useOption = opt.v"
              :class="['flex-1 py-2 text-xs font-medium rounded-lg border transition',
                useOption === opt.v
                  ? 'bg-green-700 text-white border-green-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
              {{ opt.l }}
            </button>
          </div>

          <div v-if="useOption === 'two'" class="space-y-4">
            <file-upload label="Recipient's ID photo" accept="image/*,.pdf"
              hint="Passport, national ID, or driver's licence" :required="true"
              @change="idPhoto = $event" />
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1 block">ID type</label>
              <select v-model="idType"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none">
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_licence">Driver's Licence</option>
              </select>
            </div>
            <file-upload label="Cash handover photo" accept="image/*,.pdf"
              :hint="handoverHint" :required="true"
              @change="handoverPhoto = $event" />
          </div>

          <div v-else>
            <file-upload label="Combined verification photo" accept="image/*,.pdf"
              :hint="combinedHint" :required="true"
              @change="combinedPhoto = $event" />
          </div>

          <input v-model="verificationNote" type="text"
            class="mt-3 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            placeholder="Optional delivery note">

          <button @click="uploadDelivery" :disabled="actionLoading"
            class="w-full mt-4 py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
            Submit Delivery Proof
          </button>
        </div>

        <!-- Confirm delivery -->
        <div v-if="canConfirmDelivery"
          class="bg-white rounded-2xl border border-green-200 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Confirm Cash Received</h3>
          <p class="text-sm text-gray-600 mb-4">
            Confirm that the recipient received the USD cash in Zimbabwe.
          </p>
          <button @click="confirmDelivery" :disabled="actionLoading"
            class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-thumbs-up mr-1"></i>
            Yes, Cash Was Received
          </button>
        </div>

        <!-- Rating -->
        <div v-if="canRate" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-star text-yellow-400"></i> Rate Your Partner
          </h3>
          <p class="text-sm text-gray-600 mb-3">How was your experience?</p>
          <div class="mb-3">
            <rating-stars :value="ratingScore" :interactive="true" size="lg"
              @input="ratingScore = $event" />
          </div>
          <textarea v-model="ratingComment" rows="3"
            class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none"
            placeholder="Optional comment..."></textarea>
          <button @click="submitRating" :disabled="!ratingScore || actionLoading"
            class="mt-3 w-full py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            Submit Rating
          </button>
        </div>

        <!-- Chat -->
        <chat-panel :match-ulid="match.ulid" :is-closed="chatClosed" />
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
