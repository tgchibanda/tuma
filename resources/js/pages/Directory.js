export default {
    name: 'Directory',
    data() {
        return {
            users: [], meta: null, loading: true,
            search: '', typeFilter: ''
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            const params = { page }
            if (this.search)     params.search = this.search
            if (this.typeFilter) params.account_type = this.typeFilter
            try {
                const { data } = await this.$http.get('/directory', { params })
                this.users = data.data
                this.meta  = data.meta?.pagination
            } catch {}
            this.loading = false
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Member Directory</h1>
      <p class="text-gray-500">Trusted members available for regular transactions</p>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6 flex-wrap justify-center">
      <input v-model="search" @keyup.enter="load()" type="text"
        class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 w-64"
        placeholder="Search by name or business...">
      <select v-model="typeFilter" @change="load()"
        class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
        <option value="">All members</option>
        <option value="personal">Personal</option>
        <option value="business">Businesses</option>
      </select>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="users.length">
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <router-link v-for="user in users" :key="user.ulid" :to="'/directory/' + user.ulid"
          class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">

          <div class="flex items-start gap-3 mb-3">
            <user-avatar :user="{id:user.ulid,first_name:user.display_name}" size="lg"
              :src="user.profile_photo" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <p class="font-semibold text-gray-900 truncate">{{ user.display_name }}</p>
                <span v-if="user.is_verified_business"
                  class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                  <i class="fas fa-check-circle mr-0.5"></i>Verified
                </span>
              </div>
              <p v-if="user.business_name" class="text-xs text-gray-500 truncate">{{ user.business_name }}</p>
              <p v-if="user.country" class="text-xs text-gray-400 mt-0.5">
                <i class="fas fa-map-marker-alt text-green-600 mr-0.5"></i>{{ user.country }}
              </p>
            </div>
          </div>

          <!-- Bio -->
          <p v-if="user.bio" class="text-xs text-gray-500 line-clamp-2 mb-3">{{ user.bio }}</p>

          <!-- Stats row -->
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span v-if="user.rating">
              <i class="fas fa-star text-yellow-400"></i>
              {{ parseFloat(user.rating).toFixed(1) }}
            </span>
            <span><i class="fas fa-exchange-alt text-gray-400 mr-0.5"></i>{{ user.total_trades }} trades</span>
            <span class="flex items-center gap-0.5">
              <svg class="w-3 h-3" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="4"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16a34a" stroke-width="4"
                  :stroke-dasharray="user.trust_score + ' 100'" stroke-linecap="round"
                  transform="rotate(-90 18 18)"/>
              </svg>
              {{ user.trust_score }}
            </span>
          </div>

          <!-- Amount range -->
          <div class="flex items-center justify-between text-xs border-t border-gray-50 pt-2.5 mt-auto">
            <span class="text-gray-500">Min/Max</span>
            <span class="font-medium text-gray-700">
              {{ $fmt.aud(user.min_amount_aud) }} – {{ $fmt.aud(user.max_amount_aud) }}
            </span>
          </div>

          <!-- Badges -->
          <div v-if="user.badges && user.badges.length" class="flex gap-1 mt-2">
            <span v-for="b in user.badges.slice(0,4)" :key="b.badge_key"
              class="text-base" :title="b.badge_key">{{ b.badge_icon }}</span>
          </div>
        </router-link>
      </div>

      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-users" title="No members found"
      subtitle="Try adjusting your search filters." />
  </div>
  <app-footer />
</div>`
}
