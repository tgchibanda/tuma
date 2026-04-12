export default {
    name: 'AdminLogin',
    data() { return { email: '', password: '', loading: false, error: null } },
    methods: {
        async submit() {
            this.loading = true; this.error = null
            try {
                const { data } = await this.$http.post('/../../api/admin/auth/login', {
                    email: this.email, password: this.password
                })
                this.$auth.login(data.data.token, data.data.admin)
                this.$router.push('/admin/dashboard')
            } catch (e) {
                this.error = e.response?.data?.message || 'Invalid admin credentials.'
            }
            this.loading = false
        }
    },
    template: `<div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <i class="fas fa-shield-alt text-white text-xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900">eZimConnect Admin Panel</h1>
      <p class="text-sm text-gray-500 mt-1">Authorised access only</p>
    </div>
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="admin@tuma.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
          <input v-model="password" type="password" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="••••••••">
        </div>
        <button @click="submit" :disabled="loading"
          class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Sign in to Admin
        </button>
      </div>
    </div>
    <p class="text-center text-sm mt-5">
      <router-link to="/login" class="text-gray-500 hover:text-gray-700">← User login</router-link>
    </p>
  </div>
</div>`
}
