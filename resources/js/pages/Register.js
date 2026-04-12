export default {
    name: 'Register',
    data() {
        return {
            form: {
                first_name: '', last_name: '', email: '',
                phone: '', password: '', password_confirmation: '',
                country_id: 1, referral_code: '',
                captcha_token: '',
            },
            loading: false,
            error: null,
            captchaReady: false,
            captchaWidgetId: null,
        }
    },
    async created() {
        if (this.$route.query.ref) this.form.referral_code = this.$route.query.ref
    },
    mounted() {
        // Load hCaptcha script
        if (window.hcaptcha) {
            this.renderCaptcha()
        } else {
            const script = document.createElement('script')
            script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit'
            script.async = true
            script.defer = true
            script.onload = () => this.renderCaptcha()
            document.head.appendChild(script)
        }
    },
    beforeDestroy() {
        // Clean up captcha widget
        if (this.captchaWidgetId !== null && window.hcaptcha) {
            try { window.hcaptcha.reset(this.captchaWidgetId) } catch {}
        }
    },
    methods: {
        renderCaptcha() {
            this.$nextTick(() => {
                const el = this.$el.querySelector('#hcaptcha-box')
                if (!el || !window.hcaptcha) return
                this.captchaWidgetId = window.hcaptcha.render(el, {
                    sitekey: window.HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001',
                    theme: 'light',
                    callback: (token) => {
                        this.form.captcha_token = token
                        this.captchaReady = true
                    },
                    'expired-callback': () => {
                        this.form.captcha_token = ''
                        this.captchaReady = false
                    },
                    'error-callback': () => {
                        this.form.captcha_token = ''
                        this.captchaReady = false
                    },
                })
            })
        },
        async submit() {
            if (!this.form.captcha_token) {
                this.error = 'Please complete the security check before continuing.'
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
                // Reset captcha on error
                if (window.hcaptcha && this.captchaWidgetId !== null) {
                    window.hcaptcha.reset(this.captchaWidgetId)
                    this.form.captcha_token = ''
                    this.captchaReady = false
                }
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

        <!-- hCaptcha widget -->
        <div class="flex justify-center">
          <div id="hcaptcha-box"></div>
        </div>

        <button @click="submit" :disabled="loading || !captchaReady"
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
