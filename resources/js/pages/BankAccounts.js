// ── BankAccounts.js ───────────────────────────────────────────────────────
export const BankAccounts = {
    name: 'BankAccounts',
    data() {
        return {
            accounts: [], loading: true,
            form: { bank_name:'', account_name:'', account_number:'', bsb_code:'', country_id: 1 },
            showForm: false, saving: false, error: null
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/bank-accounts'); this.accounts = data.data } catch {}
            this.loading = false
        },
        async add() {
            this.saving = true; this.error = null
            try {
                await this.$http.post('/bank-accounts', this.form)
                this.$toast.success('Bank account added.')
                this.showForm = false
                this.form = { bank_name:'', account_name:'', account_number:'', bsb_code:'', country_id:1 }
                await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed to add account.' }
            this.saving = false
        },
        async setPrimary(id) {
            try { await this.$http.put('/bank-accounts/' + id + '/set-primary'); await this.load() } catch {}
        },
        async remove(id) {
            if (!confirm('Delete this bank account?')) return
            try {
                await this.$http.delete('/bank-accounts/' + id)
                this.$toast.success('Account deleted.')
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Cannot delete.') }
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Bank Accounts</h1>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition">
        <i class="fas fa-plus"></i> Add Account
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">New Bank Account</h2>
      <alert-banner v-if="error" type="error" :message="error" />
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Bank name *</label>
          <input v-model="form.bank_name" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="e.g. National Australia Bank">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Account name *</label>
          <input v-model="form.account_name" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Name on the account">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">BSB</label>
            <input v-model="form.bsb_code" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="000-000">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Account number *</label>
            <input v-model="form.account_number" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="12345678">
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="add" :disabled="saving || !form.bank_name || !form.account_name || !form.account_number"
            class="flex-1 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i> Add Account
          </button>
          <button @click="showForm=false" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="accounts.length" class="space-y-3">
      <div v-for="acc in accounts" :key="acc.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-semibold text-gray-900">{{ acc.bank_name }}</p>
              <span v-if="acc.is_primary" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
              <span v-if="acc.is_verified" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
            </div>
            <p class="text-sm text-gray-600">{{ acc.account_name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ acc.bsb_code ? acc.bsb_code + ' · ' : '' }}{{ acc.account_number }}</p>
          </div>
          <div class="flex gap-2">
            <button v-if="!acc.is_primary" @click="setPrimary(acc.id)"
              class="text-xs text-blue-600 hover:underline px-2">Set primary</button>
            <button @click="remove(acc.id)" class="text-xs text-red-500 hover:underline px-2">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <empty-state v-else icon="fa-university" title="No bank accounts" subtitle="Add your Australian bank account to start trading." />
  </div>
  <app-footer />
</div>`
}

export default BankAccounts
