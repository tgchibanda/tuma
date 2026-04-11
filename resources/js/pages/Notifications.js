export default {
    name: 'Notifications',
    data() { return { notifications: [], meta: null, loading: true, marking: false } },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const { data } = await this.$http.get('/user/notifications', { params: { page } })
                this.notifications = data.data
                this.meta = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        async markAllRead() {
            this.marking = true
            try {
                await this.$http.post('/user/notifications/read-all')
                this.notifications = this.notifications.map(n => ({ ...n, read_at: new Date().toISOString() }))
                this.$toast.success('All marked as read.')
            } catch {}
            this.marking = false
        },
        async markRead(id) {
            try {
                await this.$http.post('/user/notifications/' + id + '/read')
                const n = this.notifications.find(n => n.id === id)
                if (n) n.read_at = new Date().toISOString()
            } catch {}
        },
        iconFor(type) {
            const map = {
                MatchProposed: 'fa-handshake',
                FundsReleased: 'fa-hand-holding-usd',
                DepositVerified: 'fa-check-circle',
                DisputeResolved: 'fa-gavel',
                KycApproved: 'fa-id-card',
                KycRejected: 'fa-times-circle',
                RateAlertTriggered: 'fa-chart-line',
                ChatMessage: 'fa-comment',
            }
            return map[type] || 'fa-bell'
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      <button v-if="notifications.some(n => !n.read_at)" @click="markAllRead" :disabled="marking"
        class="text-sm text-green-700 hover:underline font-medium">
        Mark all read
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="notifications.length" class="space-y-2">
      <div v-for="n in notifications" :key="n.id"
        @click="markRead(n.id)"
        :class="['bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow',
          !n.read_at ? 'border-green-200 bg-green-50/30' : 'border-gray-100']">
        <div class="flex items-start gap-3">
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
            !n.read_at ? 'bg-green-100' : 'bg-gray-100']">
            <i :class="['fas text-sm', iconFor(n.type), !n.read_at ? 'text-green-600' : 'text-gray-400']"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p :class="['text-sm', !n.read_at ? 'font-semibold text-gray-900' : 'font-medium text-gray-700']">
              {{ n.data?.message || 'New notification' }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ $fmt.datetime(n.created_at) }}</p>
          </div>
          <div v-if="!n.read_at" class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
        </div>
      </div>
      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-bell" title="No notifications" subtitle="You're all caught up!" />
  </div>
  <app-footer />
</div>`
}
