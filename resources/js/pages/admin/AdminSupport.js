export default {
    name: 'AdminSupport',
    data() {
        return {
            tickets: [], meta: null, loading: true,
            filters: { status: '', priority: '', search: '' },
            selected: null, messages: [],
            replyText: '', adminNotes: '',
            saving: false, view: 'list',
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load(page = 1) {
            this.loading = true
            try {
                const params = { page, per_page: 20 }
                if (this.filters.status)   params.status   = this.filters.status
                if (this.filters.priority) params.priority = this.filters.priority
                if (this.filters.search)   params.search   = this.filters.search
                const { data } = await this.$http.get('/admin/support', { params })
                this.tickets = data.data || []
                this.meta    = data.meta?.pagination
            } catch {}
            this.loading = false
        },
        async open(t) {
            this.selected = t; this.view = 'detail'; this.replyText = ''; this.adminNotes = ''
            try {
                const { data } = await this.$http.get('/admin/support/' + t.id)
                this.selected = data.data
                this.messages = data.data.messages || []
                this.adminNotes = data.data.admin_notes || ''
            } catch {}
        },
        async reply() {
            if (!this.replyText.trim()) return
            this.saving = true
            try {
                await this.$http.post('/admin/support/' + this.selected.id + '/reply', { message: this.replyText })
                this.replyText = ''
                await this.open(this.selected)
                this.$toast.success('Reply sent to user.')
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
            this.saving = false
        },
        async setStatus(status) {
            this.saving = true
            try {
                await this.$http.put('/admin/support/' + this.selected.id + '/status', { status, admin_notes: this.adminNotes })
                this.$toast.success('Status updated.')
                await this.open(this.selected)
                await this.load()
            } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
            this.saving = false
        },
        statusColor(s) {
            const m = { open:'bg-blue-100 text-blue-700', awaiting_support:'bg-yellow-100 text-yellow-700', awaiting_user:'bg-purple-100 text-purple-700', resolved:'bg-green-100 text-green-700', closed:'bg-gray-100 text-gray-500' }
            return m[s] || 'bg-gray-100 text-gray-600'
        },
        priorityColor(p) {
            const m = { low:'bg-gray-100 text-gray-500', normal:'bg-blue-100 text-blue-600', high:'bg-orange-100 text-orange-700', urgent:'bg-red-100 text-red-700' }
            return m[p] || 'bg-gray-100 text-gray-500'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!-- List view -->
    <div v-if="view === 'list'">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p class="text-sm text-gray-500 mt-0.5">Manage user support requests</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-4 gap-3">
          <input v-model="filters.search" @keyup.enter="load()" type="text"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Search user or subject...">
          <select v-model="filters.status" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="awaiting_support">Awaiting Support</option>
            <option value="awaiting_user">Awaiting User</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select v-model="filters.priority" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <div class="flex gap-2">
            <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
            <button @click="filters={status:'',priority:'',search:''}; load()" class="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Reset</button>
          </div>
        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Ref</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">User</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Priority</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="t in tickets" :key="t.id"
              @click="open(t)"
              class="hover:bg-gray-50 cursor-pointer transition-colors">
              <td class="py-3 px-4 font-mono text-xs text-gray-500">{{ t.ref }}</td>
              <td class="py-3 px-4">
                <p class="font-medium text-gray-900">{{ t.user && t.user.name }}</p>
                <p class="text-xs text-gray-400">{{ t.user && t.user.email }}</p>
              </td>
              <td class="py-3 px-4">
                <p class="font-medium text-gray-900 truncate max-w-xs">{{ t.subject }}</p>
                <p class="text-xs text-gray-400 capitalize">{{ t.category }}</p>
              </td>
              <td class="py-3 px-4">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(t.status)]">
                  {{ t.status.replace(/_/g,' ') }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', priorityColor(t.priority)]">
                  {{ t.priority }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-400 text-xs">{{ $fmt.date(t.updated_at) }}</td>
            </tr>
            <tr v-if="!tickets.length && !loading">
              <td colspan="6" class="py-10 text-center text-sm text-gray-400">No tickets found.</td>
            </tr>
          </tbody>
        </table>
        <div class="px-4 py-3 border-t border-gray-100" v-if="meta">
          <pagination-links :meta="meta" @page="load($event)" />
        </div>
      </div>
    </div>

    <!-- Detail view -->
    <div v-else-if="view === 'detail' && selected">
      <div class="flex items-center gap-3 mb-6">
        <button @click="view='list'; selected=null" class="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5">
          <i class="fas fa-arrow-left text-xs"></i> Back
        </button>
        <span class="text-gray-300">/</span>
        <span class="text-sm font-semibold text-gray-700">{{ selected.ref }}</span>
      </div>

      <div class="grid lg:grid-cols-3 gap-5">
        <!-- Messages thread -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 class="font-bold text-gray-900 mb-1">{{ selected.subject }}</h2>
            <div class="flex flex-wrap gap-2 mb-4">
              <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(selected.status)]">{{ selected.status.replace(/_/g,' ') }}</span>
              <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', priorityColor(selected.priority)]">{{ selected.priority }}</span>
              <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{{ selected.category }}</span>
              <span v-if="selected.match_ulid" class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-mono">{{ selected.match_ulid }}</span>
            </div>

            <!-- Messages -->
            <div class="space-y-3 mb-4">
              <div v-for="msg in messages" :key="msg.id"
                :class="['flex', msg.sender_role === 'support' ? 'justify-end' : 'justify-start']">
                <div :class="['max-w-sm rounded-2xl px-4 py-3 text-sm',
                  msg.sender_role === 'support'
                    ? 'bg-green-700 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm']">
                  <p class="font-semibold text-xs mb-1 opacity-70">{{ msg.sender_name }}</p>
                  <p class="leading-relaxed whitespace-pre-line">{{ msg.message }}</p>
                  <p class="text-xs mt-1.5 opacity-60">{{ $fmt.date(msg.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Reply box -->
            <div class="border-t border-gray-100 pt-4">
              <textarea v-model="replyText" rows="4"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-2"
                placeholder="Type your reply to the user..."></textarea>
              <button @click="reply" :disabled="saving || !replyText.trim()"
                class="w-full py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
                style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i> Send reply to user
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar: user info + actions -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-3">User</p>
            <p class="font-bold text-gray-900">{{ selected.user && selected.user.name }}</p>
            <p class="text-sm text-gray-500">{{ selected.user && selected.user.email }}</p>
            <router-link v-if="selected.user && selected.user.id" :to="'/admin/users/' + selected.user.id"
              class="mt-3 block text-xs text-green-700 font-semibold hover:underline">View user profile →</router-link>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-3">Update Status</p>
            <div class="space-y-2">
              <button v-for="s in ['open','awaiting_user','resolved','closed']" :key="s"
                @click="setStatus(s)" :disabled="saving"
                :class="['w-full py-2 text-xs font-semibold rounded-xl border transition-colors disabled:opacity-50',
                  selected.status === s
                    ? 'bg-green-700 text-white border-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
                {{ s.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase()) }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-2">Admin Notes (internal)</p>
            <textarea v-model="adminNotes" rows="3"
              class="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs resize-none focus:outline-none focus:border-green-500"
              placeholder="Internal notes not visible to user..."></textarea>
            <button @click="setStatus(selected.status)" :disabled="saving"
              class="mt-2 w-full py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50">
              Save notes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
