export default {
    name: 'Onboarding',
    data() {
        return {
            step: 1, loading: false,
            form: {
                bank_name: '', account_name: '', account_number: '', bsb_code: '', country_id: 1
            },
            bankAdded: false, bankSaving: false
        }
    },
    computed: {
        user() { return this.$auth.user }
    },
    methods: {
        async addBank() {
            if (!this.form.bank_name || !this.form.account_name || !this.form.account_number) return
            this.bankSaving = true
            try {
                await this.$http.post('/bank-accounts', this.form)
                this.bankAdded = true
                this.$toast.success('Bank account saved.')
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed to add account.')
            }
            this.bankSaving = false
        },
        async finish() {
            this.loading = true
            try {
                await this.$http.post('/user/onboarding/complete')
                // Update stored user
                const { data } = await this.$http.get('/user')
                this.$auth.login(this.$auth.token, data.data)
                this.$router.push('/dashboard')
            } catch {
                this.$router.push('/dashboard')
            }
        }
    },
    template: `
<div class="min-h-screen bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center px-4 py-10">
  <div class="w-full max-w-lg">

    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <span class="text-white font-bold text-2xl">Tu</span>
      </div>
      <p class="text-white/80 text-sm">Let's get you set up</p>
    </div>

    <!-- Step progress -->
    <div class="flex gap-2 mb-8">
      <div v-for="i in 3" :key="i"
        :class="['flex-1 h-1.5 rounded-full transition-colors', i <= step ? 'bg-white' : 'bg-white/30']"></div>
    </div>

    <div class="bg-white rounded-3xl p-8 shadow-2xl">

      <!-- Step 1: Welcome -->
      <div v-if="step === 1" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-hand-wave text-green-600 text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome, {{ user?.first_name }}!</h2>
        <p class="text-gray-500 mb-6">
          eZimConnect lets you swap AUD and USD cash directly with other community members — no bank fees, no bad rates.
        </p>
        <div class="grid gap-3 text-left mb-6">
          <div v-for="item in [
            {icon:'fa-shield-alt',color:'green',title:'Funds protected by escrow',desc:'Your AUD is held safely until cash delivery is confirmed.'},
            {icon:'fa-handshake',color:'blue',title:'Trade with real people',desc:'Negotiate directly and agree on rates and delivery.'},
            {icon:'fa-id-card',color:'purple',title:'Quick verification',desc:'KYC takes just a few minutes and lets you trade without limits.'},
          ]" :key="item.title" class="flex items-start gap-3">
            <div :class="'w-9 h-9 rounded-xl bg-' + item.color + '-100 flex items-center justify-center flex-shrink-0'">
              <i :class="'fas ' + item.icon + ' text-' + item.color + '-600 text-sm'"></i>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ item.title }}</p>
              <p class="text-xs text-gray-500">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <button @click="step = 2"
          class="w-full py-3.5 bg-green-700 text-white rounded-2xl font-semibold hover:bg-green-800 transition">
          Get Started <i class="fas fa-arrow-right ml-1"></i>
        </button>
      </div>

      <!-- Step 2: Bank account -->
      <div v-if="step === 2">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-university text-blue-600"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Add your bank account</h2>
            <p class="text-xs text-gray-500">Where you'll send and receive AUD</p>
          </div>
        </div>

        <div v-if="!bankAdded" class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Bank name</label>
            <input v-model="form.bank_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="e.g. Commonwealth Bank">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Account name</label>
            <input v-model="form.account_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              :placeholder="user?.first_name + ' ' + (user?.last_name || '')">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">BSB</label>
              <input v-model="form.bsb_code" type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="000-000">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Account number</label>
              <input v-model="form.account_number" type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="12345678">
            </div>
          </div>
          <button @click="addBank" :disabled="bankSaving || !form.bank_name || !form.account_name || !form.account_number"
            class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="bankSaving" class="fas fa-spinner fa-spin mr-1"></i> Add Account
          </button>
        </div>

        <div v-else class="text-center py-4">
          <i class="fas fa-check-circle text-green-500 text-4xl mb-3 block"></i>
          <p class="font-semibold text-gray-900">Bank account added!</p>
        </div>

        <div class="flex gap-3 mt-4">
          <button v-if="!bankAdded" @click="step = 3"
            class="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">
            Skip for now
          </button>
          <button v-if="bankAdded" @click="step = 3"
            class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
            Continue <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- Step 3: Verify identity -->
      <div v-if="step === 3">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-id-card text-purple-600"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Verify your identity</h2>
            <p class="text-xs text-gray-500">Required to trade above AUD $300</p>
          </div>
        </div>

        <div class="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5">
          <p class="text-sm text-purple-900 font-medium mb-1">What you'll need:</p>
          <ul class="text-sm text-purple-700 space-y-1">
            <li><i class="fas fa-passport mr-2"></i>Passport, national ID, or driver's licence</li>
            <li><i class="fas fa-camera mr-2"></i>A selfie holding your ID</li>
          </ul>
          <p class="text-xs text-purple-600 mt-2">Takes about 2 minutes. Usually approved within 24 hours.</p>
        </div>

        <div class="space-y-3">
          <router-link to="/kyc" @click.native="finish()"
            class="block w-full py-3.5 bg-purple-600 text-white rounded-2xl font-semibold text-center hover:bg-purple-700 transition">
            Start KYC Verification
          </router-link>
          <button @click="finish" :disabled="loading"
            class="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>
            Do this later — go to dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Step counter -->
    <p class="text-center text-white/60 text-sm mt-5">Step {{ step }} of 3</p>
  </div>
</div>`
}
