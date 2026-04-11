export default {
    name: 'Directory',
    data() {
        return {
            items: [], meta: null, loading: true,
            search: '', orderType: '', city: '',
            locations: [],
        }
    },
    async mounted() {
        try {
            const { data } = await this.$http.get('/countries/2/locations')
            this.locations = data.data?.flat || []
        } catch {}
        await this.load()
    },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page, per_page: 12 }
                if (this.search)    params.search     = this.search
                if (this.orderType) params.order_type = this.orderType
                if (this.city)      params.location_id= this.city
                const { data } = await this.$http.get('/directory', { params })
                this.items = data.data || []
                this.meta  = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        reset() { this.search = ''; this.orderType = ''; this.city = ''; this.load() },
        viewProfile(ulid) { this.$router.push('/profile/' + ulid) },
        trustColor(s) {
            if (s >= 70) return 'text-green-600'
            if (s >= 40) return 'text-yellow-600'
            return 'text-gray-400'
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-gray-900">Member Directory</h1>
      <p class="text-sm text-gray-500 mt-1">Browse verified traders and businesses. Click any member to view their full profile.</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div class="grid sm:grid-cols-4 gap-3">
        <div class="sm:col-span-2">
          <input v-model="search" @keyup.enter="load()" type="text"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Search by name...">
        </div>
        <select v-model="orderType" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All types</option>
          <option value="send_to_zim">Sends to Zimbabwe</option>
          <option value="receive_from_zim">Receives from Zimbabwe</option>
        </select>
        <select v-model="city" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All cities</option>
          <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
        </select>
      </div>
      <div class="flex gap-2 mt-3">
        <button @click="load()" class="px-4 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-search mr-1.5 text-xs"></i>Search
        </button>
        <button @click="reset()" class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Reset</button>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="items.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in items" :key="item.ulid"
        @click="viewProfile(item.ulid)"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer p-5">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-black text-xl flex-shrink-0">
            {{ item.display_name?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <p class="font-bold text-gray-900 truncate">{{ item.display_name }}</p>
              <span v-if="item.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0">
                <i class="fas fa-check-circle text-xs"></i>
              </span>
            </div>
            <p v-if="item.business_name" class="text-xs text-gray-500 truncate">{{ item.business_name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              <i class="fas fa-map-marker-alt text-green-600 mr-0.5"></i>
              {{ item.city || item.country || 'Australia' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center mb-3">
          <div class="bg-gray-50 rounded-xl py-2">
            <p class="text-base font-black text-gray-900">{{ item.total_trades }}</p>
            <p class="text-xs text-gray-400">Trades</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-2">
            <p class="text-base font-black text-gray-900">{{ item.rating ? parseFloat(item.rating).toFixed(1) : '—' }}</p>
            <p class="text-xs text-gray-400">Rating</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-2">
            <p :class="['text-base font-black', trustColor(item.trust_score)]">{{ item.trust_score }}</p>
            <p class="text-xs text-gray-400">Trust</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-3">
          <span v-if="item.always_available" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            <i class="fas fa-circle text-green-500" style="font-size:7px"></i> Available
          </span>
          <span v-for="b in (item.badges || []).slice(0,3)" :key="b.badge_key" class="text-sm" :title="b.badge_name">{{ b.badge_icon }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-0.5">
            <i v-for="s in 5" :key="s"
              :class="['fas fa-star text-xs', s <= Math.round(item.rating || 0) ? 'text-yellow-400' : 'text-gray-200']"></i>
          </div>
          <span class="text-xs text-green-700 font-semibold flex items-center gap-1">
            View profile <i class="fas fa-chevron-right text-xs"></i>
          </span>
        </div>
      </div>
    </div>

    <empty-state v-else-if="!loading" icon="fa-users"
      title="No members found"
      subtitle="Try a different search term or clear your filters." />

    <div class="mt-6" v-if="meta">
      <pagination-links :meta="meta" @page="load($event)" />
    </div>
  </div>
  <app-footer />
</div>`
}
