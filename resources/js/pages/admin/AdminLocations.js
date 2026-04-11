export default {
    name: 'AdminLocations',
    data() {
        return {
            locations: [], loading: true,
            showForm: false, editId: null,
            form: { name: '', province: '', country_id: 2, is_active: true },
            saving: false, error: null, search: '',
        }
    },
    computed: {
        filtered() {
            if (!this.search) return this.locations
            const q = this.search.toLowerCase()
            return this.locations.filter(l => l.name.toLowerCase().includes(q) || l.province.toLowerCase().includes(q))
        },
        grouped() {
            const map = {}
            this.filtered.forEach(l => {
                if (!map[l.province]) map[l.province] = []
                map[l.province].push(l)
            })
            return map
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/admin/locations')
                this.locations = data.data || []
            } catch {}
            this.loading = false
        },
        openAdd() {
            this.editId = null; this.error = null
            this.form = { name: '', province: '', country_id: 2, is_active: true }
            this.showForm = true
        },
        openEdit(loc) {
            this.editId = loc.id; this.error = null
            this.form = { name: loc.name, province: loc.province, country_id: loc.country_id || 2, is_active: loc.is_active }
            this.showForm = true
        },
        async save() {
            if (!this.form.name || !this.form.province) { this.error = 'Name and province are required.'; return }
            this.saving = true; this.error = null
            try {
                if (this.editId) {
                    await this.$http.put('/admin/locations/' + this.editId, this.form)
                    this.$toast.success('Location updated.')
                } else {
                    await this.$http.post('/admin/locations', this.form)
                    this.$toast.success('Location added.')
                }
                this.showForm = false; await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed.' }
            this.saving = false
        },
        async toggle(loc) {
            try {
                await this.$http.put('/admin/locations/' + loc.id + '/toggle-active')
                await this.load()
            } catch {}
        },
        async remove(id) {
            if (!confirm('Delete this location? This cannot be undone.')) return
            try { await this.$http.delete('/admin/locations/' + id); await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        }
    },
    template: `
<div class="min-h-screen bg-gray-100">
  <admin-nav />
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Zimbabwe Delivery Locations</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ locations.length }} cities configured</p>
      </div>
      <button @click="openAdd()"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Add city
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <h3 class="text-base font-bold text-gray-900 mb-4">{{ editId ? 'Edit location' : 'Add new city' }}</h3>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">City name <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" placeholder="e.g. Harare"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Province <span class="text-red-500">*</span></label>
          <input v-model="form.province" type="text" placeholder="e.g. Harare Province"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
        <input type="checkbox" v-model="form.is_active" class="w-4 h-4 text-green-600 rounded accent-green-600">
        Active (visible to users)
      </label>
      <div class="flex gap-2">
        <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          {{ editId ? 'Save changes' : 'Add city' }}
        </button>
        <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <input v-model="search" type="text"
        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
        placeholder="Search cities or provinces...">
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-4">
      <div v-for="(locs, province) in grouped" :key="province"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p class="text-sm font-bold text-gray-700">{{ province }}</p>
          <p class="text-xs text-gray-400">{{ locs.length }} {{ locs.length === 1 ? 'city' : 'cities' }}</p>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="loc in locs" :key="loc.id" class="flex items-center justify-between px-5 py-3.5 gap-3">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full flex-shrink-0" :class="loc.is_active ? 'bg-green-500' : 'bg-gray-300'"></div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ loc.name }}</p>
                <p class="text-xs text-gray-400">{{ loc.slug }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', loc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                {{ loc.is_active ? 'Active' : 'Inactive' }}
              </span>
              <button @click="toggle(loc)" :class="['relative inline-flex w-9 h-5 rounded-full transition-colors flex-shrink-0', loc.is_active ? 'bg-green-500' : 'bg-gray-300']">
                <span :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', loc.is_active ? 'translate-x-4' : 'translate-x-0']"></span>
              </button>
              <button @click="openEdit(loc)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><i class="fas fa-edit text-xs"></i></button>
              <button @click="remove(loc.id)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><i class="fas fa-trash text-xs"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!Object.keys(grouped).length" class="text-center py-8 text-sm text-gray-400">No locations found.</div>
    </div>
  </div>
</div>`
}
