export default {
    name: 'AdminDeposits',

    data() {
        return {
            items: [],
            meta: null,
            loading: true,
            error: null
        }
    },

    async mounted() { await this.load() },

    methods: {
        async load(page = 1) {
            this.loading = true
            this.error = null

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/deposits', { params: { page } })
                this.items = data.data || []
                this.meta  = data.meta?.pagination || null
            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load deposits'
            }

            this.loading = false
        },

        urgencyClass(h) {
            if (h >= 24) return 'bg-red-50 border-red-200'
            if (h >= 8) return 'bg-orange-50 border-orange-100'
            return 'bg-white border-gray-100'
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-5xl mx-auto px-6 py-6">

      <h1 class="text-xl font-bold mb-5">Deposit Queue</h1>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div v-if="items.length" class="space-y-3">
          <div v-for="d in items" :key="d.id"
            :class="['rounded-2xl border p-5', urgencyClass(d.hours_waiting || 0)]">

            <p class="font-semibold">{{ $fmt.aud(d.amount_aud) }}</p>
            <p class="text-xs text-gray-500">{{ d.depositor?.name }}</p>

            <div class="mt-2 flex gap-2">
              <a v-if="d.proof_url" :href="d.proof_url" target="_blank"
                class="px-3 py-1 text-xs border rounded">Proof</a>

              <router-link :to="'/admin/matches/' + d.match_ulid"
                class="px-3 py-1 text-xs border rounded text-green-700">
                Match
              </router-link>
            </div>
          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <div v-else class="text-center py-10 text-gray-400">
          No pending deposits
        </div>
      </div>

    </div>
  </div>
</div>`
}