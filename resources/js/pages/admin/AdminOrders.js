// FILE: resources/js/pages/admin/AdminOrders.js
export default {
    name: 'AdminOrders',
    data() {
        return {
            orders: [], meta: null, loading: true,
            filters: { status: '', order_type: '', search: '', page: 1 }
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page, per_page: 20 }
                if (this.filters.status)     params.status     = this.filters.status
                if (this.filters.order_type) params.order_type = this.filters.order_type
                if (this.filters.search)     params.search     = this.filters.search
                const { data } = await this.$http.get('/admin/orders', { params })
                this.orders = data.data || []
                this.meta   = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        reset() { this.filters = { status:'', order_type:'', search:'', page:1 }; this.load() },
        typeBadge(t) { return t === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700' }
    },
    template: `
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">All Orders</h1>
    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid sm:grid-cols-4 gap-3">
        <input v-model="filters.search" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search user or city...">
        <select v-model="filters.status" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All statuses</option>
          <option v-for="s in ['open','negotiating','agreed','in_escrow','delivering','completed','cancelled','expired','disputed']" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filters.order_type" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All types</option>
          <option value="send_to_zim">Send to Zimbabwe</option>
          <option value="receive_from_zim">Receive from Zimbabwe</option>
        </select>
        <div class="flex gap-2">
          <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
          <button @click="reset()" class="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">User</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">City</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="o in orders" :key="o.ulid" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4 font-medium text-gray-900">{{ o.user?.display_name || o.user?.first_name || '—' }}</td>
            <td class="py-3 px-4">
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-lg', typeBadge(o.order_type)]">
                {{ o.order_type === 'send_to_zim' ? 'Send' : 'Receive' }}
              </span>
            </td>
            <td class="py-3 px-4 font-semibold">{{ $fmt.aud(o.amount_aud) }}</td>
            <td class="py-3 px-4 text-gray-600">{{ o.delivery_location?.name || '—' }}</td>
            <td class="py-3 px-4"><status-badge :status="o.status" /></td>
            <td class="py-3 px-4 text-gray-400">{{ $fmt.date(o.created_at) }}</td>
          </tr>
          <tr v-if="!orders.length"><td colspan="6" class="py-8 text-center text-sm text-gray-400">No orders found.</td></tr>
        </tbody>
      </table>
      <div class="px-4 py-3 border-t border-gray-100" v-if="meta">
        <pagination-links :meta="meta" @page="load($event)" />
      </div>
    </div>
  </div>
</div>`
}
