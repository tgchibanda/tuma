export default {
    name: 'Matches',
    data() {
        return { matches: [], meta: null, loading: true, tab: 'active' }
    },
    computed: {
        tabs() {
            return [
                { key: 'active',    label: 'Active' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
            ]
        }
    },
    async mounted() { await this.load() },
    watch: { tab() { this.load() } },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page }
                if (this.tab === 'active') {
                    params.exclude_status = 'completed,cancelled,refunded'
                } else {
                    params.status = this.tab
                }
                const { data } = await this.$http.get('/matches', { params })
                this.matches = data.data
                this.meta    = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        statusColor(s) {
            if (['completed'].includes(s)) return 'text-green-600'
            if (['cancelled','refunded'].includes(s)) return 'text-red-500'
            if (['disputed'].includes(s)) return 'text-orange-500'
            return 'text-blue-600'
        },
        stepLabel(s) {
            const steps = {
                proposed: 'Waiting for response',
                negotiating: 'Negotiating rate',
                rate_agreed: 'Choose delivery method',
                delivery_method_selecting: 'Agree on delivery',
                awaiting_deposit: 'Waiting for AUD deposit',
                deposit_uploaded: 'Deposit proof submitted',
                deposit_verified: 'Deposit confirmed',
                awaiting_delivery: 'Cash being delivered',
                delivery_uploaded: 'Delivery proof submitted',
                awaiting_confirmation: 'Waiting for confirmation',
                confirmed: 'Confirmed — releasing funds',
                completing: 'Completing',
                completed: 'Completed',
                cancelled: 'Cancelled',
                disputed: 'Under dispute',
                refunded: 'Refunded',
            }
            return steps[s] || s
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Matches</h1>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        :class="['flex-1 py-2 rounded-xl text-sm font-medium transition',
          tab === t.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800']">
        {{ t.label }}
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="matches.length" class="space-y-3">
      <router-link v-for="match in matches" :key="match.ulid" :to="'/matches/' + match.ulid"
        class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <!-- Status + delivery badge -->
            <div class="flex flex-wrap gap-2 mb-2">
              <status-badge :status="match.status" />
              <span v-if="match.delivery_method && match.delivery_method !== 'pending'"
                :class="['text-xs font-medium px-2 py-0.5 rounded-full',
                  match.delivery_method === 'secure' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
                <i :class="['fas mr-0.5 text-xs',
                  match.delivery_method === 'secure' ? 'fa-shield-alt' : 'fa-exclamation-triangle']"></i>
                {{ match.delivery_method === 'secure' ? 'Secure' : 'Risk' }}
              </span>
              <!-- Unread badge -->
              <span v-if="match.unread_messages > 0"
                class="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                {{ match.unread_messages }} new message{{ match.unread_messages > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Amount -->
            <p v-if="match.agreed_aud" class="text-xl font-bold text-gray-900">
              {{ $fmt.aud(match.agreed_aud) }}
              <span class="text-sm text-gray-400 font-normal ml-1">{{ $fmt.usd(match.agreed_usd) }}</span>
            </p>
            <p v-else-if="match.proposed_aud" class="text-base font-semibold text-gray-600">
              Proposed: {{ $fmt.aud(match.proposed_aud) }}
            </p>

            <!-- Step label -->
            <p :class="['text-xs font-medium mt-1', statusColor(match.status)]">
              <i class="fas fa-circle text-xs mr-1"></i>{{ stepLabel(match.status) }}
            </p>

            <!-- Location + date -->
            <p class="text-xs text-gray-400 mt-1.5">
              <span v-if="match.location">
                <i class="fas fa-map-marker-alt mr-1 text-green-600"></i>{{ match.location.name }} &middot;
              </span>
              {{ $fmt.datetime(match.updated_at) }}
            </p>
          </div>

          <div class="flex-shrink-0 text-right">
            <span class="text-xs text-green-700 font-medium">View &rarr;</span>
          </div>
        </div>
      </router-link>

      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-handshake"
      :title="tab === 'active' ? 'No active matches' : 'No ' + tab + ' matches'"
      :subtitle="tab === 'active' ? 'Browse open orders to propose your first match.' : 'Nothing here yet.'"
      action-label="Browse Orders" action-to="/browse" />
  </div>
  <app-footer />
</div>`
}
