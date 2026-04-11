export default {
    name: 'AdminAuditLogs',
    data() {
        return {
            logs: [], meta: null, loading: true,
            filters: { event: '', user_id: '', search: '' }
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page, per_page: 25 }
                if (this.filters.event)   params.event   = this.filters.event
                if (this.filters.user_id) params.user_id = this.filters.user_id
                if (this.filters.search)  params.search  = this.filters.search
                const { data } = await this.$http.get('/admin/audit-logs', { params })
                this.logs = data.data || []
                this.meta = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        reset() { this.filters = { event:'', user_id:'', search:'' }; this.load() },
        eventColor(e) {
            if (e.startsWith('fraud'))  return 'bg-red-100 text-red-700'
            if (e.startsWith('user'))   return 'bg-blue-100 text-blue-700'
            if (e.startsWith('order'))  return 'bg-purple-100 text-purple-700'
            if (e.startsWith('match'))  return 'bg-yellow-100 text-yellow-700'
            if (e.startsWith('kyc'))    return 'bg-green-100 text-green-700'
            if (e.startsWith('admin'))  return 'bg-orange-100 text-orange-700'
            return 'bg-gray-100 text-gray-600'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
      <p class="text-sm text-gray-500 mt-0.5">Full record of all system events and admin actions.</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid sm:grid-cols-3 gap-3">
        <input v-model="filters.search" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search events...">
        <input v-model="filters.event" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Filter by event type (e.g. order.created)">
        <div class="flex gap-2">
          <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
          <button @click="reset()" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-50">
        <div v-for="log in logs" :key="log.id" class="px-5 py-3.5 hover:bg-gray-50 transition-colors">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <span :class="['text-xs px-2.5 py-1 rounded-lg font-bold whitespace-nowrap flex-shrink-0 mt-0.5', eventColor(log.event)]">
                {{ log.event }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ log.actor?.first_name }} {{ log.actor?.last_name }}
                  <span class="text-gray-400 font-normal">· {{ log.actor?.email }}</span>
                </p>
                <p v-if="log.description" class="text-xs text-gray-500 mt-0.5 truncate">{{ log.description }}</p>
                <p v-if="log.ip_address" class="text-xs text-gray-400 mt-0.5">IP: {{ log.ip_address }}</p>
              </div>
            </div>
            <span class="text-xs text-gray-400 flex-shrink-0 mt-1">{{ $fmt.datetime ? $fmt.datetime(log.created_at) : $fmt.date(log.created_at) }}</span>
          </div>
        </div>
        <div v-if="!logs.length" class="px-5 py-8 text-center text-sm text-gray-400">No audit logs found.</div>
      </div>
      <div class="px-5 py-3 border-t border-gray-100" v-if="meta">
        <pagination-links :meta="meta" @page="load($event)" />
      </div>
    </div>
  </div>
</div>`
}
