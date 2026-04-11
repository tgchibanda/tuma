export default {
    name: 'AdminDeposits',
    data() { return { deposits: [], meta: null, loading: true } },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const { data } = await this.$http.get('/../../api/admin/deposits', { params: { page } })
                this.deposits = data.data
                this.meta     = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        urgencyClass(h) {
            if (h >= 24) return 'bg-red-50 border-red-200'
            if (h >= 8)  return 'bg-orange-50 border-orange-100'
            return 'bg-white border-gray-100'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/dashboard"><div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">Tu</span></div></router-link>
    <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
  </div>

  <div class="max-w-5xl mx-auto px-6 py-6">
    <h1 class="text-xl font-bold text-gray-900 mb-5">Deposit Verification Queue</h1>
    <p class="text-sm text-gray-500 mb-5">Deposits waiting for manual verification — oldest first.</p>

    <loading-spinner v-if="loading" />

    <div v-else-if="deposits.length" class="space-y-3">
      <div v-for="d in deposits" :key="d.id"
        :class="['rounded-2xl border shadow-sm p-5', urgencyClass(d.hours_waiting || 0)]">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <p class="font-semibold text-gray-900">{{ $fmt.aud(d.amount_aud) }}</p>
              <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{{ d.our_bank_reference }}</span>
              <span v-if="d.hours_waiting >= 24" class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                <i class="fas fa-clock mr-0.5"></i> {{ d.hours_waiting }}h waiting
              </span>
            </div>
            <p v-if="d.depositor" class="text-sm text-gray-600">
              <span class="font-medium">{{ d.depositor.name }}</span>
              &middot; {{ d.depositor.email }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              Their ref: {{ d.depositor_reference || 'none' }}
              &middot; Uploaded: {{ $fmt.datetime(d.proof_uploaded_at) }}
            </p>
          </div>
          <div class="flex flex-col gap-2 flex-shrink-0">
            <a v-if="d.proof_url" :href="d.proof_url" target="_blank"
              class="px-3 py-1.5 text-xs text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 text-center">
              <i class="fas fa-image mr-1"></i> View Proof
            </a>
            <router-link :to="'/admin/matches/' + d.match_ulid"
              class="px-3 py-1.5 text-xs text-green-700 border border-green-200 rounded-lg hover:bg-green-50 text-center">
              Open Match
            </router-link>
          </div>
        </div>
      </div>
      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <div v-else class="text-center py-16 text-gray-400">
      <i class="fas fa-check-circle text-4xl mb-3 text-green-400 block"></i>
      <p class="font-medium text-gray-600">No pending deposits</p>
      <p class="text-sm">Queue is clear.</p>
    </div>
  </div>
</div>`
}
