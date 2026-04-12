export default {
    name: 'AppNav',
    data() {
        return {
            mobileOpen: false,
            unreadCount: 0,
            unreadPoll: null
        }
    },
    computed: {
        user()    { return this.$auth.user },
        isAdmin() { return this.user?.role === 'admin' }
    },
    mounted() {
        if (this.$auth.isLoggedIn) {
            this.fetchUnreadCount()
            this.unreadPoll = setInterval(this.fetchUnreadCount, 30000)
        }
    },
    beforeDestroy() {
        clearInterval(this.unreadPoll)
    },
    methods: {
        async fetchUnreadCount() {
            try {
                const { data } = await this.$http.get('/user/notifications?per_page=50')
                this.unreadCount = (data.data || []).filter(n => !n.read_at).length || 0
            } catch {}
        },
        async logout() {
            try { await this.$http.post('/auth/logout') } catch {}
            this.$auth.logout()
            this.$router.push('/login')
        },
        isActive(path) {
            return this.$route.path === path || this.$route.path.startsWith(path + '/')
        }
    },
    template: `
<nav class="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center gap-4">

      <!-- Logo -->
      <router-link to="/dashboard" class="flex items-center gap-2 flex-shrink-0">
        <div class="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <span class="text-white font-black text-sm" style="font-family:Georgia,serif;">Tu</span>
        </div>
        <span class="font-black text-gray-900 text-base tracking-tight hidden sm:block" style="font-family:Georgia,serif;">
          Tu<span style="color:#1a6b3c;">Ma</span>
        </span>
      </router-link>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-0.5 flex-1">
        <router-link v-for="link in [
          {to:'/dashboard', label:'Dashboard'},
          {to:'/orders',    label:'Orders'},
          {to:'/browse',    label:'Browse'},
          {to:'/matches',   label:'Matches'},
          {to:'/directory', label:'Directory'},
        ]" :key="link.to" :to="link.to"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(link.to)
              ? 'text-green-700 bg-green-50'
              : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
          ]">
          {{ link.label }}
        </router-link>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-1 flex-shrink-0">

        <!-- Support / Help -->
        <router-link to="/support"
          class="p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          title="Help & Support">
          <i class="far fa-question-circle text-lg"></i>
        </router-link>

        <!-- Notifications bell -->
        <router-link to="/notifications"
          class="relative p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
          <i class="far fa-bell text-lg"></i>
          <span v-if="unreadCount > 0"
            class="absolute top-0.5 right-0.5 min-w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-0.5 font-bold">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </router-link>

        <!-- User menu -->
        <div class="relative group ml-1">
          <button class="flex items-center gap-1.5 py-1.5 px-2 rounded-xl hover:bg-gray-100 transition-colors">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
              {{ user && user.first_name ? user.first_name[0].toUpperCase() : 'U' }}
            </div>
            <span class="hidden md:block text-sm font-semibold text-gray-700 max-w-20 truncate">
              {{ user ? user.first_name || 'Account' : 'Account' }}
            </span>
            <i class="fas fa-chevron-down text-xs text-gray-400 hidden md:block"></i>
          </button>

          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div class="px-3 py-2 border-b border-gray-50 mb-1">
              <p class="text-sm font-bold text-gray-900">{{ user && user.first_name }} {{ user && user.last_name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user && user.email }}</p>
            </div>
            <router-link to="/profile"       class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="far fa-user text-gray-400 w-4 text-center"></i> Profile</router-link>
            <router-link to="/kyc"           class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-id-card text-gray-400 w-4 text-center"></i> Verification</router-link>
            <router-link to="/bank-accounts" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-university text-gray-400 w-4 text-center"></i> Bank Accounts</router-link>
            <router-link to="/settings"      class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-cog text-gray-400 w-4 text-center"></i> Settings</router-link>
            <router-link to="/referral"      class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-gift text-gray-400 w-4 text-center"></i> Referrals</router-link>
            <router-link to="/history"       class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-history text-gray-400 w-4 text-center"></i> History</router-link>
            <template v-if="isAdmin">
              <div class="border-t border-gray-100 my-1 mx-1"></div>
              <router-link to="/admin/dashboard" class="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 rounded-lg mx-1 transition-colors">
                <i class="fas fa-shield-alt w-4 text-center"></i> Admin Panel
              </router-link>
            </template>
            <div class="border-t border-gray-100 my-1 mx-1"></div>
            <button @click="logout" class="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors w-full text-left">
              <i class="fas fa-sign-out-alt w-4 text-center"></i> Log out
            </button>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <button @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-1">
          <i :class="mobileOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 py-2 space-y-0.5">
      <router-link v-for="link in [
        {to:'/dashboard', label:'Dashboard',  icon:'fa-home'},
        {to:'/orders',    label:'Orders',     icon:'fa-list-alt'},
        {to:'/browse',    label:'Browse',     icon:'fa-search'},
        {to:'/matches',   label:'Matches',    icon:'fa-handshake'},
        {to:'/directory', label:'Directory',  icon:'fa-users'},
        {to:'/support',   label:'Help & Support', icon:'fa-question-circle'},
      ]" :key="link.to" :to="link.to"
        @click.native="mobileOpen = false"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isActive(link.to)
            ? 'text-green-700 bg-green-50'
            : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
        ]">
        <i :class="['fas', link.icon, 'w-4 text-center text-gray-400']"></i>
        {{ link.label }}
      </router-link>
    </div>
  </div>
</nav>`
}
