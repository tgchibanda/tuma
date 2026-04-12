export default {
    name: 'Browse',
    data() {
        return {
            orders: [], meta: null, loading: true,
            locations: [],         // flat list for lookups
            groupedLocations: {},  // { province: [loc, ...] }
            filters: {
                location_ids: [],  // multi-select array of ints
                order_type: '',
                min_aud: '',
                max_aud: '',
                sort: 'newest',
                user_ulid: '',    // 'send money via' filter
            },
            sendMoneyViaName: '',
            proposing: null,
            proposeForm: { my_order_ulid: '', proposed_aud: '', proposed_usd: '', message: '' },
            myOpenOrders: [],
            rate: null,
            proposing_loading: false,
            propose_error: null,
        }
    },
    computed: {
        activeLocationNames() {
            return this.filters.location_ids
                .map(id => this.locations.find(l => l.id === id))
                .filter(Boolean)
                .map(l => l.name)
        }
    },
    async mounted() {
        await Promise.all([this.fetchLocations(), this.fetchMyOrders(), this.fetchRate()])
        if (this.$route.query.location) {
            const id = parseInt(this.$route.query.location)
            if (id) this.filters.location_ids = [id]
        }
        if (this.$route.query.user) {
            this.filters.user_ulid = this.$route.query.user
            // Fetch the user's name for the banner
            try {
                const { data } = await this.$http.get('/users/' + this.$route.query.user)
                this.sendMoneyViaName = data.data?.display_name?.split(' ')[0] || ''
            } catch {}
        }
        await this.load()
    },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page }
                if (this.filters.location_ids.length)
                    params.zim_location_ids = this.filters.location_ids.join(',')
                if (this.filters.order_type)          params.order_type = this.filters.order_type
                if (this.filters.min_aud)             params.min_aud    = this.filters.min_aud
                if (this.filters.max_aud)             params.max_aud    = this.filters.max_aud
                if (this.filters.sort !== 'newest')   params.sort       = this.filters.sort
                if (this.filters.user_ulid)            params.user_ulid  = this.filters.user_ulid
                const { data } = await this.$http.get('/orders/browse', { params })
                this.orders = data.data || []
                this.meta   = data.meta?.pagination
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed to load orders.')
            }
            this.loading = false
        },

        async fetchLocations() {
            try {
                const { data } = await this.$http.get('/countries/2/locations')
                const payload = data.data
                // flat list for ID-to-name lookups
                this.locations = payload.flat || []
                // Build grouped map for the checkbox tree
                const map = {}
                ;(payload.grouped || []).forEach(g => {
                    map[g.province] = g.locations
                })
                this.groupedLocations = map
            } catch {}
        },

        async fetchMyOrders() {
            try {
                const { data } = await this.$http.get('/orders', { params: { status: 'open' } })
                this.myOpenOrders = data.data || []
            } catch {}
        },

        async fetchRate() {
            try {
                const { data } = await this.$http.get('/exchange-rates/AUD/USD')
                this.rate = data.data
            } catch {}
        },

        toggleCity(id) {
            id = parseInt(id)
            const idx = this.filters.location_ids.indexOf(id)
            if (idx === -1) this.filters.location_ids.push(id)
            else            this.filters.location_ids.splice(idx, 1)
        },
        isCitySelected(id) { return this.filters.location_ids.includes(parseInt(id)) },
        clearCities()       { this.filters.location_ids = [] },

        resetFilters() {
            this.filters = { location_ids: [], order_type: '', min_aud: '', max_aud: '', sort: 'newest' }
            this.load()
        },

        openPropose(order) {
            if (!this.myOpenOrders.length) {
                this.$toast.error('You need an open order to propose a match.')
                this.$router.push('/orders/create')
                return
            }
            this.proposing     = order
            this.propose_error = null
            const compatible = this.myOpenOrders.find(o => o.order_type !== order.order_type)
            const chosen     = compatible || this.myOpenOrders[0]
            this.proposeForm = {
                my_order_ulid: chosen?.ulid || '',
                proposed_aud:  order.amount_aud,
                proposed_usd:  order.amount_usd,
                message: ''
            }
        },

        calcUsd() {
            if (!this.rate || !this.proposeForm.proposed_aud) return
            const fee = parseFloat(this.rate.platform_fee_percent || 1.5)
            const amt = parseFloat(this.proposeForm.proposed_aud)
            this.proposeForm.proposed_usd = ((amt - amt * fee / 100) * parseFloat(this.rate.rate)).toFixed(2)
        },

        async submitPropose() {
            if (!this.proposeForm.my_order_ulid || !this.proposeForm.proposed_aud) {
                this.propose_error = 'Please select your order and enter an amount.'
                return
            }
            this.proposing_loading = true
            this.propose_error     = null
            try {
                const { data } = await this.$http.post(
                    '/orders/' + this.proposeForm.my_order_ulid + '/propose-match',
                    {
                        target_order_ulid: this.proposing.ulid,
                        proposed_aud:      parseFloat(this.proposeForm.proposed_aud),
                        proposed_usd:      parseFloat(this.proposeForm.proposed_usd),
                        message:           this.proposeForm.message || null
                    }
                )
                this.$toast.success('Match proposed! You will be redirected to the match.')
                this.proposing = null
                this.$router.push('/matches/' + data.data.match.ulid)
            } catch (e) {
                this.propose_error = e.response?.data?.message || 'Failed to propose match.'
            }
            this.proposing_loading = false
        },

        // Navigate to public profile page — /profile/:ulid
        viewProfile(ulid) {
            if (!ulid) return
            this.$router.push('/profile/' + ulid)
        },

        trustColor(score) {
            if (score >= 70) return 'text-green-600'
            if (score >= 40) return 'text-yellow-600'
            return 'text-gray-400'
        }
    },

    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />

  <!-- ── PROPOSE MATCH MODAL ──────────────────────────────────────────────── -->
  <div v-if="proposing"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click.self="proposing = null">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-bold text-gray-900">Propose a match</h2>
        <button @click="proposing = null"
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Their order</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-black text-gray-900 text-xl">{{ $fmt.aud(proposing.amount_aud) }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ $fmt.usd(proposing.amount_usd) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              <i class="fas fa-map-marker-alt text-green-600 mr-0.5"></i>
              {{ proposing.delivery_location?.name }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-800">{{ proposing.owner?.display_name }}</p>
            <div class="flex items-center gap-1 justify-end mt-0.5">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-gray-500">
                {{ proposing.owner?.rating ? parseFloat(proposing.owner.rating).toFixed(1) : 'No ratings' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <alert-banner v-if="propose_error" type="error" :message="propose_error" class="mb-4" />

      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">Use my order</label>
          <select v-model="proposeForm.my_order_ulid"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option v-if="!myOpenOrders.length" value="">No open orders — create one first</option>
            <option v-for="o in myOpenOrders" :key="o.ulid" :value="o.ulid">
              {{ o.order_type === 'send_to_zim' ? 'Send' : 'Receive' }}
              · {{ $fmt.aud(o.amount_aud) }}
              · {{ o.delivery_location?.name || 'Unknown city' }}
            </option>
          </select>
          <router-link v-if="!myOpenOrders.length" to="/orders/create"
            class="text-xs text-green-700 font-semibold hover:underline mt-1 inline-block">
            + Create an order first
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">AUD amount</label>
            <input v-model="proposeForm.proposed_aud" type="number" min="50" step="10" @input="calcUsd"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="500">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">
              USD <span class="text-gray-400 font-normal text-xs">(auto)</span>
            </label>
            <input v-model="proposeForm.proposed_usd" type="number" min="1" step="0.01"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="310.27">
          </div>
        </div>
        <p v-if="rate" class="text-xs text-gray-400 -mt-2">
          Rate: 1 AUD = {{ parseFloat(rate.rate).toFixed(4) }} USD · Fee: {{ rate.platform_fee_percent || 1.5 }}%
        </p>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">
            Message <span class="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <textarea v-model="proposeForm.message" rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Hi! I am available today and can confirm quickly..."></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="submitPropose"
            :disabled="proposing_loading || !proposeForm.my_order_ulid || !proposeForm.proposed_aud || !myOpenOrders.length"
            class="flex-1 py-3.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all shadow-sm"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="proposing_loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-handshake mr-2"></i>
            Send proposal
          </button>
          <button @click="proposing = null"
            class="px-5 py-3.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── MAIN CONTENT ──────────────────────────────────────────────────────── -->
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Browse Open Orders</h1>
        <div v-if="sendMoneyViaName"
          class="mt-3 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <i class="fas fa-filter text-green-600"></i>
          <p class="text-sm text-green-800 font-medium flex-1">
            Showing orders by <strong>{{ sendMoneyViaName }}</strong>
          </p>
          <button @click="filters.user_ulid=\'\'; sendMoneyViaName=\'\'; load()"
            class="text-xs text-green-700 font-semibold hover:underline">Clear filter</button>
        </div>
        <p class="text-sm text-gray-500 mt-0.5">Find a match and start a transaction.</p>
      </div>
      <router-link to="/orders/create"
        class="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all shadow-sm"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Post your own order
      </router-link>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">

      <!-- ── SIDEBAR ─────────────────────────────────────────────────────── -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-gray-900">Filters</h2>
            <button @click="resetFilters" class="text-xs text-green-700 hover:underline font-medium">Reset all</button>
          </div>

          <!-- Direction -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Direction</label>
            <select v-model="filters.order_type" @change="load()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="">All directions</option>
              <option value="send_to_zim">Send to Zimbabwe</option>
              <option value="receive_from_zim">Receive from Zimbabwe</option>
            </select>
          </div>

          <!-- Multi-city filter -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Zimbabwe cities
                <span v-if="filters.location_ids.length"
                  class="ml-1 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {{ filters.location_ids.length }}
                </span>
              </label>
              <button v-if="filters.location_ids.length" @click="clearCities(); load()"
                class="text-xs text-red-500 hover:underline">Clear</button>
            </div>

            <!-- Selected pills -->
            <div v-if="filters.location_ids.length" class="flex flex-wrap gap-1 mb-2">
              <span v-for="name in activeLocationNames" :key="name"
                class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {{ name }}
              </span>
            </div>

            <!-- Checkboxes -->
            <div class="max-h-52 overflow-y-auto border border-gray-100 rounded-xl">
              <div v-if="!Object.keys(groupedLocations).length" class="px-3 py-4 text-xs text-gray-400 text-center">
                <i class="fas fa-spinner fa-spin mr-1"></i> Loading...
              </div>
              <div v-for="(locs, province) in groupedLocations" :key="province">
                <p class="text-xs font-semibold text-gray-400 px-3 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0">
                  {{ province }}
                </p>
                <label v-for="loc in locs" :key="loc.id"
                  class="flex items-center gap-2.5 px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors">
                  <input type="checkbox"
                    :checked="isCitySelected(loc.id)"
                    @change="toggleCity(loc.id)"
                    class="w-3.5 h-3.5 rounded accent-green-600 flex-shrink-0">
                  <span class="text-sm text-gray-700">{{ loc.name }}</span>
                </label>
              </div>
            </div>
            <button @click="load()"
              class="w-full mt-2 py-2 text-xs font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
              Apply city filter
            </button>
          </div>

          <!-- Amount -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Amount (AUD)</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="filters.min_aud" @keyup.enter="load()" type="number" min="50"
                class="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-500"
                placeholder="Min">
              <input v-model="filters.max_aud" @keyup.enter="load()" type="number"
                class="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-500"
                placeholder="Max">
            </div>
          </div>

          <!-- Sort -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Sort by</label>
            <select v-model="filters.sort" @change="load()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="newest">Newest first</option>
              <option value="amount_asc">Amount: low to high</option>
              <option value="amount_desc">Amount: high to low</option>
            </select>
          </div>

          <button @click="load()"
            class="w-full py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i class="fas fa-search mr-1.5 text-xs"></i> Search orders
          </button>
        </div>
      </div>

      <!-- ── RESULTS ─────────────────────────────────────────────────────── -->
      <div class="lg:col-span-3">

        <!-- Active filter chips -->
        <div v-if="filters.location_ids.length || filters.order_type || filters.min_aud || filters.max_aud"
          class="flex flex-wrap gap-2 mb-4 items-center">
          <span class="text-xs text-gray-500 font-medium">Active:</span>
          <span v-if="filters.order_type"
            class="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
            {{ filters.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
            <button @click="filters.order_type = ''; load()"><i class="fas fa-times text-xs ml-0.5"></i></button>
          </span>
          <span v-for="name in activeLocationNames" :key="name"
            class="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            <i class="fas fa-map-marker-alt text-xs"></i>{{ name }}
          </span>
          <span v-if="filters.min_aud || filters.max_aud"
            class="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
            AUD {{ filters.min_aud || '50' }}{{ filters.max_aud ? ' – ' + filters.max_aud : '+' }}
          </span>
        </div>

        <loading-spinner v-if="loading" />

        <div v-else-if="orders.length" class="space-y-3">
          <div class="flex items-center justify-between text-xs text-gray-400 px-1 mb-2">
            <span>{{ meta?.total || orders.length }} order{{ (meta?.total || orders.length) !== 1 ? 's' : '' }} found</span>
            <span>Boosted orders appear first</span>
          </div>

          <div v-for="order in orders" :key="order.ulid"
            :class="['bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5',
              order.is_trusted_contact
                ? 'border-green-300 ring-1 ring-green-200 bg-green-50/20'
                : 'border-gray-100']">

            <!-- Trusted contact badge -->
            <div v-if="order.is_trusted_contact"
              class="flex items-center gap-1.5 mb-3 text-xs font-bold text-green-700 bg-green-100 w-fit px-3 py-1.5 rounded-xl">
              <i class="fas fa-user-check text-xs"></i> Trusted contact
            </div>

            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap gap-2 mb-2.5">
                  <span :class="['text-xs font-bold px-2.5 py-1 rounded-lg',
                    order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ order.order_type === 'send_to_zim' ? 'Send to Zimbabwe' : 'Receive from Zimbabwe' }}
                  </span>
                  <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg font-bold">
                    <i class="fas fa-bolt mr-0.5"></i> Boosted
                  </span>
                </div>

                <p class="text-2xl font-black text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
                <p class="text-sm text-gray-500 mt-0.5">
                  {{ $fmt.usd(order.amount_usd) }}
                  <span v-if="order.delivery_location?.name">
                    <i class="fas fa-map-marker-alt text-green-600 text-xs ml-2 mr-0.5"></i>
                    {{ order.delivery_location.name }}
                    <span v-if="order.delivery_location.province" class="text-gray-400">, {{ order.delivery_location.province }}</span>
                  </span>
                </p>

                <div class="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {{ order.owner?.display_name?.[0]?.toUpperCase() || '?' }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ order.owner?.display_name }}</p>
                    <div class="flex items-center flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                      <span v-if="order.owner?.rating">
                        <i class="fas fa-star text-yellow-400"></i>
                        {{ parseFloat(order.owner.rating).toFixed(1) }}
                      </span>
                      <span>{{ order.owner?.total_trades }} trades</span>
                      <span :class="['font-semibold', trustColor(order.owner?.trust_score || 0)]">
                        Trust {{ order.owner?.trust_score }}
                      </span>
                      <span v-if="order.owner?.kyc_verified" class="text-green-600 font-medium">
                        <i class="fas fa-check-circle text-xs"></i> Verified
                      </span>
                      <span>{{ order.created_human }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2 flex-shrink-0">
                <button @click="openPropose(order)"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                  style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
                  <i class="fas fa-handshake text-xs"></i> Propose match
                </button>
                <!-- Use programmatic navigation to avoid route conflicts with /profile/:ulid -->
                <button v-if="order.owner?.ulid" @click="viewProfile(order.owner.ulid)"
                  class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors justify-center">
                  <i class="fas fa-user text-xs"></i> View profile
                </button>
              </div>
            </div>
          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <empty-state v-else-if="!loading" icon="fa-search"
          title="No orders found"
          :subtitle="filters.location_ids.length
            ? 'No open orders for the selected cities. Try adding more cities or clear the city filter.'
            : 'No open orders match your filters. Try adjusting your search or post your own order.'"
          action-label="Post your own order"
          action-to="/orders/create" />
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
