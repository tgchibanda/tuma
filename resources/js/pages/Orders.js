export default {
    name: 'Orders',
    data() {
        return {
            tab: 'open',
            orders: [], meta: null,
            loading: true,
            cancelling: null
        }
    },
    computed: {
        tabs() {
            return [
                { key: 'open',      label: 'Open',      icon: 'fa-clock' },
                { key: 'completed', label: 'Completed',  icon: 'fa-check-circle' },
                { key: 'cancelled', label: 'Cancelled',  icon: 'fa-times-circle' },
                { key: 'expired',   label: 'Expired',    icon: 'fa-hourglass-end' },
            ]
        }
    },
    async mounted() { await this.load() },
    watch: { tab() { this.load() } },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const { data } = await this.$http.get('/orders', {
                    params: { status: this.tab, page }
                })
                this.orders = data.data
                this.meta   = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        async cancel(order) {
            const reason = prompt('Reason for cancelling (optional):') ?? ''
            this.cancelling = order.ulid
            try {
                await this.$http.put('/orders/' + order.ulid + '/cancel', { reason })
                this.$toast.success('Order cancelled.')
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Could not cancel.')
            }
            this.cancelling = null
        },
        async extend(order) {
            try {
                await this.$http.put('/orders/' + order.ulid + '/extend')
                this.$toast.success('Order extended by 48 hours.')
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Could not extend.')
            }
        },
        expiresLabel(dt) {
            if (!dt) return ''
            const diff = new Date(dt) - new Date()
            if (diff < 0) return 'Expired'
            const h = Math.floor(diff / 3600000)
            if (h < 24) return 'Expires in ' + h + 'h'
            return 'Expires in ' + Math.floor(h / 24) + 'd'
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
      <router-link to="/orders/create"
        class="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition">
        <i class="fas fa-plus"></i> New Order
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap',
          tab === t.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50']">
        <i :class="'fas ' + t.icon + ' text-xs'"></i>
        {{ t.label }}
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="orders.length" class="space-y-3">
      <div v-for="order in orders" :key="order.ulid"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap gap-2 mb-2">
              <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg',
                order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                <i :class="['fas mr-1', order.order_type === 'send_to_zim' ? 'fa-paper-plane' : 'fa-hand-holding-usd']"></i>
                {{ order.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
              </span>
              <status-badge :status="order.status" />
              <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                <i class="fas fa-bolt mr-0.5"></i> Boosted
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
            <p class="text-sm text-gray-400 mt-0.5">
              {{ $fmt.usd(order.amount_usd) }}
              &middot; {{ order.delivery_location?.name }}
            </p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span><i class="far fa-clock mr-1"></i>{{ $fmt.date(order.created_at) }}</span>
              <span v-if="order.status === 'open'" class="text-orange-500 font-medium">
                {{ expiresLabel(order.expires_at) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 flex-shrink-0">
            <router-link :to="'/orders/' + order.ulid"
              class="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              View
            </router-link>
            <button v-if="order.status === 'open'" @click="extend(order)"
              class="px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50">
              Extend
            </button>
            <button v-if="order.status === 'open'" @click="cancel(order)"
              :disabled="cancelling === order.ulid"
              class="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>

        <!-- Recipient row -->
        <div v-if="order.zim_recipient_name" class="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-500">
          <i class="fas fa-user text-gray-400"></i>
          {{ order.zim_recipient_name }} &middot; {{ order.zim_recipient_phone }}
        </div>
      </div>

      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-list-alt"
      :title="tab === 'open' ? 'No open orders' : 'No ' + tab + ' orders'"
      :subtitle="tab === 'open' ? 'Create your first order to get started.' : 'Nothing here yet.'"
      :action-label="tab === 'open' ? 'Create Order' : null"
      action-to="/orders/create" />
  </div>
  <app-footer />
</div>`
}
