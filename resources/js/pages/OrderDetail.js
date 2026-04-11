export default {
    name: 'OrderDetail',
    data() { return { order: null, matches: [], loading: true } },
    async mounted() {
        try {
            const ulid = this.$route.params.ulid
            const [ord, mat] = await Promise.all([
                this.$http.get('/orders/' + ulid),
                this.$http.get('/matches', { params: { order_ulid: ulid } }).catch(() => ({ data: { data: [] } }))
            ])
            this.order   = ord.data.data
            this.matches = mat.data.data || []
        } catch { this.$router.push('/orders') }
        this.loading = false
    },
    methods: {
        async extend() {
            try { await this.$http.put('/orders/' + this.order.ulid + '/extend'); this.$toast.success('Order extended by 48 hours.'); const { data } = await this.$http.get('/orders/' + this.order.ulid); this.order = data.data } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        },
        async cancel() {
            if (!confirm('Cancel this order?')) return
            try { await this.$http.put('/orders/' + this.order.ulid + '/cancel'); this.$toast.success('Order cancelled.'); this.$router.push('/orders') } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center gap-2 mb-6">
      <router-link to="/orders" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> My Orders
      </router-link>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="order" class="space-y-5">
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <status-badge :status="order.status" />
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-lg', order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                {{ order.order_type === 'send_to_zim' ? 'Send to Zimbabwe' : 'Receive from Zimbabwe' }}
              </span>
              <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg font-medium">
                <i class="fas fa-bolt mr-0.5"></i> Boosted
              </span>
            </div>
            <p class="text-3xl font-black text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
            <p class="text-base text-gray-500 mt-0.5">{{ $fmt.usd(order.amount_usd) }} &middot; {{ order.delivery_location?.name }}</p>
          </div>
          <div class="flex flex-col gap-2 flex-shrink-0">
            <button v-if="order.status === 'open'" @click="extend"
              class="px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50">
              Extend 48h
            </button>
            <button v-if="order.status === 'open'" @click="cancel"
              class="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
              Cancel
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Recipient</p>
            <p class="font-semibold text-gray-800">{{ order.zim_recipient_name || '—' }}</p>
            <p class="text-gray-500 text-xs">{{ order.zim_recipient_phone || '' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Platform fee</p>
            <p class="font-semibold text-gray-800">{{ $fmt.aud(order.platform_fee_aud) }} ({{ order.platform_fee_percent }}%)</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Created</p>
            <p class="font-semibold text-gray-800">{{ $fmt.date(order.created_at) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Expires</p>
            <p :class="['font-semibold', order.status === 'open' ? 'text-orange-600' : 'text-gray-800']">
              {{ order.expires_at ? $fmt.date(order.expires_at) : '—' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="order.status === 'open'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          <router-link :to="'/browse?location=' + order.zim_delivery_location_id"
            class="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
            <i class="fas fa-search text-xs"></i> Find matches
          </router-link>
          <router-link :to="'/orders/create?repeat=' + order.ulid"
            class="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-green-700 text-white hover:bg-green-800 transition-colors">
            <i class="fas fa-redo text-xs"></i> Repeat order
          </router-link>
        </div>
      </div>

      <!-- Active matches -->
      <div v-if="matches.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Matches ({{ matches.length }})</h3>
        </div>
        <div class="divide-y divide-gray-50">
          <router-link v-for="m in matches" :key="m.ulid" :to="'/matches/' + m.ulid"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
            <div>
              <status-badge :status="m.status" />
              <p class="text-sm text-gray-600 mt-1">{{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : 'Proposed: ' + $fmt.aud(m.proposed_aud) }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          </router-link>
        </div>
      </div>

      <empty-state v-else-if="order.status === 'open'" icon="fa-handshake"
        title="No matches yet"
        subtitle="Your order is open and visible to other members. You can also browse open orders to propose a match yourself."
        action-label="Browse open orders" action-to="/browse" />
    </div>
  </div>
  <app-footer />
</div>`
}
