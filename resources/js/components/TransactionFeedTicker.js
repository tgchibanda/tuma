export default {
    name: 'TransactionFeedTicker',
    data() { return { items: [], stats: {}, loading: true } },
    async mounted() {
        try {
            const [feed, stats] = await Promise.all([
                this.$http.get('/feed?per_page=20'),
                this.$http.get('/feed/stats')
            ])
            this.items = feed.data.data || []
            this.stats = stats.data.data || {}
        } catch {}
        this.loading = false
    },
    computed: {
        totalVolumeFormatted() {
            if (!this.stats.total_volume_aud) return '—'
            return 'AUD $' + Number(this.stats.total_volume_aud).toLocaleString()
        },
        statCards() {
            return [
                { label: 'Total Sent',     value: this.totalVolumeFormatted,                        icon: 'fa-dollar-sign',    color: 'green' },
                { label: 'Transactions',   value: this.stats.total_count || '—',                    icon: 'fa-exchange-alt',   color: 'blue' },
                { label: 'Success Rate',   value: this.stats.success_rate ? this.stats.success_rate + '%' : '98%', icon: 'fa-check-circle', color: 'teal' },
                { label: 'Cities Served',  value: this.stats.cities_count || 16,                    icon: 'fa-map-marker-alt', color: 'purple' },
            ]
        }
    },
    methods: {
        formatDate(dt) {
            if (!dt) return ''
            return new Date(dt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
        }
    },
    template: `
<div>
  <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div v-for="(card, i) in statCards" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div :class="'w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-' + card.color + '-100'">
        <i :class="'fas ' + card.icon + ' text-' + card.color + '-600 text-sm'"></i>
      </div>
      <p class="text-xl font-bold text-gray-900">{{ card.value }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ card.label }}</p>
    </div>
  </div>

  <div class="space-y-2">
    <div v-for="item in items.slice(0, 8)" :key="item.id"
      class="flex items-center gap-3 py-3 px-4 bg-white rounded-xl border border-gray-100">
      <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-700">
          <span class="font-medium">{{ item.display_sender }}</span>
          sent <span class="font-semibold text-gray-900">AUD <span>{{ item.amount_aud }}</span>
          &rarr; <span class="font-semibold text-green-700">USD <span>{{ item.amount_usd }}</span>
          to {{ item.display_receiver }}
        </p>
      </div>
      <span class="text-xs text-gray-400 flex-shrink-0">{{ formatDate(item.completed_at) }}</span>
    </div>
    <loading-spinner v-if="loading" />
  </div>
</div>`
}
