export default {
    name: 'Profile',
    data() {
        return {
            user: null, form: {}, loading: true, saving: false,
            photoFile: null, photoUploading: false,
            error: null, success: false,
            reviews: [], reviewsLoading: false
        }
    },
    async mounted() {
        await this.load()
        await this.loadReviews()
    },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/user')
                this.user = data.data
                this.form = {
                    first_name:           this.user.first_name,
                    last_name:            this.user.last_name,
                    bio:                  this.user.bio || '',
                    gender:               this.user.gender || '',
                    account_type:         this.user.account_type,
                    business_name:        this.user.business_name || '',
                    business_description: this.user.business_description || '',
                    profile_visibility:   this.user.profile_visibility,
                    always_available:     this.user.always_available,
                    min_amount_aud:       this.user.min_amount_aud,
                    max_amount_aud:       this.user.max_amount_aud,
                }
            } catch {}
            this.loading = false
        },
        async loadReviews() {
            this.reviewsLoading = true
            try {
                const { data } = await this.$http.get('/user/reviews')
                this.reviews = data.data || []
            } catch {}
            this.reviewsLoading = false
        },
        async save() {
            this.saving  = true
            this.error   = null
            this.success = false
            try {
                await this.$http.put('/user/profile', this.form)
                this.success = true
                this.$toast.success('Profile saved.')
                await this.load()
            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to save.'
            }
            this.saving = false
        },
        async uploadPhoto() {
            if (!this.photoFile) return
            this.photoUploading = true
            const fd = new FormData()
            fd.append('photo', this.photoFile)
            try {
                const { data } = await this.$http.post('/user/profile/photo', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.user.profile_photo = data.data.profile_photo
                this.$toast.success('Profile photo updated.')
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Upload failed.')
            }
            this.photoUploading = false
        },
        onPhotoChange(e) {
            this.photoFile = e.target.files[0]
            if (this.photoFile) this.uploadPhoto()
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

    <loading-spinner v-if="loading" />
    <div v-else class="space-y-6">

      <!-- Photo + name card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-5">
          <div class="relative">
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
              <img v-if="user.profile_photo" :src="user.profile_photo"
                class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="fas fa-user text-3xl"></i>
              </div>
            </div>
            <label class="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition">
              <i class="fas fa-camera text-white text-xs"></i>
              <input type="file" accept="image/*" class="hidden" @change="onPhotoChange">
            </label>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="user.total_trades" class="text-xs text-gray-500">
                <i class="fas fa-star text-yellow-400"></i>
                {{ user.rating ? parseFloat(user.rating).toFixed(1) : 'No ratings' }}
                &middot; {{ user.total_trades }} trades
              </span>
              <span v-if="user.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                <i class="fas fa-check-circle mr-0.5"></i> Verified Business
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit form -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-4">Personal Details</h2>
        <alert-banner v-if="error" type="error" :message="error" />

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">First name</label>
            <input v-model="form.first_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Last name</label>
            <input v-model="form.last_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
          </div>
          <div class="sm:col-span-2">
            <label class="text-sm font-medium text-gray-700 block mb-1">Bio <span class="text-gray-400 font-normal">(optional)</span></label>
            <textarea v-model="form.bio" rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
              placeholder="Tell other traders a bit about yourself..."></textarea>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Gender</label>
            <select v-model="form.gender"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Account type</label>
            <select v-model="form.account_type"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div v-if="form.account_type === 'business'" class="sm:col-span-2">
            <label class="text-sm font-medium text-gray-700 block mb-1">Business name</label>
            <input v-model="form.business_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Your business name">
          </div>
        </div>
      </div>

      <!-- Directory settings -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Directory Listing</h2>
        <p class="text-sm text-gray-500 mb-4">Appear in the public directory so other users can find and contact you directly.</p>

        <div class="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p class="text-sm font-medium text-gray-800">Show in directory</p>
            <p class="text-xs text-gray-500">Other users can see your profile and contact you</p>
          </div>
          <button @click="form.always_available = !form.always_available"
            :class="['relative inline-flex w-11 h-6 rounded-full transition-colors',
              form.always_available ? 'bg-green-600' : 'bg-gray-200']">
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              form.always_available ? 'translate-x-5' : 'translate-x-0']"></span>
          </button>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p class="text-sm font-medium text-gray-800">Profile visibility</p>
            <p class="text-xs text-gray-500">Anonymous hides your real name</p>
          </div>
          <select v-model="form.profile_visibility"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-green-500">
            <option value="public">Public</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>

        <div v-if="form.always_available" class="grid sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label class="text-xs font-medium text-gray-700 block mb-1">Min order (AUD)</label>
            <input v-model="form.min_amount_aud" type="number" min="50"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-xs font-medium text-gray-700 block mb-1">Max order (AUD)</label>
            <input v-model="form.max_amount_aud" type="number" min="50"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500">
          </div>
        </div>
      </div>

      <button @click="save" :disabled="saving"
        class="w-full py-3.5 bg-green-700 text-white rounded-2xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition shadow-sm">
        <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i> Save Profile
      </button>

      <!-- Reviews -->
      <div v-if="reviews.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">
            Reviews
            <span class="text-sm text-gray-400 font-normal ml-2">
              <i class="fas fa-star text-yellow-400"></i>
              {{ user.rating ? parseFloat(user.rating).toFixed(1) : '—' }}
            </span>
          </h2>
        </div>
        <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          <div v-for="r in reviews" :key="r.id" class="px-5 py-4">
            <div class="flex items-center justify-between mb-1">
              <rating-stars :value="r.score" />
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <p v-if="r.review_text" class="text-sm text-gray-600">{{ r.review_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
