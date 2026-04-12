export default {
    name: 'PublicProfile',
    data() {
        return {
            profile: null, loading: true, error: null,
        }
    },
    computed: {
        ulid() { return this.$route.params.ulid },
        isMe() {
            try {
                const me = JSON.parse(localStorage.getItem('tuma_user') || '{}')
                return me.ulid === this.ulid
            } catch { return false }
        },
        avatarLetter() {
            return this.profile?.display_name?.[0]?.toUpperCase() || '?'
        },
        trustColor() {
            const s = this.profile?.trust_score || 0
            if (s >= 70) return 'text-green-600'
            if (s >= 40) return 'text-yellow-600'
            return 'text-gray-400'
        },
    },
    async mounted() {
        await this.load()
    },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/users/' + this.ulid)
                this.profile = data.data
            } catch (e) {
                this.error = e.response?.status === 404
                    ? 'This profile is not available.'
                    : 'Failed to load profile.'
            }
            this.loading = false
        },
        sendMoneyVia() {
            // Navigate to browse, filtered to show this user's orders
            this.$router.push('/browse?user=' + this.ulid)
        },
        fixUrl(url) {
            if (!url) return null
            // Replace any domain with the current origin so it works on any host
            try {
                const u = new URL(url)
                return window.location.origin + u.pathname
            } catch { return url }
        },
        stars(score) {
            return Array.from({ length: 5 }, (_, i) => i < Math.round(score))
        },
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />

  <div class="max-w-3xl mx-auto px-4 py-8">

    <loading-spinner v-if="loading" />

    <div v-else-if="error" class="text-center py-16">
      <i class="fas fa-user-slash text-4xl text-gray-300 mb-3 block"></i>
      <p class="text-gray-500">{{ error }}</p>
      <button @click="$router.back()" class="mt-4 text-sm text-green-700 font-semibold">← Go back</button>
    </div>

    <div v-else-if="profile" class="space-y-4">

      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Green banner -->
        <div class="h-20 w-full" style="background:linear-gradient(135deg,#0d4a28,#1a6b3c,#2d9460)"></div>

        <div class="px-6 pb-6">
          <!-- Avatar overlapping banner -->
          <div class="flex items-end justify-between -mt-10 mb-4">
            <div class="relative">
              <img v-if="fixUrl(profile.profile_photo)"
                :src="fixUrl(profile.profile_photo)"
                class="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md"
                @error="$event.target.style.display='none'">
              <div v-else
                class="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-white"
                style="background:linear-gradient(135deg,#1a6b3c,#2d9460)">
                {{ avatarLetter }}
              </div>
              <span v-if="profile.always_available"
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                title="Available now"></span>
            </div>

            <button v-if="!isMe" @click="sendMoneyVia"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
              <i class="fas fa-paper-plane text-xs"></i>
              Send money via {{ profile.display_name.split(' ')[0] }}
            </button>
          </div>

          <!-- Name + badges -->
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h1 class="text-xl font-black text-gray-900" style="font-family:Georgia,serif;">
              {{ profile.display_name }}
            </h1>
            <span v-if="profile.is_verified_business"
              class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              <i class="fas fa-check-circle mr-0.5"></i>Verified Business
            </span>
          </div>

          <p v-if="profile.business_name" class="text-sm text-gray-500 mb-1">{{ profile.business_name }}</p>

          <div class="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
            <span v-if="profile.country">
              <i class="fas fa-map-marker-alt text-green-600 mr-1"></i>{{ profile.country }}
            </span>
            <span>
              <i class="fas fa-calendar text-gray-400 mr-1"></i>Member since {{ $fmt.date(profile.member_since) }}
            </span>
          </div>

          <p v-if="profile.bio" class="text-sm text-gray-600 leading-relaxed mb-3">{{ profile.bio }}</p>

          <!-- Earned badges -->
          <div v-if="profile.badges && profile.badges.length" class="flex flex-wrap gap-2 mb-3">
            <span v-for="b in profile.badges" :key="b.badge_key"
              class="flex items-center gap-1.5 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2.5 py-1 rounded-full font-medium"
              :title="b.badge_name">
              <span>{{ b.badge_icon }}</span>
              {{ b.badge_name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3">
        <div v-for="stat in [
          { label: 'Total Trades',  value: profile.total_trades },
          { label: 'Rating',        value: profile.rating ? parseFloat(profile.rating).toFixed(1) + ' ★' : '—' },
          { label: 'Trust Score',   value: profile.trust_score, color: trustColor },
        ]" :key="stat.label"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-black mb-0.5" :class="stat.color || 'text-gray-900'">{{ stat.value }}</p>
          <p class="text-xs text-gray-500">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Trading preferences -->
      <div v-if="profile.min_amount_aud || profile.max_amount_aud"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-900 mb-3">
          <i class="fas fa-sliders-h text-green-600 mr-2"></i>Trading Preferences
        </h3>
        <div class="flex flex-wrap gap-4 text-sm">
          <div v-if="profile.min_amount_aud">
            <p class="text-xs text-gray-500 mb-0.5">Minimum</p>
            <p class="font-bold text-gray-900">{{ $fmt.aud(profile.min_amount_aud) }}</p>
          </div>
          <div v-if="profile.max_amount_aud">
            <p class="text-xs text-gray-500 mb-0.5">Maximum</p>
            <p class="font-bold text-gray-900">{{ $fmt.aud(profile.max_amount_aud) }}</p>
          </div>
          <div v-if="profile.always_available">
            <p class="text-xs text-gray-500 mb-0.5">Availability</p>
            <p class="font-bold text-green-700">
              <i class="fas fa-circle text-green-500 text-xs mr-1"></i>Always available
            </p>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-900 mb-4">
          <i class="fas fa-star text-yellow-400 mr-2"></i>
          Recent Reviews
          <span class="text-gray-400 font-normal ml-1">({{ profile.recent_reviews?.length || 0 }})</span>
        </h3>

        <div v-if="profile.recent_reviews && profile.recent_reviews.length" class="space-y-4">
          <div v-for="(rev, i) in profile.recent_reviews" :key="i"
            class="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div class="flex items-start justify-between gap-3 mb-1.5">
              <div class="flex items-center gap-2">
                <!-- Reviewer avatar -->
                <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  <img v-if="fixUrl(rev.reviewer?.avatar_url)"
                    :src="fixUrl(rev.reviewer.avatar_url)"
                    class="w-7 h-7 rounded-lg object-cover"
                    @error="$event.target.style.display='none'">
                  <span v-else>{{ (rev.reviewer?.display_name || '?')[0].toUpperCase() }}</span>
                </div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ rev.reviewer?.display_name || rev.reviewer || 'Anonymous' }}
                </p>
              </div>
              <p class="text-xs text-gray-400 flex-shrink-0">{{ $fmt.date(rev.created_at) }}</p>
            </div>
            <!-- Stars -->
            <div class="flex items-center gap-0.5 mb-1.5">
              <i v-for="s in 5" :key="s"
                :class="['fas fa-star text-xs', s <= rev.score ? 'text-yellow-400' : 'text-gray-200']"></i>
              <span class="text-xs text-gray-500 ml-1">{{ rev.score }}.0</span>
            </div>
            <p v-if="rev.comment" class="text-sm text-gray-600 leading-relaxed">{{ rev.comment }}</p>
            <p v-else class="text-sm text-gray-400 italic">No comment left.</p>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <i class="fas fa-star text-3xl text-gray-200 block mb-2"></i>
          <p class="text-sm text-gray-400">No reviews yet.</p>
        </div>
      </div>

      <!-- Send money CTA at bottom -->
      <div v-if="!isMe" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
        <p class="text-sm text-gray-600 mb-3">
          Want to swap money with <strong>{{ profile.display_name.split(' ')[0] }}</strong>?
        </p>
        <button @click="sendMoneyVia"
          class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-paper-plane text-xs"></i>
          Send money via {{ profile.display_name.split(' ')[0] }}
        </button>
        <p class="text-xs text-gray-400 mt-2">You'll be taken to their open orders</p>
      </div>

    </div>
  </div>
  <app-footer />
</div>`
}
