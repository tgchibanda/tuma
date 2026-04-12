export default {
    name: 'Dashboard',
    data() {
        return {
            stats: null, orders: [], matches: [], announcements: [],
            totalTrades: 0,
            noticeboard: [], holidays: [], loading: true, user: null
        }
    },
    async mounted() {
        this.user = this.$auth.user
        this.totalTrades = this.user?.total_trades || this.user?.successful_trades || 0
        await Promise.all([this.fetchStats(), this.fetchOrders(), this.fetchMatches(), this.fetchNoticeboard(), this.fetchHolidays()])
        this.loading = false
    },
    methods: {
        async fetchStats() {
            try { const { data } = await this.$http.get('/user/stats'); this.stats = data.data } catch {}
        },
        async fetchOrders() {
            try { const { data } = await this.$http.get('/orders?status=open&per_page=3'); this.orders = data.data } catch {}
        },
        async fetchMatches() {
            try { const { data } = await this.$http.get('/matches?per_page=5'); this.matches = data.data } catch {}
        },
        async fetchNoticeboard() {
            try { const { data } = await this.$http.get('/noticeboard?per_page=3'); this.noticeboard = data.data } catch {}
        },
        async fetchHolidays() {
            try { const { data } = await this.$http.get('/public-holidays'); this.holidays = (data.data || []).slice(0, 2) } catch {}
        }
    },
    template: `<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-7xl mx-auto px-4 py-8">
    <loading-spinner v-if="loading" />
    <div v-else>

      <!-- Welcome + KYC alert -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          Good {{ new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening' }},
          {{ user && user.first_name }} 👋
        </h1>
        <router-link to="/orders/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition shadow-sm">
          <i class="fas fa-plus"></i> Create Order
        </router-link>
      </div>

      <alert-banner v-if="user && user.kyc_status === 'pending'" type="warning"
        message="Complete your identity verification (KYC) to start trading." :dismissible="false" />
      <alert-banner v-if="user && user.kyc_status === 'rejected'" type="error"
        message="Your KYC was rejected. Please re-submit your documents." :dismissible="false" />

      <!-- Holiday alerts -->
      <div v-if="holidays.length" class="mb-4">
        <alert-banner v-for="h in holidays" :key="h.name" type="info"
          :message="'⚠ Upcoming: ' + h.name + ' in ' + h.country + ' on ' + h.holiday_date + (h.affects_deliveries ? ' — deliveries may be affected.' : '.')" />
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="(card, i) in [
          {label:'Active Orders', value: stats && stats.active_orders||0, icon:'fa-list-alt', to:'/orders', color:'blue'},
          {label:'Active Matches', value: stats && stats.active_matches||0, icon:'fa-handshake', to:'/matches', color:'green'},
          {label:'Completed Trades', value: stats && stats.completed_trades||0, icon:'fa-check-circle', to:'/history', color:'teal'},
          {label:'Your Rating', value: stats && stats.rating ? parseFloat(stats.rating).toFixed(1)+'★' : 'New', icon:'fa-star', to:'/profile', color:'yellow'},
        ]" :key="i">
          <router-link :to="card.to"
            :class="['block bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow']">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-'+card.color+'-100']">
              <i :class="['fas', card.icon, 'text-'+card.color+'-600', 'text-sm']"></i>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ card.label }}</p>
          </router-link>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Active matches / orders -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Pending actions -->
          <div v-if="matches.filter(m=>['deposit_uploaded','awaiting_confirmation','delivery_method_selecting','awaiting_risk_confirmation','awaiting_risk_deposit'].includes(m.status)).length">
            <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i class="fas fa-exclamation-circle text-orange-500"></i> Action Required
            </h2>
            <div class="space-y-3">
              <match-card v-for="m in matches.filter(m=>['awaiting_deposit','awaiting_confirmation','delivery_method_selecting','awaiting_risk_confirmation','awaiting_risk_deposit'].includes(m.status))"
                :key="m.ulid" :match="m" />
            </div>
          </div>

          <!-- Active matches -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-base font-semibold text-gray-900">Active Matches</h2>
              <router-link to="/matches" class="text-sm text-green-700 hover:underline">View all →</router-link>
            </div>
            <div class="space-y-3" v-if="matches.length">
              <match-card v-for="m in matches.slice(0,3)" :key="m.ulid" :match="m" />
            </div>
            <empty-state v-else icon="fa-handshake" title="No active matches"
              :subtitle="user && user.total_trades > 0 ? 'Browse open orders to find your next match.' : 'Browse open orders to find your first match.'"
              action-label="Browse Orders" action-to="/browse" />
          </div>

          <!-- Open orders -->
          <div v-if="orders.length">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-base font-semibold text-gray-900">Your Open Orders</h2>
              <router-link to="/orders" class="text-sm text-green-700 hover:underline">View all →</router-link>
            </div>
            <div class="space-y-3">
              <order-card v-for="o in orders" :key="o.ulid" :order="o" />
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="space-y-6">

          <!-- Noticeboard -->
          <div v-if="noticeboard.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <i class="fas fa-bullhorn text-green-600"></i>
              <h3 class="text-sm font-semibold text-gray-900">Noticeboard</h3>
            </div>
            <div class="divide-y divide-gray-50">
              <div v-for="post in noticeboard" :key="post.id" class="px-4 py-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <span v-if="post.is_pinned" class="text-xs text-orange-600"><i class="fas fa-thumbtack"></i></span>
                  <span class="text-xs font-medium text-gray-800">{{ post.title }}</span>
                </div>
                <p class="text-xs text-gray-500 line-clamp-2">{{ post.content }}</p>
              </div>
            </div>
          </div>

          <!-- Trust score -->
          <div v-if="stats" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Your Trust Score</h3>
            <div class="flex items-center gap-3">
              <div class="relative w-14 h-14">
                <svg class="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3.8"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#15803d" stroke-width="3.8"
                    :stroke-dasharray="(stats.trust_score||0) + ' 100'" stroke-linecap="round"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                  {{ stats.trust_score || 0 }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500">Complete trades and verify your account to increase your score.</p>
                <router-link to="/settings" class="text-xs text-green-700 hover:underline mt-1 block">
                  Improve score →
                </router-link>
              </div>
            </div>
          </div>

          <!-- Transaction Feed -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900">Recent Transactions</h3>
            </div>
            <div class="p-4">
              <transaction-feed-ticker />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
