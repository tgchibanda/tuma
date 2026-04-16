export default {
    name: 'Register',
    data() {
        return {
            form: {
                first_name: '', last_name: '', email: '',
                phone: '', password: '', password_confirmation: '',
                country_id: 1, referral_code: '',
                captcha_answer: '',
                captcha_token: '',
            },
            loading: false,
            error: null,
            captcha: { question: '', answer: 0, token: '' },
        }
    },
    async created() {
        if (this.$route.query.ref) this.form.referral_code = this.$route.query.ref
        this.newCaptcha()
    },
    methods: {
        newCaptcha() {
            // Simple math challenge — a + b where a ∈ [3,9], b ∈ [2,8]
            // Token = btoa(answer + salt) to prevent trivial inspection
            const a = Math.floor(Math.random() * 7) + 3
            const b = Math.floor(Math.random() * 7) + 2
            const ops = [
                { label: `${a} + ${b}`,  ans: a + b },
                { label: `${a} × ${b}`,  ans: a * b },
                { label: `${a + b} − ${b}`, ans: a },
            ]
            const op = ops[Math.floor(Math.random() * ops.length)]
            const salt = Math.random().toString(36).slice(2)
            this.captcha = {
                question: `What is ${op.label}?`,
                answer:   op.ans,
                token:    btoa(op.ans + ':' + salt),
                salt,
            }
            this.form.captcha_answer = ''
            this.form.captcha_token  = this.captcha.token
        },
        captchaValid() {
            return parseInt(this.form.captcha_answer) === this.captcha.answer
        },
        async submit() {
            if (!this.form.captcha_answer) {
                this.error = 'Please answer the security question.'
                return
            }
            if (!this.captchaValid()) {
                this.error = 'Incorrect answer. Please try again.'
                this.newCaptcha()
                return
            }
            this.loading = true
            this.error = null
            try {
                const { data } = await this.$http.post('/auth/register', this.form)
                this.$auth.login(data.data.token, data.data.user)
                this.$router.push('/onboarding')
            } catch (e) {
                const errs = e.response?.data?.errors
                this.error = errs
                    ? Object.values(errs).flat()[0]
                    : e.response?.data?.message || 'Registration failed.'
                this.newCaptcha()
            }
            this.loading = false
        }
    },
    template: `<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex items-center justify-center">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900 mt-4">Create your account</h1>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">First name</label>
            <input v-model="form.first_name" type="text" autocomplete="given-name"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Tendai">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Last name</label>
            <input v-model="form.last_name" type="text" autocomplete="family-name"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Moyo">
          </div>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <input v-model="form.email" type="email" autocomplete="email"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="you@email.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Phone (Australian)</label>
          <input v-model="form.phone" type="tel" autocomplete="tel"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="+61 412 345 678">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Password</label>
          <input v-model="form.password" type="password" autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="8+ characters">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Confirm password</label>
          <input v-model="form.password_confirmation" type="password" autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="Repeat password">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Referral code <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.referral_code" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 uppercase"
            placeholder="e.g. ABC12345">
        </div>

        <!-- Math captcha — no external service needed -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Security check</label>
            <button type="button" @click="newCaptcha"
              class="text-xs text-green-700 hover:underline flex items-center gap-1">
              <i class="fas fa-sync-alt text-xs"></i> New question
            </button>
          </div>
          <p class="text-sm font-semibold text-gray-800 mb-2">{{ captcha.question }}</p>
          <input v-model="form.captcha_answer" type="number" inputmode="numeric"
            @keyup.enter="submit"
            :class="['w-full px-4 py-2.5 border rounded-xl focus:outline-none text-center text-lg font-bold transition-colors',
              form.captcha_answer === ''
                ? 'border-gray-200 focus:border-green-500'
                : captchaValid()
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-red-300 bg-red-50 text-red-600']"
            placeholder="Your answer">
        </div>

        <button @click="submit" :disabled="loading"
          class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Create Account
        </button>
        <p class="text-xs text-center text-gray-400">
          By creating an account you agree to our
          <router-link to="/terms" class="underline hover:text-gray-600">Terms of Service</router-link>
          and
          <router-link to="/privacy" class="underline hover:text-gray-600">Privacy Policy</router-link>.
        </p>
      </div>
    </div>

    <p class="text-center text-sm text-gray-500 mt-5">
      Already have an account?
      <router-link to="/login" class="text-green-700 font-medium hover:underline">Log in</router-link>
    </p>
  </div>
</div>`
}
