export default {
    name: 'ResetPassword',
    data() { return { password: '', confirm: '', loading: false, done: false, error: null } },
    computed: {
        token() { return this.$route.query.token || '' },
        email() { return this.$route.query.email || '' }
    },
    methods: {
        async submit() {
            if (this.password !== this.confirm) { this.error = 'Passwords do not match.'; return }
            this.loading = true; this.error = null
            try {
                await this.$http.post('/auth/reset-password', {
                    token: this.token, email: this.email,
                    password: this.password, password_confirmation: this.confirm
                })
                this.done = true
                setTimeout(() => this.$router.push('/login'), 3000)
            } catch (e) { this.error = e.response?.data?.message || 'Reset failed. The link may have expired.' }
            this.loading = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-black text-gray-900" style="font-family:Georgia,serif;">Tu<span style="color:#f59e0b;">Ma</span></h1>
      <p class="text-sm text-gray-500 mt-1">Create a new password</p>
    </div>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <div v-if="!done">
        <h2 class="text-lg font-bold text-gray-900 mb-5">Set new password</h2>
        <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">New password</label>
            <input v-model="password" type="password"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="8+ characters">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">Confirm password</label>
            <input v-model="confirm" type="password" @keyup.enter="submit"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Repeat new password">
          </div>
          <button @click="submit" :disabled="loading || !password || !confirm"
            class="w-full py-3.5 font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Reset password
          </button>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check-circle text-green-600 text-2xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Password reset!</h2>
        <p class="text-sm text-gray-500">Redirecting you to log in...</p>
        <router-link to="/login" class="inline-block mt-4 text-sm text-green-700 font-semibold hover:underline">Go to login now</router-link>
      </div>
    </div>
  </div>
</div>`
}
