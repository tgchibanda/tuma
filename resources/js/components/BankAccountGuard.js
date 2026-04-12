// BankAccountGuard.js
// Wrap around any page that requires a bank account.
// Shows a prompt if user has no bank accounts yet.
export const BankAccountGuard = {
    name: 'BankAccountGuard',
    data() { return { checked: false, hasBankAccount: false } },
    async mounted() {
        try {
            const { data } = await this.$http.get('/bank-accounts')
            this.hasBankAccount = (data.data || []).length > 0
        } catch {}
        this.checked = true
    },
    template: `
<div>
  <div v-if="!checked" class="flex justify-center items-center py-20">
    <div class="animate-spin w-8 h-8 rounded-full border-t-2 border-green-600 border-r-2 border-gray-200"></div>
  </div>

  <div v-else-if="!hasBankAccount"
    class="max-w-md mx-auto mt-12 bg-white rounded-3xl border border-orange-200 shadow-lg p-8 text-center">
    <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-university text-orange-500 text-2xl"></i>
    </div>
    <h2 class="text-xl font-bold text-gray-900 mb-2">Bank Account Required</h2>
    <p class="text-gray-500 text-sm mb-6">
      To send or receive money on eZimConnect, you need to add your Australian bank account first.
      This is where your AUD will be deposited or debited.
    </p>
    <router-link to="/bank-accounts"
      class="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors">
      <i class="fas fa-plus"></i> Add Bank Account
    </router-link>
    <p class="text-xs text-gray-400 mt-4">You can return here once your bank account is saved.</p>
  </div>

  <slot v-else />
</div>`
}

export default BankAccountGuard
