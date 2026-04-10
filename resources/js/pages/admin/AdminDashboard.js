export default {
    name: 'AdminDashboard',
    data() { return { stats: null, recentMatches: [], loading: true } },
    async mounted() {
        try {
            const { data } = await this.$http.get('/../../api/admin/dashboard')
            this.stats = data.data
            this.recentMatches = data.data.recent_matches || []
        } catch {}
        this.loading = false
    },
    computed: {
        volumeThisMonth() {
            if (!this.stats) return '$0'
            return 'AUD $' + Number(this.stats.volume?.this_month_aud || 0).toLocaleString()
        },
        volumeAllTime() {
            if (!this.stats) return '$0'
            return 'AUD $' + Number(this.stats.volume?.all_time_aud || 0).toLocaleString()
        },
        revenueThisMonth() {
            if (!this.stats) return '0.00'
            return 'AUD $' + Number(this.stats.revenue?.this_month_aud || 0).toFixed(2)
        },
        revenueAllTime() {
            if (!this.stats) return '0.00'
            return 'AUD $' + Number(this.stats.revenue?.all_time_aud || 0).toFixed(2)
        },
        statCards() {
            if (!this.stats) return []
            return [
                {
                    label: 'Total Users',
                    value: this.stats.users?.total,
                    icon: 'fa-users',
                    color: 'blue',
                    sub: (this.stats.users?.new_today || 0) + ' new today',
                    to: '/admin/users'
                },
                {
                    label: 'Active Orders',
                    value: this.stats.orders?.open,
                    icon: 'fa-list-alt',
                    color: 'green',
                    sub: (this.stats.orders?.today || 0) + ' today',
                    to: '/admin/orders'
                },
                {
                    label: 'Active Matches',
                    value: this.stats.matches?.active,
                    icon: 'fa-handshake',
                    color: 'teal',
                    sub: (this.stats.matches?.completed_today || 0) + ' completed today',
                    to: '/admin/matches'
                },
                {
                    label: 'Volume This Month',
                    value: this.volumeThisMonth,
                    icon: 'fa-dollar-sign',
                    color: 'purple',
                    sub: 'All time: ' + this.volumeAllTime,
                    to: '/admin/matches'
                }
            ]
        },
        activeStatusBreakdown() {
            if (!this.stats?.matches?.status_breakdown) return {}
            return Object.fromEntries(
                Object.entries(this.stats.matches.status_breakdown).filter(
                    ([status, count]) => count > 0 && !['completed','cancelled','refunded'].includes(status)
                )
            )
        }
    },
    methods: {
        statusLabel(s) {
            return s.replace(/_/g, ' ')
        },
        matchDate(m) {
            return m.updated_at || ''
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-xs">Tu</span>
      </div>
      <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
    </div>
    <nav class="flex items-center gap-1 text-sm">
      <router-link v-for="link in [
        {to:'/admin/dashboard', label:'Dashboard'},
        {to:'/admin/users',     label:'Users'},
        {to:'/admin/matches',   label:'Matches'},
        {to:'/admin/deposits',  label:'Deposits'},
        {to:'/admin/disputes',  label:'Disputes'},
        {to:'/admin/rates',     label:'Rates'},
        {to:'/admin/settings',  label:'Settings'}
      ]" :key="link.to" :to="link.to"
        class="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition">
        {{ link.label }}
      </router-link>
    </nav>
  </div>

  <div class="max-w-7xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
      <span class="text-sm text-gray-500">
        {{ new Date().toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'long'}) }}
      </span>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="stats">

      <!-- Urgent actions banner -->
      <div v-if="stats.pending_actions && stats.pending_actions.total_urgent > 0"
        class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
        <div class="flex items-center gap-2 mb-3">
          <i class="fas fa-exclamation-circle text-orange-500"></i>
          <h2 class="font-semibold text-orange-900">
            {{ stats.pending_actions.total_urgent }} action(s) require your attention
          </h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link v-if="stats.pending_actions.deposits_to_verify > 0"
            to="/admin/deposits"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-file-invoice-dollar"></i>
            {{ stats.pending_actions.deposits_to_verify }} deposit(s) to verify
          </router-link>
          <router-link v-if="stats.pending_actions.funds_to_release > 0"
            to="/admin/matches"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-hand-holding-usd"></i>
            {{ stats.pending_actions.funds_to_release }} fund release(s) ready
          </router-link>
          <router-link v-if="stats.pending_actions.open_disputes > 0"
            to="/admin/disputes"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-red-200 text-sm font-medium text-red-800 hover:bg-red-50">
            <i class="fas fa-exclamation-triangle"></i>
            {{ stats.pending_actions.open_disputes }} open dispute(s)
          </router-link>
          <router-link v-if="stats.pending_actions.pending_kyc > 0"
            to="/admin/users"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-id-card"></i>
            {{ stats.pending_actions.pending_kyc }} KYC review(s)
          </router-link>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <router-link v-for="(card, i) in statCards" :key="i" :to="card.to"
          class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <div :class="'w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-' + card.color + '-100'">
            <i :class="'fas ' + card.icon + ' text-' + card.color + '-600 text-sm'"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ card.value != null ? card.value : '—' }}</p>
          <p class="text-xs font-medium text-gray-600 mt-0.5">{{ card.label }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ card.sub }}</p>
        </router-link>
      </div>

      <!-- Revenue + Risk + Status -->
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-coins text-yellow-500 mr-1"></i> Fee Revenue
          </h3>
          <p class="text-2xl font-bold text-gray-900">AUD {{ revenueThisMonth }}</p>
          <p class="text-xs text-gray-500 mt-1">This month</p>
          <p class="text-sm text-gray-600 mt-2">
            All time: <strong>AUD {{ revenueAllTime }}</strong>
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-flag text-red-500 mr-1"></i> Risk Flags Today
          </h3>
          <p class="text-2xl font-bold"
            :class="stats.risk && stats.risk.flagged_today > 0 ? 'text-red-600' : 'text-gray-900'">
            {{ stats.risk ? stats.risk.flagged_today : 0 }}
          </p>
          <router-link to="/admin/audit-logs"
            class="text-xs text-green-700 hover:underline mt-2 block">
            View flagged logs &rarr;
          </router-link>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-bar text-blue-500 mr-1"></i> Match Status
          </h3>
          <div class="space-y-1.5">
            <div v-for="(count, status) in activeStatusBreakdown" :key="status"
              class="flex justify-between text-xs">
              <span class="text-gray-600 capitalize">{{ statusLabel(status) }}</span>
              <span class="font-semibold text-gray-900">{{ count }}</span>
            </div>
            <p v-if="Object.keys(activeStatusBreakdown).length === 0"
              class="text-xs text-gray-400">No active matches</p>
          </div>
        </div>
      </div>

      <!-- Recent matches table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-900">Recent Matches</h3>
          <router-link to="/admin/matches" class="text-xs text-green-700 hover:underline">
            View all &rarr;
          </router-link>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="m in recentMatches" :key="m.ulid"
            class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
            <status-badge :status="m.status" />
            <span class="font-mono text-xs text-gray-400">{{ m.ulid ? m.ulid.slice(0, 8) : '' }}</span>
            <span class="text-sm text-gray-700 flex-1">
              {{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : 'Negotiating' }}
            </span>
            <span class="text-xs text-gray-400">{{ matchDate(m) }}</span>
            <router-link :to="'/admin/matches/' + m.ulid"
              class="text-xs text-green-700 hover:underline">
              View
            </router-link>
          </div>
          <div v-if="recentMatches.length === 0" class="px-5 py-6 text-center text-sm text-gray-400">
            No matches yet
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
