export default {
    name: 'Register',
    data() { return { form:{first_name:'',last_name:'',email:'',phone:'',password:'',password_confirmation:'',country_id:1,referral_code:''}, loading:false, error:null } },
    async created() {
        if (this.$route.query.ref) this.form.referral_code = this.$route.query.ref
    },
    methods: {
        async submit() {
            this.loading=true; this.error=null
            try {
                const {data} = await this.$http.post('/auth/register',this.form)
                this.$auth.login(data.data.token,data.data.user)
                this.$router.push('/onboarding')
            } catch(e) {
                const errs = e.response?.data?.errors
                this.error = errs ? Object.values(errs).flat()[0] : e.response?.data?.message||'Registration failed.'
            }
            this.loading=false
        }
    },
    template: `<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex items-center gap-2">
        <div class="w-10 h-10 bg-green-700 rounded-2xl flex items-center justify-center">
          <span class="text-white font-bold">Tu</span>
        </div>
        <span class="text-2xl font-bold text-gray-900">Tu<span class="text-green-700">Ma</span></span>
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900 mt-4">Create your account</h1>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">First name</label>
            <input v-model="form.first_name" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Tendai">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Last name</label>
            <input v-model="form.last_name" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Moyo">
          </div>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="you@email.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Phone (Australian)</label>
          <input v-model="form.phone" type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="+61 412 345 678">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="8+ characters">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Confirm password</label>
          <input v-model="form.password_confirmation" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Repeat password">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Referral code <span class="text-gray-400 font-normal">(optional)</span></label>
          <input v-model="form.referral_code" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 uppercase" placeholder="e.g. ABC12345">
        </div>
        <button @click="submit" :disabled="loading" class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Create Account
        </button>
        <p class="text-xs text-center text-gray-400">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
    <p class="text-center text-sm text-gray-500 mt-5">
      Already have an account? <router-link to="/login" class="text-green-700 font-medium hover:underline">Log in</router-link>
    </p>
  </div>
</div>`
}
