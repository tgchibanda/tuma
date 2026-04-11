export default {
    name: 'AdminMatches',
    data() { return { matches: [], meta: null, loading: true, statusFilter: '' } },
    async mounted() { await this.load() },
    watch: { statusFilter() { this.load() } },
    methods: {
        async load(page = 1) {
            this.loading = true
            const params = { page }
            if (this.statusFilter) params.status = this.statusFilter
            try {
                const { data } = await this.$http.get('/../../api/admin/matches', { params })
                this.matches = data.data
                this.meta    = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        urgencyClass(m) {
            if (['deposit_uploaded','risk_deposit_uploaded'].includes(m.status)) return 'border-l-4 border-l-blue-500'
            if (['confirmed','risk_deposit_verified'].includes(m.status)) return 'border-l-4 border-l-green-500'
            if (m.status === 'disputed') return 'border-l-4 border-l-red-500'
            return ''
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/dashboard"><div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">Tu</span></div></router-link>
    <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
    <nav class="flex items-center gap-1 text-sm ml-2">
      <router-link v-for="l in [{to:'/admin/dashboard',label:'Dashboard'},{to:'/admin/users',label:'Users'},{to:'/admin/matches',label:'Matches'},{to:'/admin/deposits',label:'Deposits'},{to:'/admin/disputes',label:'Disputes'},{to:'/admin/settings',label:'Settings'}]"
        :key="l.to" :to="l.to" class="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900">{{ l.label }}</router-link>
    </nav>
  </div>

  <div class="max-w-7xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between mb-5">
      <h1 class="text-xl font-bold text-gray-900">Matches</h1>
      <select v-model="statusFilter"
        class="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
        <option value="">All statuses</option>
        <option value="deposit_uploaded">Deposit uploaded</option>
        <option value="risk_deposit_uploaded">Risk deposit uploaded</option>
        <option value="confirmed">Ready to release</option>
        <option value="risk_deposit_verified">Risk ready to release</option>
        <option value="disputed">Disputed</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Match</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">AUD</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sender</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Receiver</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="m in matches" :key="m.ulid" :class="['hover:bg-gray-50 transition', urgencyClass(m)]">
            <td class="px-4 py-3">
              <p class="font-mono text-xs text-gray-600">{{ m.ulid ? m.ulid.slice(0,12) : '' }}</p>
              <p class="text-xs text-gray-400">{{ $fmt.date(m.created_at) }}</p>
            </td>
            <td class="px-4 py-3"><status-badge :status="m.status" /></td>
            <td class="px-4 py-3 text-right font-semibold text-gray-900">
              {{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : '—' }}
            </td>
            <td class="px-4 py-3 text-xs text-gray-700">{{ m.sender?.name }}</td>
            <td class="px-4 py-3 text-xs text-gray-700">{{ m.receiver?.name }}</td>
            <td class="px-4 py-3 text-xs text-gray-600">{{ m.location?.name }}</td>
            <td class="px-4 py-3">
              <router-link :to="'/admin/matches/' + m.ulid"
                class="px-3 py-1.5 text-xs text-green-700 border border-green-200 rounded-lg hover:bg-green-50">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!matches.length" class="text-center py-12 text-sm text-gray-400">No matches found</div>
    </div>

    <pagination-links :meta="meta" @page="load($event)" />
  </div>
</div>`
}
