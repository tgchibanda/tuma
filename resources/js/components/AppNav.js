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
        user() { return this.$auth.user },
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
                const { data } = await this.$http.get('/user/notifications?per_page=1')
                this.unreadCount = data.data?.filter(n => !n.read_at).length || 0
            } catch {}
        },
        async logout() {
            try { await this.$http.post('/auth/logout') } catch {}
            this.$auth.logout()
            this.$router.push('/login')
        }
    },
    template: `
<nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">

      <!-- Logo -->
      <router-link to="/dashboard" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">Tu</span>
        </div>
        <span class="font-bold text-gray-900 text-lg tracking-tight">Tu<span class="text-green-700">Ma</span></span>
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-1">
        <router-link to="/dashboard"   class="nav-link">Dashboard</router-link>
        <router-link to="/orders"      class="nav-link">Orders</router-link>
        <router-link to="/browse"      class="nav-link">Browse</router-link>
        <router-link to="/matches"     class="nav-link">Matches</router-link>
        <router-link to="/directory"   class="nav-link">Directory</router-link>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Notifications bell -->
        <router-link to="/notifications" class="relative p-2 text-gray-500 hover:text-green-700">
          <i class="far fa-bell text-lg"></i>
          <span v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </router-link>

        <!-- User menu -->
        <div class="relative group">
          <button class="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100">
            <user-avatar :user="user" size="sm" />
            <span class="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">
              {{ user ? user.first_name : 'Account' }}
            </span>
            <i class="fas fa-chevron-down text-xs text-gray-400"></i>
          </button>
          <!-- Dropdown -->
          <div class="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <router-link to="/profile"       class="dd-item"><i class="far fa-user w-4"></i> Profile</router-link>
            <router-link to="/kyc"           class="dd-item"><i class="fas fa-id-card w-4"></i> Verification</router-link>
            <router-link to="/bank-accounts" class="dd-item"><i class="fas fa-university w-4"></i> Bank Accounts</router-link>
            <router-link to="/settings"      class="dd-item"><i class="fas fa-cog w-4"></i> Settings</router-link>
            <router-link to="/referral"      class="dd-item"><i class="fas fa-gift w-4"></i> Referrals</router-link>
            <router-link to="/history"       class="dd-item"><i class="fas fa-history w-4"></i> History</router-link>
            <template v-if="isAdmin">
              <div class="border-t border-gray-100 my-1"></div>
              <router-link to="/admin/dashboard" class="dd-item text-green-700"><i class="fas fa-shield-alt w-4"></i> Admin Panel</router-link>
            </template>
            <div class="border-t border-gray-100 my-1"></div>
            <button @click="logout" class="dd-item text-red-600 w-full text-left">
              <i class="fas fa-sign-out-alt w-4"></i> Log out
            </button>
          </div>
        </div>

        <!-- Mobile menu toggle -->
        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-gray-500">
          <i :class="mobileOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden pb-4 border-t border-gray-100 pt-2">
      <router-link to="/dashboard"  @click.native="mobileOpen=false" class="mobile-nav-link">Dashboard</router-link>
      <router-link to="/orders"     @click.native="mobileOpen=false" class="mobile-nav-link">Orders</router-link>
      <router-link to="/browse"     @click.native="mobileOpen=false" class="mobile-nav-link">Browse</router-link>
      <router-link to="/matches"    @click.native="mobileOpen=false" class="mobile-nav-link">Matches</router-link>
      <router-link to="/directory"  @click.native="mobileOpen=false" class="mobile-nav-link">Directory</router-link>
    </div>
  </div>

  <style>
  .nav-link { @apply px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors; }
  .nav-link.router-link-active { @apply text-green-700 bg-green-50; }
  .dd-item { @apply flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer; }
  .mobile-nav-link { @apply block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50; }
  </style>
</nav>`
}
