export default {
    name: 'Login',
    data() { return { email:'', password:'', loading:false, error:null, show2fa:false, tempToken:'', twoFaCode:'' } },
    methods: {
        async submit() {
            this.loading=true; this.error=null
            try {
                const {data} = await this.$http.post('/auth/login',{email:this.email,password:this.password})
                if (data.data.requires_2fa) {
                    this.tempToken=data.data.temp_token; this.show2fa=true
                } else {
                    this.$auth.login(data.data.token,data.data.user)
                    this.$router.push(this.$route.query.redirect||'/dashboard')
                }
            } catch(e) { this.error=e.response?.data?.message||'Invalid credentials.' }
            this.loading=false
        },
        async verify2fa() {
            this.loading=true
            try {
                const {data} = await this.$http.post('/auth/2fa/verify',{temp_token:this.tempToken,code:this.twoFaCode})
                this.$auth.login(data.data.token,data.data.user)
                this.$router.push('/dashboard')
            } catch(e) { this.error=e.response?.data?.message||'Invalid code.' }
            this.loading=false
        }
    },
    template: `<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900 mt-4">{{ show2fa?'Two-Factor Authentication':'Welcome back' }}</h1>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div v-if="!show2fa" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="you@email.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
          <input v-model="password" type="password" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="••••••••">
        </div>
        <div class="flex justify-end">
          <router-link to="/forgot-password" class="text-sm text-green-700 hover:underline">Forgot password?</router-link>
        </div>
        <button @click="submit" :disabled="loading" class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Log in
        </button>
      </div>
      <div v-else class="space-y-4">
        <p class="text-sm text-gray-600">Enter the 6-digit code from your authenticator app or SMS.</p>
        <input v-model="twoFaCode" type="text" maxlength="6" @keyup.enter="verify2fa"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500" placeholder="000000">
        <button @click="verify2fa" :disabled="loading||twoFaCode.length<6" class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Verify
        </button>
      </div>
    </div>
    <p class="text-center text-sm text-gray-500 mt-5">
      Don't have an account? <router-link to="/register" class="text-green-700 font-medium hover:underline">Sign up</router-link>
    </p>
  </div>
</div>`
}
