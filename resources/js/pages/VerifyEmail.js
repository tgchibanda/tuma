export default {
    name: 'VerifyEmail',
    data() {
        return {
            status: 'verifying',  // verifying | success | error | already
            message: '',
        }
    },
    async mounted() {
        const { id, hash } = this.$route.params

        if (!id || !hash) {
            this.status  = 'error'
            this.message = 'Invalid verification link.'
            return
        }

        try {
            const { data } = await this.$http.get(
                `/auth/verify-email/${id}/${hash}`
            )

            // If the user is already logged in, update their session
            if (this.$auth.isLoggedIn) {
                try {
                    const me = await this.$http.get('/user')
                    this.$auth.setUser(me.data.data)
                } catch {}
            }

            if (data.message && data.message.toLowerCase().includes('already')) {
                this.status = 'already'
            } else {
                this.status = 'success'
            }
        } catch (e) {
            this.status  = 'error'
            this.message = e.response?.data?.message || 'Verification failed. The link may have expired.'
        }
    },
    methods: {
        proceed() {
            if (this.$auth.isLoggedIn) {
                this.$router.push('/onboarding')
            } else {
                this.$router.push('/login')
            }
        }
    },
    template: `
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm text-center">

    <!-- Logo -->
    <router-link to="/" class="inline-flex justify-center mb-8">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
    </router-link>

    <!-- Verifying spinner -->
    <div v-if="status === 'verifying'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4 block"></i>
      <p class="text-gray-600 font-medium">Verifying your email…</p>
    </div>

    <!-- Success -->
    <div v-else-if="status === 'success'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-green-600 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Email verified!</h1>
      <p class="text-gray-500 text-sm mb-7">
        Your email address has been confirmed. Your account is ready.
      </p>
      <button @click="proceed"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Continue to account setup
      </button>
    </div>

    <!-- Already verified -->
    <div v-else-if="status === 'already'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-blue-500 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Already verified</h1>
      <p class="text-gray-500 text-sm mb-7">
        This email address is already verified. You can log in and continue.
      </p>
      <button @click="proceed"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Go to dashboard
      </button>
    </div>

    <!-- Error -->
    <div v-else-if="status === 'error'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-times-circle text-red-500 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Verification failed</h1>
      <p class="text-gray-500 text-sm mb-7">{{ message }}</p>
      <router-link to="/login"
        class="block w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Back to login
      </router-link>
    </div>

  </div>
</div>`
}
