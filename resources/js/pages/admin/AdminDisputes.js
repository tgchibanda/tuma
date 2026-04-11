export default {
    name: 'AdminDisputes',
    data() { return { disputes: [], meta: null, loading: true, statusFilter: 'open' } },
    async mounted() { await this.load() },
    watch: { statusFilter() { this.load() } },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const { data } = await this.$http.get('/../../api/admin/disputes', {
                    params: { page, status: this.statusFilter || undefined }
                })
                this.disputes = data.data
                this.meta     = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        urgencyRow(d) {
            if (d.urgency === 'critical') return 'bg-red-50 border-l-4 border-l-red-500'
            if (d.urgency === 'high')     return 'bg-orange-50 border-l-4 border-l-orange-400'
            if (d.urgency === 'medium')   return 'border-l-4 border-l-yellow-400'
            return ''
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/dashboard"><div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">Tu</span></div></router-link>
    <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
  </div>

  <div class="max-w-6xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between mb-5">
      <h1 class="text-xl font-bold text-gray-900">Disputes</h1>
      <div class="flex items-center gap-2">
        <div class="flex gap-1 text-xs">
          <span class="px-2 py-1 bg-red-100 text-red-700 rounded font-medium">Critical 48h+</span>
          <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">High 24h+</span>
          <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">Medium 8h+</span>
        </div>
        <select v-model="statusFilter"
          class="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="">All</option>
        </select>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="disputes.length" class="space-y-3">
      <div v-for="d in disputes" :key="d.id"
        :class="['bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow', urgencyRow(d)]">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex flex-wrap gap-2 mb-2">
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-full',
                d.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                d.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                d.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600']">
                {{ d.urgency }} &middot; {{ d.hours_open }}h open
              </span>
              <status-badge :status="d.status" />
              <span v-if="d.agreed_aud" class="text-xs font-semibold text-gray-700">
                {{ $fmt.aud(d.agreed_aud) }}
              </span>
            </div>
            <p class="text-sm text-gray-700 mb-1">{{ d.reason ? d.reason.slice(0, 120) : '' }}</p>
            <p class="text-xs text-gray-500">
              Sender: <span class="font-medium">{{ d.sender?.name }}</span>
              &middot;
              Receiver: <span class="font-medium">{{ d.receiver?.name }}</span>
            </p>
          </div>
          <router-link :to="'/admin/disputes/' + d.id"
            :class="['flex-shrink-0 px-4 py-2 text-sm font-semibold text-white rounded-xl transition',
              d.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-800']">
            Resolve
          </router-link>
        </div>
      </div>
      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <div v-else class="text-center py-16 text-gray-400">
      <i class="fas fa-balance-scale text-4xl mb-3 text-green-400 block"></i>
      <p class="font-medium text-gray-600">No disputes</p>
    </div>
  </div>
</div>`
}
