export default {
    name: 'AdminDisputes',

    data() {
        return {
            items: [],
            meta: null,
            loading: true,
            error: null,
            statusFilter: 'open'
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

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/disputes', {
                    params: { page, status: this.statusFilter || undefined }
                })

                this.items = data.data || []
                this.meta  = data.meta?.pagination || null

            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load disputes'
            }

            this.loading = false
        },

        urgencyRow(d) {
            if (d.urgency === 'critical') return 'border-l-4 border-l-red-500'
            if (d.urgency === 'high') return 'border-l-4 border-l-orange-400'
            if (d.urgency === 'medium') return 'border-l-4 border-l-yellow-400'
            return ''
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-6xl mx-auto px-6 py-6">

      <div class="flex justify-between mb-5">
        <h1 class="text-xl font-bold">Disputes</h1>

        <select v-model="statusFilter" class="px-3 py-2 border rounded-xl text-sm">
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="">All</option>
        </select>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div v-if="items.length" class="space-y-3">
          <div v-for="d in items" :key="d.id"
            :class="['bg-white rounded-2xl border p-5', urgencyRow(d)]">

            <p class="text-sm">{{ d.reason }}</p>

            <router-link :to="'/admin/disputes/' + d.id"
              class="mt-2 inline-block px-3 py-1 text-xs bg-green-700 text-white rounded">
              Resolve
            </router-link>
          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <div v-else class="text-center py-10 text-gray-400">
          No disputes
        </div>
      </div>

    </div>
  </div>
</div>`
}