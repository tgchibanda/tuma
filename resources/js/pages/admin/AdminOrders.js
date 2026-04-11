export default {
    name: 'AdminOrders',

    data() {
        return {
            items: [],
            meta: null,
            stats: {},

            loading: true,
            error: null,

            search: '',
            statusFilter: '',
            typeFilter: ''
        }
    },

    async mounted() {
        await this.load()
    },

    methods: {
        async load(page = 1) {
            this.loading = true
            this.error = null

            const params = { page }

            if (this.search) params.search = this.search
            if (this.statusFilter) params.status = this.statusFilter
            if (this.typeFilter) params.type = this.typeFilter

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/orders', { params })

                this.items = data.data || []
                this.meta  = data.meta?.pagination || null
                this.stats = data.stats || {}

            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load orders'
            }

            this.loading = false
        },

        statusBadge(s) {
            return {
                open: 'bg-blue-100 text-blue-700',
                matched: 'bg-purple-100 text-purple-700',
                completed: 'bg-green-100 text-green-700',
                cancelled: 'bg-gray-100 text-gray-600',
                expired: 'bg-red-100 text-red-700'
            }[s] || 'bg-gray-100 text-gray-600'
        },

        typeBadge(t) {
            return {
                buy: 'bg-green-100 text-green-700',
                sell: 'bg-orange-100 text-orange-700'
            }[t] || 'bg-gray-100 text-gray-600'
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Orders</h1>
        <span v-if="meta" class="text-sm text-gray-500">{{ meta.total }} total</span>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-4 gap-3">

          <div class="sm:col-span-2">
            <input v-model="search" @keyup.enter="load()"
              type="text"
              placeholder="Search by user, ULID..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
          </div>

          <select v-model="typeFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All types</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>

          <select v-model="statusFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All status</option>
            <option value="open">Open</option>
            <option value="matched">Matched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>

        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">AUD</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              <tr v-for="o in items" :key="o.ulid" class="hover:bg-gray-50">

                <!-- Order -->
                <td class="px-4 py-3">
                  <p class="font-mono text-xs text-gray-600">
                    {{ o.ulid?.slice(0,12) }}
                  </p>
                </td>

                <!-- Type -->
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', typeBadge(o.type)]">
                    {{ o.type }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', statusBadge(o.status)]">
                    {{ o.status }}
                  </span>
                </td>

                <!-- Amount -->
                <td class="px-4 py-3 text-right font-semibold text-gray-900">
                  {{ o.amount_aud ? $fmt.aud(o.amount_aud) : '—' }}
                </td>

                <!-- User -->
                <td class="px-4 py-3 text-xs text-gray-700">
                  {{ o.user?.name }}
                </td>

                <!-- Location -->
                <td class="px-4 py-3 text-xs text-gray-600">
                  {{ o.location?.name }}
                </td>

                <!-- Created -->
                <td class="px-4 py-3 text-xs text-gray-500">
                  {{ $fmt.date(o.created_at) }}
                </td>

                <!-- Actions -->
                <td class="px-4 py-3">
                  <router-link :to="'/admin/orders/' + o.ulid"
                    class="px-2 py-1 text-xs text-green-700 border border-green-200 rounded-lg hover:bg-green-50">
                    View
                  </router-link>
                </td>

              </tr>
            </tbody>
          </table>

          <div v-if="!items.length" class="text-center py-12 text-gray-400 text-sm">
            No orders found
          </div>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`
}