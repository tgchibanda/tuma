export default {
    name: 'ForgotPassword',
    data() { return { email: '', loading: false, sent: false, error: null } },
    methods: {
        async submit() {
            if (!this.email) return
            this.loading = true; this.error = null
            try {
                await this.$http.post('/auth/forgot-password', { email: this.email })
                this.sent = true
            } catch (e) { this.error = e.response?.data?.message || 'Failed to send reset link.' }
            this.loading = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-md flex flex-col items-start justify-center px-2.5 gap-1" style="background:linear-gradient(145deg,#1a6b3c,#2d9460);">
        <div class="flex items-center w-full gap-0.5"><span class="text-[6px] font-black text-yellow-400 leading-none">AUD</span><div class="flex-1 h-px bg-yellow-400"></div></div>
        <div class="flex items-center w-full gap-0.5 flex-row-reverse"><span class="text-[6px] font-black text-white leading-none">USD</span><div class="flex-1 h-px bg-white opacity-70"></div></div>
      </div>
      <h1 class="text-2xl font-black text-gray-900" style="font-family:Georgia,serif;">Tu<span style="color:#f59e0b;">Ma</span></h1>
      <p class="text-sm text-gray-500 mt-1">Reset your password</p>
    </div>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <div v-if="!sent">
        <h2 class="text-lg font-bold text-gray-900 mb-1">Forgot your password?</h2>
        <p class="text-sm text-gray-500 mb-5">Enter your email and we will send you a reset link.</p>
        <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="you@example.com">
        </div>
        <button @click="submit" :disabled="loading || !email"
          class="w-full py-3.5 font-bold text-white rounded-xl disabled:opacity-50 transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Send reset link
        </button>
      </div>
      <div v-else class="text-center py-4">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
        <p class="text-sm text-gray-500 mb-4">We sent a reset link to <strong>{{ email }}</strong>. Check your spam folder too.</p>
        <button @click="sent = false; email = ''" class="text-sm text-green-700 hover:underline font-medium">Try a different email</button>
      </div>
    </div>
    <p class="text-center mt-5 text-sm">
      <router-link to="/login" class="text-green-700 font-semibold hover:underline">
        <i class="fas fa-arrow-left text-xs mr-1"></i> Back to log in
      </router-link>
    </p>
  </div>
</div>`
}
