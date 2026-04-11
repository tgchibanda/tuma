export default {
    name: 'Settings',
    data() {
        return {
            user: null, prefs: null,
            loading: true, saving: false,
            tab: 'notifications',
            // Password
            currentPassword: '', newPassword: '', confirmPassword: '',
            passwordLoading: false, passwordError: null, passwordSuccess: false,
            // 2FA
            twoFaLoading: false, twoFaQr: null, twoFaCode: '', twoFaError: null,
            // PIN
            pinStep: 'set', pin: '', pinConfirm: '', currentPin: '',
            pinLoading: false, pinError: null, pinSuccess: false
        }
    },
    async mounted() {
        await this.load()
    },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/user')
                this.user  = data.data
                this.prefs = { ...data.data.notification_preferences }
            } catch {}
            this.loading = false
        },
        async savePrefs() {
            this.saving = true
            try {
                await this.$http.put('/user/notifications/preferences', this.prefs)
                this.$toast.success('Notification preferences saved.')
            } catch { this.$toast.error('Failed to save preferences.') }
            this.saving = false
        },
        async changePassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.passwordError = 'Passwords do not match.'
                return
            }
            this.passwordLoading = true
            this.passwordError   = null
            try {
                await this.$http.put('/user/password', {
                    current_password: this.currentPassword,
                    password: this.newPassword,
                    password_confirmation: this.confirmPassword
                })
                this.passwordSuccess   = true
                this.currentPassword   = ''
                this.newPassword       = ''
                this.confirmPassword   = ''
                this.$toast.success('Password changed.')
            } catch (e) {
                this.passwordError = e.response?.data?.message || 'Failed to change password.'
            }
            this.passwordLoading = false
        },
        async setup2fa() {
            this.twoFaLoading = true
            try {
                const { data } = await this.$http.post('/auth/2fa/setup')
                this.twoFaQr = data.data
            } catch (e) { this.twoFaError = e.response?.data?.message || 'Failed.' }
            this.twoFaLoading = false
        },
        async confirm2fa() {
            this.twoFaLoading = true
            this.twoFaError = null
            try {
                await this.$http.post('/auth/2fa/confirm', { code: this.twoFaCode })
                this.$toast.success('Two-factor authentication enabled.')
                this.twoFaQr   = null
                this.twoFaCode = ''
                await this.load()
            } catch (e) { this.twoFaError = e.response?.data?.message || 'Invalid code.' }
            this.twoFaLoading = false
        },
        async disable2fa() {
            if (!confirm('Disable two-factor authentication? This reduces your account security.')) return
            this.twoFaLoading = true
            try {
                await this.$http.post('/auth/2fa/disable', { code: this.twoFaCode })
                this.$toast.success('2FA disabled.')
                this.twoFaCode = ''
                await this.load()
            } catch (e) { this.twoFaError = e.response?.data?.message || 'Invalid code.' }
            this.twoFaLoading = false
        },
        async setPin() {
            if (this.pin.length !== 6) { this.pinError = 'PIN must be 6 digits.'; return }
            if (this.pin !== this.pinConfirm) { this.pinError = 'PINs do not match.'; return }
            this.pinLoading = true
            this.pinError   = null
            try {
                await this.$http.post('/auth/pin/setup', {
                    pin: this.pin,
                    pin_confirmation: this.pinConfirm,
                    current_pin: this.currentPin || undefined
                })
                this.pinSuccess = true
                this.pin = ''; this.pinConfirm = ''; this.currentPin = ''
                this.$toast.success('Transaction PIN set.')
                await this.load()
            } catch (e) { this.pinError = e.response?.data?.message || 'Failed to set PIN.' }
            this.pinLoading = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <loading-spinner v-if="loading" />
    <div v-else>
      <!-- Tabs -->
      <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
        <button v-for="t in [
          {key:'notifications', label:'Notifications', icon:'fa-bell'},
          {key:'security',      label:'Security',      icon:'fa-lock'},
          {key:'pin',           label:'Transaction PIN', icon:'fa-key'},
        ]" :key="t.key" @click="tab = t.key"
          :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap',
            tab === t.key ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-800']">
          <i :class="'fas ' + t.icon + ' text-xs'"></i> {{ t.label }}
        </button>
      </div>

      <!-- Notifications tab -->
      <div v-if="tab === 'notifications' && prefs" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div class="space-y-4">
          <div v-for="pref in [
            {key:'email',        label:'Email notifications',     desc:'Receive updates by email'},
            {key:'inapp',        label:'In-app notifications',    desc:'Notifications inside TuMa'},
            {key:'sms',          label:'SMS notifications',       desc:'Text message alerts'},
            {key:'push',         label:'Push notifications',      desc:'Browser push notifications'},
            {key:'rate_alerts',  label:'Rate alerts',             desc:'Notify when target rate is reached'},
            {key:'matches',      label:'Match proposals',         desc:'When someone proposes a match'},
            {key:'chat',         label:'Chat messages',           desc:'New messages from your match partner'},
            {key:'transactions', label:'Transaction updates',     desc:'Status changes on your transactions'},
            {key:'marketing',    label:'Platform news',           desc:'Tips, features, and announcements'},
          ]" :key="pref.key"
            class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ pref.label }}</p>
              <p class="text-xs text-gray-500">{{ pref.desc }}</p>
            </div>
            <button @click="prefs[pref.key] = !prefs[pref.key]"
              :class="['relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0',
                prefs[pref.key] ? 'bg-green-600' : 'bg-gray-200']">
              <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                prefs[pref.key] ? 'translate-x-5' : 'translate-x-0']"></span>
            </button>
          </div>
        </div>
        <button @click="savePrefs" :disabled="saving"
          class="mt-6 w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i> Save Preferences
        </button>
      </div>

      <!-- Security tab -->
      <div v-if="tab === 'security'" class="space-y-5">
        <!-- Change password -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Change Password</h2>
          <alert-banner v-if="passwordError" type="error" :message="passwordError" />
          <alert-banner v-if="passwordSuccess" type="success" message="Password updated successfully." />
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Current password</label>
              <input v-model="currentPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="Your current password">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">New password</label>
              <input v-model="newPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="8+ characters">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Confirm new password</label>
              <input v-model="confirmPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="Repeat new password">
            </div>
            <button @click="changePassword" :disabled="passwordLoading || !currentPassword || !newPassword"
              class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
              <i v-if="passwordLoading" class="fas fa-spinner fa-spin mr-2"></i> Update Password
            </button>
          </div>
        </div>

        <!-- 2FA -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-semibold text-gray-900">Two-Factor Authentication</h2>
              <p class="text-sm text-gray-500 mt-0.5">Adds a second layer of security to your account</p>
            </div>
            <span :class="['text-xs font-semibold px-3 py-1 rounded-full',
              user.two_fa_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ user.two_fa_enabled ? 'Enabled' : 'Disabled' }}
            </span>
          </div>

          <alert-banner v-if="twoFaError" type="error" :message="twoFaError" />

          <div v-if="!user.two_fa_enabled">
            <div v-if="!twoFaQr">
              <p class="text-sm text-gray-600 mb-4">
                Use an authenticator app like Google Authenticator or Authy to generate login codes.
              </p>
              <button @click="setup2fa" :disabled="twoFaLoading"
                class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
                <i v-if="twoFaLoading" class="fas fa-spinner fa-spin mr-2"></i> Enable 2FA
              </button>
            </div>
            <div v-else class="space-y-4">
              <p class="text-sm text-gray-700">Scan this QR code with your authenticator app:</p>
              <div class="flex justify-center p-4 bg-white border border-gray-200 rounded-xl" v-html="twoFaQr.qr_code_svg"></div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                <code class="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg block text-center">{{ twoFaQr.secret }}</code>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Enter the 6-digit code to confirm</label>
                <input v-model="twoFaCode" type="text" maxlength="6"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
                  placeholder="000000">
              </div>
              <button @click="confirm2fa" :disabled="twoFaLoading || twoFaCode.length < 6"
                class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
                Confirm &amp; Enable 2FA
              </button>
            </div>
          </div>

          <div v-else class="space-y-3">
            <p class="text-sm text-gray-600">2FA is enabled. Enter your current code to disable it.</p>
            <input v-model="twoFaCode" type="text" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
            <button @click="disable2fa" :disabled="twoFaLoading || twoFaCode.length < 6"
              class="w-full py-3 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition">
              Disable 2FA
            </button>
          </div>
        </div>
      </div>

      <!-- PIN tab -->
      <div v-if="tab === 'pin'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Transaction PIN</h2>
        <p class="text-sm text-gray-500 mb-5">
          A 6-digit PIN required to confirm transactions.
          <span v-if="user.pin_set" class="text-green-600 font-medium ml-1">Currently set.</span>
          <span v-else class="text-orange-500 font-medium ml-1">Not yet set.</span>
        </p>

        <alert-banner v-if="pinError" type="error" :message="pinError" />
        <alert-banner v-if="pinSuccess" type="success" message="Transaction PIN updated." />

        <div class="space-y-4">
          <div v-if="user.pin_set">
            <label class="text-sm font-medium text-gray-700 block mb-1">Current PIN</label>
            <input v-model="currentPin" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">New PIN (6 digits)</label>
            <input v-model="pin" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Confirm new PIN</label>
            <input v-model="pinConfirm" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <button @click="setPin" :disabled="pinLoading || pin.length < 6 || pinConfirm.length < 6"
            class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="pinLoading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ user.pin_set ? 'Update PIN' : 'Set PIN' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
