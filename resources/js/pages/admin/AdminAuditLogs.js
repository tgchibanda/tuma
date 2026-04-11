export default {
    name: 'AdminAuditLogs',

    data() {
        return {
            items: [],
            meta: null,
            stats: {},

            loading: true,
            error: null,

            search: '',
            actionFilter: ''
        }
    },

    async mounted() {
        await this.load()
    },

    methods: {
        async load(page = 1) {
            this.loading = true
            this.error = null

            const params = { page }

            if (this.search) params.search = this.search
            if (this.actionFilter) params.action = this.actionFilter

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/audit-logs', { params })

                this.items = data.data || []
                this.meta  = data.meta?.pagination || null
                this.stats = data.stats || {}

            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load audit logs'
            }

            this.loading = false
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Audit Logs</h1>
        <span v-if="meta" class="text-sm text-gray-500">{{ meta.total }} entries</span>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-3 gap-3">

          <input v-model="search" @keyup.enter="load()"
            type="text"
            placeholder="Search user, action, metadata..."
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">

          <select v-model="actionFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All actions</option>
            <option value="setting.updated">Setting updated</option>
            <option value="user.suspended">User suspended</option>
            <option value="kyc.approved">KYC approved</option>
            <option value="kyc.rejected">KYC rejected</option>
          </select>

          <button @click="load()"
            class="px-4 py-2 text-sm bg-gray-100 rounded-xl hover:bg-gray-200">
            Refresh
          </button>

        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              <tr v-for="log in items" :key="log.id" class="hover:bg-gray-50">

                <!-- Action -->
                <td class="px-4 py-3">
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {{ log.action }}
                  </span>
                </td>

                <!-- User -->
                <td class="px-4 py-3 text-xs text-gray-700">
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ log.user?.name || 'System' }}
                    </p>
                    <p class="text-gray-400">
                      {{ log.user?.email }}
                    </p>
                  </div>
                </td>

                <!-- Details -->
                <td class="px-4 py-3 text-xs text-gray-600">
                  <pre class="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-lg overflow-auto max-w-md">
{{ JSON.stringify(log.new_values || log.old_values || {}, null, 2) }}
                  </pre>
                </td>

                <!-- Date -->
                <td class="px-4 py-3 text-xs text-gray-500">
                  {{ $fmt.datetime(log.created_at) }}
                </td>

              </tr>
            </tbody>
          </table>

          <div v-if="!items.length" class="text-center py-12 text-gray-400 text-sm">
            No audit logs found
          </div>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`
}