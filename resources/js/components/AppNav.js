export default {
    name: 'AppNav',
    data() {
        return {
            drawerOpen: false,
            unreadCount: 0,
            unreadPoll: null,
            user: null
        }
    },
    computed: {
        isAdmin() { return this.user?.role === 'admin' },
        kycBadge() {
            if (!this.user) return null
            if (this.user.kyc_status === 'approved') return null
            if (this.user.kyc_status === 'submitted') return { color: 'bg-blue-100 text-blue-700', label: 'KYC pending' }
            if (this.user.kyc_status === 'rejected')  return { color: 'bg-red-100 text-red-700', label: 'KYC rejected' }
            return { color: 'bg-yellow-100 text-yellow-700', label: 'Verify ID' }
        },
        navLinks() {
            return [
                { to: '/dashboard', label: 'Dashboard', icon: 'fa-th-large' },
                { to: '/orders',    label: 'Orders',    icon: 'fa-list-alt' },
                { to: '/browse',    label: 'Browse',    icon: 'fa-search' },
                { to: '/matches',   label: 'Matches',   icon: 'fa-handshake' },
                { to: '/directory', label: 'Directory', icon: 'fa-users' },
            ]
        }
    },
    async mounted() {
        this.user = this.$auth.user
        if (this.$auth.isLoggedIn) {
            this.fetchUnread()
            this.unreadPoll = setInterval(this.fetchUnread, 30000)
        }
    },
    beforeDestroy() { clearInterval(this.unreadPoll) },
    methods: {
        async fetchUnread() {
            try {
                const { data } = await this.$http.get('/user/notifications?per_page=1')
                this.unreadCount = (data.data || []).filter(n => !n.read_at).length
            } catch {}
        },
        async logout() {
            try { await this.$http.post('/auth/logout') } catch {}
            this.$auth.logout()
            this.$router.push('/login')
        },
        closeDrawer() { this.drawerOpen = false }
    },
    template: `
<div>
  <!-- Main nav bar -->
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <router-link to="/dashboard" class="flex items-center gap-2.5 flex-shrink-0" @click.native="closeDrawer">
          <div class="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-sm tracking-tight">Tu</span>
          </div>
          <span class="text-xl font-extrabold text-gray-900 hidden sm:block">
            Tu<span class="text-green-700">Ma</span>
          </span>
        </router-link>

        <!-- Desktop links -->
        <div class="hidden lg:flex items-center gap-0.5">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
            active-class="text-green-700 bg-green-50 font-semibold">
            <i :class="'fas ' + link.icon + ' text-xs opacity-70'"></i>
            {{ link.label }}
          </router-link>
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-2">

          <!-- KYC badge -->
          <router-link v-if="kycBadge" to="/kyc"
            :class="['hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer', kycBadge.color]">
            <i class="fas fa-id-card text-xs"></i>
            {{ kycBadge.label }}
          </router-link>

          <!-- Create order CTA -->
          <router-link to="/orders/create"
            class="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-sm">
            <i class="fas fa-plus text-xs"></i>
            Send Money
          </router-link>

          <!-- Notifications -->
          <router-link to="/notifications"
            class="relative p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">
            <i class="far fa-bell text-lg"></i>
            <span v-if="unreadCount > 0"
              class="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </router-link>

          <!-- User avatar + dropdown -->
          <div class="relative hidden sm:block group">
            <button class="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ user ? user.first_name[0].toUpperCase() : '?' }}
              </div>
              <div class="text-left hidden md:block">
                <p class="text-sm font-semibold text-gray-800 leading-none max-w-28 truncate">{{ user ? user.first_name : '' }}</p>
                <p class="text-xs text-gray-400 mt-0.5 capitalize">{{ user ? user.account_type : '' }}</p>
              </div>
              <i class="fas fa-chevron-down text-xs text-gray-400 ml-0.5"></i>
            </button>

            <!-- Dropdown menu -->
            <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div class="px-4 py-2.5 border-b border-gray-100 mb-1">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ user ? user.first_name + ' ' + user.last_name : '' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user ? user.email : '' }}</p>
              </div>

              <router-link to="/profile"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="far fa-user w-4 text-gray-400 text-center"></i> Profile
              </router-link>
              <router-link to="/kyc"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="fas fa-id-card w-4 text-gray-400 text-center"></i>
                Verification
                <span v-if="kycBadge" :class="['ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium', kycBadge.color]">!</span>
              </router-link>
              <router-link to="/bank-accounts"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="fas fa-university w-4 text-gray-400 text-center"></i> Bank Accounts
              </router-link>
              <router-link to="/history"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="fas fa-history w-4 text-gray-400 text-center"></i> Trade History
              </router-link>
              <router-link to="/referral"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="fas fa-gift w-4 text-gray-400 text-center"></i> Referrals
              </router-link>
              <router-link to="/settings"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <i class="fas fa-cog w-4 text-gray-400 text-center"></i> Settings
              </router-link>

              <template v-if="isAdmin">
                <div class="border-t border-gray-100 my-1"></div>
                <router-link to="/admin/dashboard"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-medium transition-colors">
                  <i class="fas fa-shield-alt w-4 text-center"></i> Admin Panel
                </router-link>
              </template>

              <div class="border-t border-gray-100 mt-1 pt-1">
                <button @click="logout"
                  class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                  <i class="fas fa-sign-out-alt w-4 text-center"></i> Log out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile hamburger -->
          <button @click="drawerOpen = !drawerOpen"
            class="lg:hidden p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">
            <i :class="['fas text-lg transition-transform', drawerOpen ? 'fa-times' : 'fa-bars']"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile drawer overlay -->
  <transition name="fade">
    <div v-if="drawerOpen" class="fixed inset-0 bg-black/30 z-30 lg:hidden" @click="drawerOpen = false"></div>
  </transition>

  <!-- Mobile drawer -->
  <transition name="slide-left">
    <div v-if="drawerOpen"
      class="fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col overflow-y-auto">

      <!-- Drawer header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-sm">Tu</span>
          </div>
          <span class="text-xl font-extrabold">Tu<span class="text-green-700">Ma</span></span>
        </div>
        <button @click="drawerOpen = false" class="p-2 text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- User info in drawer -->
      <div v-if="user" class="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
            {{ user.first_name[0].toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        <div v-if="kycBadge" class="mt-2">
          <router-link to="/kyc" @click.native="closeDrawer"
            :class="['inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg', kycBadge.color]">
            <i class="fas fa-id-card text-xs"></i> {{ kycBadge.label }}
          </router-link>
        </div>
      </div>

      <!-- CTA -->
      <div class="p-4 border-b border-gray-100">
        <router-link to="/orders/create" @click.native="closeDrawer"
          class="flex items-center justify-center gap-2 w-full py-3 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
          <i class="fas fa-plus"></i> Send Money Now
        </router-link>
      </div>

      <!-- Nav links -->
      <nav class="p-3 flex-1">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
          @click.native="closeDrawer"
          class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors mb-0.5"
          active-class="bg-green-50 text-green-700 font-semibold">
          <i :class="['fas w-5 text-center', link.icon]"></i>
          {{ link.label }}
        </router-link>

        <div class="border-t border-gray-100 mt-3 pt-3">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Account</p>
          <router-link v-for="link in [
            {to:'/profile',         label:'Profile',         icon:'fa-user'},
            {to:'/kyc',             label:'Verification',    icon:'fa-id-card'},
            {to:'/bank-accounts',   label:'Bank Accounts',   icon:'fa-university'},
            {to:'/notifications',   label:'Notifications',   icon:'fa-bell'},
            {to:'/history',         label:'Trade History',   icon:'fa-history'},
            {to:'/referral',        label:'Referrals',       icon:'fa-gift'},
            {to:'/settings',        label:'Settings',        icon:'fa-cog'},
          ]" :key="link.to" :to="link.to" @click.native="closeDrawer"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-0.5">
            <i :class="['fas w-5 text-center text-gray-400', link.icon]"></i>
            {{ link.label }}
          </router-link>
        </div>

        <div v-if="isAdmin" class="border-t border-gray-100 mt-3 pt-3">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin</p>
          <router-link to="/admin/dashboard" @click.native="closeDrawer"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-green-700 font-medium hover:bg-green-50 transition-colors">
            <i class="fas fa-shield-alt w-5 text-center"></i> Admin Panel
          </router-link>
        </div>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-100">
        <button @click="logout; closeDrawer()"
          class="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
          <i class="fas fa-sign-out-alt w-5 text-center"></i> Log out
        </button>
      </div>
    </div>
  </transition>

  <style>
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
  .fade-enter, .fade-leave-to { opacity: 0; }
  .slide-left-enter-active, .slide-left-leave-active { transition: transform 0.25s ease; }
  .slide-left-enter, .slide-left-leave-to { transform: translateX(-100%); }
  </style>
</div>`
}
