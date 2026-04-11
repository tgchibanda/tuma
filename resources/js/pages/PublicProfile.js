export default {
    name: 'PublicProfile',
    data() { return { profile: null, reviews: [], loading: true } },
    async mounted() {
        const ulid = this.$route.params.ulid
        try {
            const [p, r] = await Promise.all([
                this.$http.get('/users/' + ulid),
                this.$http.get('/users/' + ulid + '/reviews').catch(() => ({ data: { data: [] } }))
            ])
            this.profile = p.data.data
            this.reviews = r.data.data || []
        } catch { this.$router.push('/directory') }
        this.loading = false
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <loading-spinner v-if="loading" />
    <div v-else-if="profile" class="space-y-5">
      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-black text-2xl flex-shrink-0">
            {{ profile.display_name ? profile.display_name[0].toUpperCase() : 'T' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h1 class="text-xl font-black text-gray-900" style="font-family:Georgia,serif;">{{ profile.display_name }}</h1>
              <span v-if="profile.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                <i class="fas fa-check-circle mr-0.5"></i> Verified
              </span>
            </div>
            <p v-if="profile.business_name" class="text-sm text-gray-600">{{ profile.business_name }}</p>
            <p v-if="profile.country" class="text-sm text-gray-500">
              <i class="fas fa-map-marker-alt text-green-600 mr-1 text-xs"></i>{{ profile.country }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center mb-4">
          <div class="bg-gray-50 rounded-xl py-3">
            <p class="text-lg font-black text-gray-900">{{ profile.total_trades }}</p>
            <p class="text-xs text-gray-500">Trades</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-3">
            <p class="text-lg font-black text-gray-900">{{ profile.rating ? parseFloat(profile.rating).toFixed(1) : '—' }}</p>
            <p class="text-xs text-gray-500">Rating</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-3">
            <p class="text-lg font-black text-gray-900">{{ profile.trust_score }}</p>
            <p class="text-xs text-gray-500">Trust score</p>
          </div>
        </div>
        <p v-if="profile.bio" class="text-sm text-gray-600 mb-4">{{ profile.bio }}</p>
        <div v-if="profile.badges && profile.badges.length" class="flex flex-wrap gap-1.5 mb-4">
          <span v-for="b in profile.badges" :key="b.badge_key" class="text-lg" :title="b.badge_key">{{ b.badge_icon }}</span>
        </div>
        <div v-if="profile.available_locations">
          <p class="text-xs font-semibold text-gray-500 mb-2">Delivery range: {{ $fmt.aud(profile.min_amount_aud) }} – {{ $fmt.aud(profile.max_amount_aud) }}</p>
        </div>
        <router-link to="/orders/create" class="flex items-center justify-center gap-2 w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
          <i class="fas fa-handshake text-xs"></i> Send money via {{ profile.display_name.split(' ')[0] }}
        </router-link>
      </div>
      <!-- Reviews -->
      <div v-if="reviews.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">Reviews</h2>
        </div>
        <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          <div v-for="r in reviews" :key="r.id" class="px-5 py-4">
            <div class="flex items-center justify-between mb-1">
              <rating-stars :value="r.score" />
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <p v-if="r.comment" class="text-sm text-gray-600 italic">{{ r.comment }}</p>
            <p class="text-xs text-gray-400 mt-1">— {{ r.reviewer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
