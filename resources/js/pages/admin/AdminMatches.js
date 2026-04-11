export default {
    name: 'AdminMatches',

    data() {
        return {
            items: [],
            meta: null,
            loading: true,
            error: null,
            statusFilter: ''
        }
    },

    async mounted() { await this.load() },

    watch: {
        statusFilter() { this.load() }
    },

    methods: {
        async load(page = 1) {
            this.loading = true
            this.error = null

            const params = { page }
            if (this.statusFilter) params.status = this.statusFilter

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/matches', { params })
                this.items = data.data || []
                this.meta  = data.meta?.pagination || null
            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load matches'
            }

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
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">Matches</h1>
        <select v-model="statusFilter" class="px-3 py-2 border rounded-xl text-sm">
          <option value="">All statuses</option>
          <option value="deposit_uploaded">Deposit uploaded</option>
          <option value="risk_deposit_uploaded">Risk deposit uploaded</option>
          <option value="confirmed">Ready to release</option>
          <option value="risk_deposit_verified">Risk ready</option>
          <option value="disputed">Disputed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-xs">Match</th>
                <th class="px-4 py-3 text-left text-xs">Status</th>
                <th class="px-4 py-3 text-right text-xs">AUD</th>
                <th class="px-4 py-3 text-left text-xs">Sender</th>
                <th class="px-4 py-3 text-left text-xs">Receiver</th>
                <th class="px-4 py-3 text-left text-xs">Location</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="m in items" :key="m.ulid" :class="['hover:bg-gray-50', urgencyClass(m)]">
                <td class="px-4 py-3">
                  <p class="font-mono text-xs">{{ m.ulid?.slice(0,12) }}</p>
                  <p class="text-xs text-gray-400">{{ $fmt.date(m.created_at) }}</p>
                </td>

                <td class="px-4 py-3">
                  <status-badge :status="m.status" />
                </td>

                <td class="px-4 py-3 text-right font-semibold">
                  {{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : '—' }}
                </td>

                <td class="px-4 py-3 text-xs">{{ m.sender?.name }}</td>
                <td class="px-4 py-3 text-xs">{{ m.receiver?.name }}</td>
                <td class="px-4 py-3 text-xs">{{ m.location?.name }}</td>

                <td class="px-4 py-3">
                  <router-link :to="'/admin/matches/' + m.ulid"
                    class="px-3 py-1 text-xs border rounded-lg text-green-700">
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!items.length" class="text-center py-10 text-gray-400">
            No matches found
          </div>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`
}