export default {
    name: 'Disputes',
    data() { return { disputes: [], loading: true } },
    async mounted() {
        try { const { data } = await this.$http.get('/disputes'); this.disputes = data.data || [] } catch {}
        this.loading = false
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Disputes</h1>
    <loading-spinner v-if="loading" />
    <div v-else-if="disputes.length" class="space-y-3">
      <router-link v-for="d in disputes" :key="d.id" :to="'/disputes/' + d.id"
        class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <status-badge :status="d.status" />
              <span class="text-xs text-gray-500">{{ $fmt.date(d.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-700 mt-1 line-clamp-2">{{ d.reason }}</p>
          </div>
          <i class="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-1"></i>
        </div>
      </router-link>
    </div>
    <empty-state v-else icon="fa-balance-scale" title="No disputes"
      subtitle="You have no open or closed disputes. Disputes are raised when there is a disagreement during a transaction." />
  </div>
  <app-footer />
</div>`
}
