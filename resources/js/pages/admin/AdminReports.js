export default {
    name: 'AdminReports',
    data() {
        return {
            reports: [], meta: null, loading: true,
            filters: { status: '' },
            resolving: null,
            resolveForm: { action: 'dismiss', admin_note: '' },
            resolveLoading: false,
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page, per_page: 20 }
                if (this.filters.status) params.status = this.filters.status
                const { data } = await this.$http.get('/admin/reports', { params })
                this.reports = data.data || []
                this.meta    = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        openResolve(r) {
            this.resolving    = r
            this.resolveForm  = { action: 'dismiss', admin_note: '' }
        },
        async resolve() {
            this.resolveLoading = true
            try {
                await this.$http.put('/admin/reports/' + this.resolving.id + '/resolve', this.resolveForm)
                this.$toast.success('Report resolved.')
                this.resolving = null
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
            this.resolveLoading = false
        },
        statusBadge(s) {
            const m = { open:'bg-red-100 text-red-700', resolved:'bg-green-100 text-green-700', dismissed:'bg-gray-100 text-gray-500' }
            return m[s] || 'bg-gray-100 text-gray-600'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />

  <!-- Resolve modal -->
  <div v-if="resolving" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Resolve report</h3>
      <div class="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
        <p class="font-semibold text-gray-800 mb-1">Reported user: {{ resolving.reported_user?.first_name }} {{ resolving.reported_user?.last_name }}</p>
        <p class="text-gray-600">Reason: {{ resolving.reason }}</p>
        <p v-if="resolving.description" class="text-gray-500 text-xs mt-1">{{ resolving.description }}</p>
      </div>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Action</label>
          <select v-model="resolveForm.action" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="dismiss">Dismiss (no action)</option>
            <option value="warn">Warn reported user</option>
            <option value="suspend">Suspend reported user</option>
            <option value="ban">Ban reported user</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Admin note</label>
          <textarea v-model="resolveForm.admin_note" rows="2"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Internal note about this resolution..."></textarea>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="resolve" :disabled="resolveLoading"
            class="flex-1 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="resolveLoading" class="fas fa-spinner fa-spin mr-1.5"></i>
            Resolve report
          </button>
          <button @click="resolving=null" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Reports</h1>
        <p class="text-sm text-gray-500 mt-0.5">Reports submitted by members about other members.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="flex gap-3">
        <select v-model="filters.status" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <button @click="filters.status=''; load()" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="reports.length" class="space-y-3">
      <div v-for="r in reports" :key="r.id" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusBadge(r.status)]">
                {{ r.status }}
              </span>
              <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">
                {{ r.reason?.replace(/_/g,' ') }}
              </span>
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Reported by</p>
                <p class="font-semibold text-gray-800">
                  {{ r.reporter?.first_name }} {{ r.reporter?.last_name }}
                  <span class="text-gray-500 font-normal text-xs"> · {{ r.reporter?.email }}</span>
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Reported user</p>
                <p class="font-semibold text-gray-800">
                  {{ r.reported_user?.first_name }} {{ r.reported_user?.last_name }}
                  <span class="text-gray-500 font-normal text-xs"> · {{ r.reported_user?.email }}</span>
                </p>
              </div>
            </div>
            <p v-if="r.description" class="text-sm text-gray-600 italic">{{ r.description }}</p>
            <p v-if="r.admin_note" class="text-xs text-blue-600 mt-1">
              <i class="fas fa-shield-alt mr-1"></i>Admin note: {{ r.admin_note }}
            </p>
          </div>
          <div class="flex flex-col gap-2 flex-shrink-0">
            <button v-if="r.status === 'open'" @click="openResolve(r)"
              class="px-3 py-1.5 text-xs font-bold text-white bg-green-700 rounded-xl hover:bg-green-800">
              Resolve
            </button>
            <router-link :to="'/admin/users/' + r.reported_user?.id"
              class="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-center">
              View user
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
      <i class="fas fa-flag text-4xl text-gray-300 mb-3 block"></i>
      <p class="font-semibold text-gray-600 mb-1">No reports</p>
      <p class="text-sm text-gray-400">No user reports have been submitted yet.</p>
    </div>

    <div class="mt-5" v-if="meta">
      <pagination-links :meta="meta" @page="load($event)" />
    </div>
  </div>
</div>`
}
