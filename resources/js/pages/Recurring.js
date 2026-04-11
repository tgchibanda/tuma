export default {
    name: 'Recurring',
    data() { return { orders: [], loading: true } },
    async mounted() {
        try { const { data } = await this.$http.get('/recurring'); this.orders = data.data || [] } catch {}
        this.loading = false
    },
    methods: {
        async toggle(id, paused) {
            try {
                await this.$http.post('/recurring/' + id + '/' + (paused ? 'resume' : 'pause'))
                await this.refresh()
            } catch (e) { this.$toast.error('Failed.') }
        },
        async remove(id) {
            if (!confirm('Stop this recurring order?')) return
            try { await this.$http.delete('/recurring/' + id); this.orders = this.orders.filter(o => o.id !== id) } catch {}
        },
        async refresh() {
            try { const { data } = await this.$http.get('/recurring'); this.orders = data.data || [] } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Recurring Orders</h1>
      <p class="text-sm text-gray-500 mt-0.5">Automatically create orders on a schedule</p>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="orders.length" class="space-y-3">
      <div v-for="o in orders" :key="o.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <p class="font-bold text-gray-900">{{ o.order_template?.name }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', o.paused_at ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700']">
                {{ o.paused_at ? 'Paused' : 'Active' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 capitalize">{{ o.frequency }} &middot; {{ o.run_count }} runs so far</p>
            <p class="text-xs text-gray-400 mt-0.5">Next run: {{ $fmt.date(o.next_run_at) }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="toggle(o.id, !!o.paused_at)"
              :class="['px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors',
                o.paused_at ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-orange-200 text-orange-600 hover:bg-orange-50']">
              {{ o.paused_at ? 'Resume' : 'Pause' }}
            </button>
            <button @click="remove(o.id)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-calendar-check text-gray-400 text-2xl"></i>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">No recurring orders</h3>
      <p class="text-sm text-gray-500 mb-5">Set up recurring orders to automatically send money to Zimbabwe every week, fortnight, or month.</p>
      <router-link to="/templates" class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-layer-group"></i> Set up via templates
      </router-link>
    </div>
  </div>
  <app-footer />
</div>`
}
