export default {
    name: 'History',
    data() { return { trades: [], meta: null, loading: true } },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const { data } = await this.$http.get('/user/history', { params: { page } })
                this.trades = data.data
                this.meta   = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        totalAud() { return this.trades.reduce((s, t) => s + parseFloat(t.agreed_aud || 0), 0) },
        totalUsd() { return this.trades.reduce((s, t) => s + parseFloat(t.agreed_usd || 0), 0) }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Trade History</h1>

    <loading-spinner v-if="loading" />

    <div v-else>
      <!-- Summary -->
      <div v-if="trades.length" class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ trades.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Completed trades</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(totalAud()) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total AUD exchanged</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-700">{{ $fmt.usd(totalUsd()) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total USD exchanged</p>
        </div>
      </div>

      <!-- Table -->
      <div v-if="trades.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">AUD</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">USD</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="trade in trades" :key="trade.ulid" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-700">{{ $fmt.date(trade.completed_at) }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-xs font-semibold px-2 py-0.5 rounded-lg',
                    trade.role === 'sender' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ trade.role === 'sender' ? 'Sender' : 'Receiver' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ $fmt.aud(trade.agreed_aud) }}</td>
                <td class="px-4 py-3 text-right font-semibold text-green-700">{{ $fmt.usd(trade.agreed_usd) }}</td>
                <td class="px-4 py-3 text-gray-600">{{ trade.location || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-xs capitalize', trade.delivery_method === 'secure' ? 'text-green-600' : 'text-orange-600']">
                    {{ trade.delivery_method }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <router-link :to="'/matches/' + trade.ulid" class="text-xs text-green-700 hover:underline">
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <pagination-links v-if="meta" :meta="meta" @page="load($event)" />

      <empty-state v-if="!trades.length" icon="fa-history"
        title="No completed trades yet"
        subtitle="Once you complete your first transaction it will appear here."
        action-label="Browse Orders" action-to="/browse" />
    </div>
  </div>
  <app-footer />
</div>`
}
