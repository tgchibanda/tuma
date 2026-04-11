export default {
    name: 'Recipients',
    data() { return { recipients: [], loading: true, showForm: false, form: { nickname: '', recipient_name: '', recipient_phone: '', delivery_location_id: '', delivery_address: '', delivery_notes: '' }, locations: [], saving: false, error: null } },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const [r, l] = await Promise.all([
                    this.$http.get('/recipients'),
                    this.$http.get('/countries/2/locations')
                ])
                this.recipients = r.data.data || []
                const raw = l.data.data || []
                this.locations = Array.isArray(raw) ? raw : (raw.flat ? raw.flat() : [])
            } catch {}
            this.loading = false
        },
        async save() {
            this.saving = true; this.error = null
            try {
                await this.$http.post('/recipients', { ...this.form, delivery_location_id: parseInt(this.form.delivery_location_id) })
                this.$toast.success('Recipient saved.')
                this.showForm = false; this.form = { nickname: '', recipient_name: '', recipient_phone: '', delivery_location_id: '', delivery_address: '', delivery_notes: '' }
                await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed.' }
            this.saving = false
        },
        async remove(id) {
            if (!confirm('Delete this recipient?')) return
            try { await this.$http.delete('/recipients/' + id); await this.load() } catch {}
        },
        async toggleFav(r) {
            try { await this.$http.put('/recipients/' + r.id, { is_favourite: !r.is_favourite }); await this.load() } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Saved Recipients</h1>
        <p class="text-sm text-gray-500 mt-0.5">Zimbabwe recipients you send to regularly</p>
      </div>
      <button @click="showForm = !showForm" class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Add recipient
      </button>
    </div>
    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">New Recipient</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="space-y-3">
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Nickname (for you)</label>
          <input v-model="form.nickname" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Mum, Brother James">
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-semibold text-gray-700 block mb-1">Full name <span class="text-red-500">*</span></label>
            <input v-model="form.recipient_name" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Chido Moyo">
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-700 block mb-1">Phone <span class="text-red-500">*</span></label>
            <input v-model="form.recipient_phone" type="tel" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="+263 77...">
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">City <span class="text-red-500">*</span></label>
          <select v-model="form.delivery_location_id" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">Select city...</option>
            <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Address / notes</label>
          <input v-model="form.delivery_address" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="Area or delivery notes">
        </div>
        <div class="flex gap-2">
          <button @click="save" :disabled="saving || !form.recipient_name || !form.recipient_phone || !form.delivery_location_id"
            class="flex-1 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i>Save recipient
          </button>
          <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="recipients.length" class="space-y-3">
      <div v-for="r in recipients" :key="r.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
              {{ r.nickname ? r.nickname[0].toUpperCase() : r.recipient_name[0].toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900">{{ r.nickname || r.recipient_name }}</p>
                <span v-if="r.is_favourite" class="text-yellow-500 text-xs"><i class="fas fa-star"></i></span>
              </div>
              <p class="text-sm text-gray-600">{{ r.recipient_name }} &middot; {{ r.recipient_phone }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <i class="fas fa-map-marker-alt text-green-600 mr-1"></i>
                {{ r.delivery_location?.name || 'Unknown city' }}
                <span v-if="r.delivery_address"> &middot; {{ r.delivery_address }}</span>
              </p>
            </div>
          </div>
          <div class="flex gap-1 flex-shrink-0">
            <button @click="toggleFav(r)" :class="['p-1.5 rounded-lg hover:bg-gray-100 transition-colors', r.is_favourite ? 'text-yellow-500' : 'text-gray-400']">
              <i class="fas fa-star text-sm"></i>
            </button>
            <button @click="remove(r.id)" class="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-address-book" title="No saved recipients"
      subtitle="Save your Zimbabwe contacts to fill orders faster next time." />
  </div>
  <app-footer />
</div>`
}
