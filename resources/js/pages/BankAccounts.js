export default {
    name: 'BankAccounts',
    data() {
        return {
            accounts: [], loading: true,
            showForm: false,
            form: { bank_name: '', account_name: '', bsb_code: '', account_number: '', account_type: 'savings', country_id: 1 },
            saving: false, error: null,
            editId: null,
        }
    },
    computed: {
        hasPrimary() { return this.accounts.some(a => a.is_primary) }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/bank-accounts'); this.accounts = data.data || [] } catch {}
            this.loading = false
        },
        openForm() { this.showForm = true; this.editId = null; this.form = { bank_name: '', account_name: '', bsb_code: '', account_number: '', account_type: 'savings', country_id: 1 }; this.error = null },
        async save() {
            this.saving = true; this.error = null
            try {
                if (this.editId) {
                    await this.$http.put('/bank-accounts/' + this.editId, this.form)
                    this.$toast.success('Account updated.')
                } else {
                    await this.$http.post('/bank-accounts', this.form)
                    this.$toast.success('Bank account added.')
                }
                this.showForm = false
                await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed to save.' }
            this.saving = false
        },
        edit(acc) {
            this.editId  = acc.id
            this.form    = { bank_name: acc.bank_name, account_name: acc.account_name, bsb_code: acc.bsb_code || '', account_number: acc.account_number, account_type: acc.account_type || 'savings', country_id: acc.country_id || 1 }
            this.showForm= true; this.error = null
        },
        async setPrimary(id) {
            try { await this.$http.put('/bank-accounts/' + id + '/set-primary'); await this.load() } catch {}
        },
        async remove(id) {
            if (!confirm('Remove this bank account?')) return
            try { await this.$http.delete('/bank-accounts/' + id); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bank Accounts</h1>
        <p class="text-sm text-gray-500 mt-0.5">Your Australian bank accounts for AUD transactions.</p>
      </div>
      <button @click="openForm()" v-if="accounts.length < 5"
        class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Add account
      </button>
    </div>

    <!-- No bank account warning -->
    <div v-if="!loading && !accounts.length"
      class="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5 flex items-start gap-3">
      <i class="fas fa-exclamation-triangle text-orange-500 text-xl flex-shrink-0 mt-0.5"></i>
      <div>
        <p class="font-bold text-orange-800 mb-1">No bank account added</p>
        <p class="text-sm text-orange-700">You need at least one Australian bank account before you can create or accept orders. Add one now to start sending or receiving money.</p>
      </div>
    </div>

    <!-- Add/Edit form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-900">{{ editId ? 'Edit' : 'Add' }} bank account</h2>
        <button @click="showForm = false" class="p-1 text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Bank name <span class="text-red-500">*</span></label>
          <input v-model="form.bank_name" type="text" placeholder="e.g. NAB, ANZ, Commonwealth Bank"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Account holder name <span class="text-red-500">*</span></label>
          <input v-model="form.account_name" type="text" placeholder="Full name as on the account"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">BSB <span class="text-gray-400 font-normal">(xxx-xxx)</span></label>
            <input v-model="form.bsb_code" type="text" placeholder="083-001"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Account number <span class="text-red-500">*</span></label>
            <input v-model="form.account_number" type="text" placeholder="123456789"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
          </div>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Account type</label>
          <select v-model="form.account_type" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="savings">Savings</option>
            <option value="cheque">Cheque / Transaction</option>
          </select>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="save" :disabled="saving || !form.bank_name || !form.account_name || !form.account_number"
            class="flex-1 py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
            {{ editId ? 'Save changes' : 'Add account' }}
          </button>
          <button @click="showForm = false" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="accounts.length" class="space-y-3">
      <div v-for="acc in accounts" :key="acc.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-university text-blue-600"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <p class="font-bold text-gray-900">{{ acc.bank_name }}</p>
                <span v-if="acc.is_primary" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Primary</span>
              </div>
              <p class="text-sm text-gray-600">{{ acc.account_name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <span v-if="acc.bsb_code">BSB {{ acc.bsb_code }} · </span>
                Account ····{{ (acc.account_number || '').slice(-4) }}
              </p>
            </div>
          </div>
          <div class="flex gap-1.5 flex-shrink-0">
            <button v-if="!acc.is_primary" @click="setPrimary(acc.id)"
              class="px-2.5 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
              Set primary
            </button>
            <button @click="edit(acc)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button @click="remove(acc.id)" :disabled="acc.is_primary"
              class="p-1.5 rounded-lg transition-colors"
              :class="acc.is_primary ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:bg-red-50 hover:text-red-600'"
              :title="acc.is_primary ? 'Cannot delete primary account' : 'Delete'">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs text-center text-gray-400 pt-1">{{ accounts.length }}/5 accounts used</p>
    </div>

    <div v-else-if="!showForm" class="text-center py-4">
      <button @click="openForm()" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus"></i> Add your first bank account
      </button>
    </div>
  </div>
  <app-footer />
</div>`
}
