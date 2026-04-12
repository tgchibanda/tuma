export default {
    name: 'Onboarding',
    data() {
        return {
            step: 'verify-email',  // verify-email | profile | complete
            user: null,
            resending: false,
            resendCooldown: 0,
            resendTimer: null,
            checkingVerification: false,
            pollTimer: null,
        }
    },
    computed: {
        isVerified() {
            return this.user && this.user.email_verified
        }
    },
    mounted() {
        this.user = this.$auth.user
        if (this.isVerified) {
            this.step = this.user.onboarding_completed ? 'complete' : 'profile'
        } else {
            this.startPolling()
        }
    },
    beforeDestroy() {
        clearInterval(this.pollTimer)
        clearInterval(this.resendTimer)
    },
    methods: {
        // Poll the server every 5s to detect when the user clicks the email link
        startPolling() {
            this.pollTimer = setInterval(async () => {
                try {
                    const { data } = await this.$http.get('/user')
                    const u = data.data
                    this.$auth.setUser(u)
                    this.user = u
                    if (u.email_verified) {
                        clearInterval(this.pollTimer)
                        this.step = 'profile'
                        this.$toast.success('Email verified! Let\'s finish setting up your account.')
                    }
                } catch {}
            }, 5000)
        },

        async resendEmail() {
            if (this.resendCooldown > 0) return
            this.resending = true
            try {
                await this.$http.post('/auth/resend-verification')
                this.$toast.success('Verification email sent. Please check your inbox.')
                this.resendCooldown = 60
                this.resendTimer = setInterval(() => {
                    this.resendCooldown--
                    if (this.resendCooldown <= 0) clearInterval(this.resendTimer)
                }, 1000)
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed to resend. Please try again.')
            }
            this.resending = false
        },

        async completeOnboarding() {
            try {
                await this.$http.post('/user/complete-onboarding')
            } catch {}
            this.$router.push('/dashboard')
        }
    },
    template: `
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
  <div class="w-full max-w-md">

    <!-- Header -->
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex justify-center mb-4">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
      </router-link>
    </div>

    <!-- Step: Verify Email -->
    <div v-if="step === 'verify-email'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
      <p class="text-gray-500 text-sm mb-1">
        We sent a verification link to
      </p>
      <p class="font-semibold text-gray-900 mb-5">{{ user && user.email }}</p>
      <p class="text-gray-400 text-xs mb-6">
        Click the link in the email to verify your address. This page will update automatically once verified.
      </p>

      <!-- Animated waiting indicator -->
      <div class="flex items-center justify-center gap-1.5 mb-6">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0s"></div>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0.15s"></div>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0.3s"></div>
        <span class="text-xs text-gray-400 ml-2">Waiting for verification…</span>
      </div>

      <button @click="resendEmail" :disabled="resending || resendCooldown > 0"
        class="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition mb-3">
        <i v-if="resending" class="fas fa-spinner fa-spin mr-1.5"></i>
        {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend verification email' }}
      </button>

      <p class="text-xs text-gray-400">
        Wrong email?
        <button @click="$auth.logout(); $router.push('/register')"
          class="text-green-700 font-medium hover:underline">
          Start over
        </button>
      </p>
    </div>

    <!-- Step: Profile setup -->
    <div v-else-if="step === 'profile'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-green-600 text-2xl"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-1 text-center">Email verified!</h2>
      <p class="text-gray-400 text-sm text-center mb-7">Your account is ready. Here's what to do next.</p>

      <!-- Checklist of next steps -->
      <div class="space-y-3 mb-7">
        <div v-for="item in [
          { icon: 'fa-id-card',     label: 'Complete KYC verification',   sub: 'Required to trade — takes 5 minutes', to: '/kyc' },
          { icon: 'fa-university',  label: 'Add your Australian bank account', sub: 'Needed to receive AUD from completed trades', to: '/bank-accounts' },
          { icon: 'fa-user',        label: 'Set up your profile',         sub: 'Add a photo and bio to build trust',   to: '/profile' },
        ]" :key="item.label"
          class="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition cursor-pointer"
          @click="$router.push(item.to)">
          <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <i :class="['fas', item.icon, 'text-green-600 text-sm']"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ item.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.sub }}</p>
          </div>
          <i class="fas fa-chevron-right text-gray-300 text-xs ml-auto mt-1.5"></i>
        </div>
      </div>

      <button @click="completeOnboarding"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Go to Dashboard
      </button>
    </div>

  </div>
</div>`
}
