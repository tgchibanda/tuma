export default {
    name: 'Contacts',
    data() { return { contacts: [], loading: true, search: '', searching: false, results: [], query: '' } },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/contacts'); this.contacts = data.data || [] } catch {}
            this.loading = false
        },
        async searchUsers() {
            if (!this.query.trim()) return
            this.searching = true
            try { const { data } = await this.$http.get('/directory', { params: { search: this.query, per_page: 5 } }); this.results = data.data || [] } catch {}
            this.searching = false
        },
        async add(ulid) {
            try { await this.$http.post('/contacts', { trusted_user_ulid: ulid }); this.$toast.success('Added to trusted contacts.'); this.results = []; this.query = ''; await this.load() } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        },
        async remove(id) {
            if (!confirm('Remove this contact?')) return
            try { await this.$http.delete('/contacts/' + id); await this.load() } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Trusted Contacts</h1>
    <p class="text-sm text-gray-500 mb-6">Members you trust. Their orders appear highlighted when you browse.</p>
    <!-- Search to add -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-3">Add a trusted contact</h2>
      <div class="flex gap-2">
        <input v-model="query" @keyup.enter="searchUsers" type="text"
          class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search by name...">
        <button @click="searchUsers" :disabled="searching" class="px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
          <i v-if="searching" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-search"></i>
        </button>
      </div>
      <div v-if="results.length" class="mt-3 space-y-2">
        <div v-for="r in results" :key="r.ulid" class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ r.display_name }}</p>
            <p class="text-xs text-gray-500">{{ r.total_trades }} trades &middot; {{ r.rating ? parseFloat(r.rating).toFixed(1) + ' rating' : 'No ratings yet' }}</p>
          </div>
          <button @click="add(r.ulid)" class="text-xs text-green-700 font-semibold hover:underline">Add</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="contacts.length" class="space-y-3">
      <div v-for="c in contacts" :key="c.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <user-avatar :user="c.trusted_user" size="md" />
          <div>
            <p class="font-semibold text-gray-900 text-sm">{{ c.trusted_user?.display_name || 'Unknown' }}</p>
            <p class="text-xs text-gray-500">Added {{ $fmt.date(c.added_at) }}</p>
            <p v-if="c.note" class="text-xs text-gray-400 italic mt-0.5">{{ c.note }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <router-link :to="'/users/' + (c.trusted_user?.ulid || '')"
            class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">View</router-link>
          <button @click="remove(c.id)" class="px-2.5 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Remove</button>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-user-friends" title="No trusted contacts"
      subtitle="Add members you have traded with before. Their orders will be highlighted when you browse." />
  </div>
  <app-footer />
</div>`
}
