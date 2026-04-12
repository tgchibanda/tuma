export default {
    name: 'AdminNav',
    props: { active: { type: String, default: '' } },
    data() { return { collapsed: false, mobileOpen: false } },
    computed: {
        user() { return this.$auth.user },
        navGroups() {
            return [
                {
                    label: 'Overview',
                    links: [
                        { to: '/admin/dashboard', label: 'Dashboard', icon: 'fa-th-large' },
                    ]
                },
                {
                    label: 'Transactions',
                    links: [
                        { to: '/admin/matches',  label: 'Matches',  icon: 'fa-handshake' },
                        { to: '/admin/deposits', label: 'Deposits', icon: 'fa-dollar-sign' },
                        { to: '/admin/orders',   label: 'Orders',   icon: 'fa-list-alt' },
                        { to: '/admin/disputes', label: 'Disputes', icon: 'fa-exclamation-circle', urgent: true },
                    ]
                },
                {
                    label: 'Users',
                    links: [
                        { to: '/admin/users',   label: 'Users',   icon: 'fa-users' },
                        { to: '/admin/reports', label: 'Reports', icon: 'fa-flag' },
                        { to: '/admin/support', label: 'Support', icon: 'fa-headset' },
                    ]
                },
                {
                    label: 'Platform',
                    links: [
                        { to: '/admin/rates',       label: 'Exchange Rates', icon: 'fa-chart-line' },
                        { to: '/admin/locations',   label: 'Locations',      icon: 'fa-map-marker-alt' },
                        { to: '/admin/noticeboard', label: 'Noticeboard',    icon: 'fa-bullhorn' },
                        { to: '/admin/settings',    label: 'Settings',       icon: 'fa-cog' },
                        { to: '/admin/audit-logs',  label: 'Audit Logs',     icon: 'fa-clipboard-list' },
                    ]
                },
            ]
        }
    },
    methods: {
        async logout() {
            try { await this.$http.post('/auth/logout') } catch {}
            this.$auth.logout()
            this.$router.push('/admin/login')
        }
    },
    template: `
<div>
  <!-- Desktop sidebar (fixed w-60, collapses to w-16) -->
  <aside :class="['fixed top-0 left-0 h-full bg-gray-900 text-white z-40 transition-all duration-200 hidden lg:flex flex-col',
    collapsed ? 'w-16' : 'w-60']">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-800 flex-shrink-0">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto flex-shrink-0 brightness-0 invert">
      <p v-if="!collapsed" class="text-xs text-green-400 font-medium whitespace-nowrap">Admin Panel</p>
      <button @click="collapsed = !collapsed" class="ml-auto text-gray-500 hover:text-white flex-shrink-0">
        <i :class="['fas text-xs', collapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
      </button>
    </div>

    <!-- Nav groups -->
    <nav class="flex-1 overflow-y-auto py-3 px-2">
      <div v-for="group in navGroups" :key="group.label" class="mb-4">
        <p v-if="!collapsed" class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1.5">
          {{ group.label }}
        </p>
        <router-link v-for="link in group.links" :key="link.to" :to="link.to"
          :class="['flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors group',
            $route.path === link.to || $route.path.startsWith(link.to + '/')
              ? 'bg-green-700 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
          :title="collapsed ? link.label : ''">
          <i :class="['fas flex-shrink-0 w-4 text-center', link.icon,
            link.urgent ? 'text-red-400' : '']"></i>
          <span v-if="!collapsed" class="flex-1 min-w-0 truncate">{{ link.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User + logout -->
    <div class="border-t border-gray-800 p-3 flex-shrink-0">
      <div v-if="!collapsed" class="flex items-center gap-2 px-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {{ user && user.first_name ? user.first_name[0].toUpperCase() : 'A' }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ user ? user.first_name : 'Admin' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user ? user.email : '' }}</p>
        </div>
      </div>
      <button @click="logout"
        :class="['flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors',
          collapsed ? 'justify-center' : '']">
        <i class="fas fa-sign-out-alt flex-shrink-0 w-4 text-center"></i>
        <span v-if="!collapsed">Log out</span>
      </button>
    </div>
  </aside>

  <!-- Mobile top bar -->
  <div class="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
    <div class="flex items-center gap-2">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto brightness-0 invert">
      <span class="text-xs text-green-400 font-medium ml-1">Admin</span>
    </div>
    <button @click="mobileOpen = !mobileOpen" class="p-2 text-gray-400 hover:text-white">
      <i :class="['fas', mobileOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>
  </div>

  <!-- Mobile overlay -->
  <transition name="fade">
    <div v-if="mobileOpen" class="fixed inset-0 bg-black/50 z-30 lg:hidden" @click="mobileOpen = false"></div>
  </transition>

  <!-- Mobile drawer -->
  <transition name="slide-left">
    <div v-if="mobileOpen" class="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 lg:hidden flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-4 border-b border-gray-800">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto brightness-0 invert">
        <button @click="mobileOpen = false" class="text-gray-500 hover:text-white p-1">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <nav class="flex-1 py-3 px-2 overflow-y-auto">
        <div v-for="group in navGroups" :key="group.label" class="mb-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1.5">{{ group.label }}</p>
          <router-link v-for="link in group.links" :key="link.to" :to="link.to"
            @click.native="mobileOpen = false"
            :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              $route.path === link.to ? 'bg-green-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']">
            <i :class="['fas flex-shrink-0 w-4 text-center', link.icon]"></i>
            {{ link.label }}
          </router-link>
        </div>
      </nav>
      <div class="border-t border-gray-800 p-3">
        <button @click="logout" class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors">
          <i class="fas fa-sign-out-alt w-4 text-center"></i> Log out
        </button>
      </div>
    </div>
  </transition>

  <style>
  .fade-enter-active,.fade-leave-active{transition:opacity .2s}
  .fade-enter,.fade-leave-to{opacity:0}
  .slide-left-enter-active,.slide-left-leave-active{transition:transform .25s ease}
  .slide-left-enter,.slide-left-leave-to{transform:translateX(-100%)}
  </style>
</div>`
}
