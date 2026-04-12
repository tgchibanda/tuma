export default {
    name: 'AdminNoticeboard',
    data() {
        return {
            posts: [], loading: true,
            showForm: false, editId: null,
            form: { title: '', body: '', type: 'info', is_pinned: false, audience: 'all' },
            saving: false, error: null,
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try { const { data } = await this.$http.get('/admin/noticeboard'); this.posts = data.data || [] } catch {}
            this.loading = false
        },
        openAdd() {
            this.editId = null; this.error = null
            this.form = { title: '', body: '', type: 'info', is_pinned: false, audience: 'all' }
            this.showForm = true
        },
        openEdit(p) {
            this.editId = p.id; this.error = null
            this.form = { title: p.title, body: p.body, type: p.type, is_pinned: !!p.is_pinned, audience: p.audience || 'all' }
            this.showForm = true
        },
        async save() {
            if (!this.form.title || !this.form.body) { this.error = 'Title and body are required.'; return }
            this.saving = true; this.error = null
            try {
                if (this.editId) {
                    await this.$http.put('/admin/noticeboard/' + this.editId, this.form)
                    this.$toast.success('Post updated.')
                } else {
                    await this.$http.post('/admin/noticeboard', this.form)
                    this.$toast.success('Post created.')
                }
                this.showForm = false; await this.load()
            } catch (e) { this.error = e.response?.data?.message || 'Failed.' }
            this.saving = false
        },
        async publish(id) {
            try { await this.$http.put('/admin/noticeboard/' + id + '/publish'); await this.load() } catch {}
        },
        async togglePin(id) {
            try { await this.$http.put('/admin/noticeboard/' + id + '/pin'); await this.load() } catch {}
        },
        async remove(id) {
            if (!confirm('Delete this notice?')) return
            try { await this.$http.delete('/admin/noticeboard/' + id); await this.load() } catch {}
        },
        typeBadge(t) {
            const m = { info:'bg-blue-100 text-blue-700', warning:'bg-yellow-100 text-yellow-700', success:'bg-green-100 text-green-700', alert:'bg-red-100 text-red-700' }
            return m[t] || 'bg-gray-100 text-gray-600'
        },
        typeIcon(t) {
            const m = { info:'fa-info-circle text-blue-500', warning:'fa-exclamation-triangle text-yellow-500', success:'fa-check-circle text-green-500', alert:'fa-exclamation-circle text-red-500' }
            return m[t] || 'fa-circle text-gray-400'
        }
    },
    template: `
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Noticeboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">System announcements visible to all users.</p>
      </div>
      <button @click="openAdd()"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> New notice
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-gray-900">{{ editId ? 'Edit notice' : 'Create new notice' }}</h3>
        <button @click="showForm=false" class="p-1.5 text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" placeholder="e.g. Scheduled maintenance this weekend"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Body <span class="text-red-500">*</span></label>
          <textarea v-model="form.body" rows="4" placeholder="Full notice content..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"></textarea>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Type</label>
            <select v-model="form.type" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="alert">Alert</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Audience</label>
            <select v-model="form.audience" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="all">All users</option>
              <option value="senders">Senders only</option>
              <option value="receivers">Receivers only</option>
            </select>
          </div>
          <div class="flex items-end pb-0.5">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="form.is_pinned" class="w-4 h-4 rounded accent-green-600">
              Pin to top
            </label>
          </div>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="save" :disabled="saving"
            class="px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
            {{ editId ? 'Save changes' : 'Create notice' }}
          </button>
          <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="posts.length" class="space-y-3">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 flex-1">
            <i :class="['fas text-lg flex-shrink-0 mt-0.5', typeIcon(post.type)]"></i>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <p class="font-bold text-gray-900">{{ post.title }}</p>
                <span v-if="post.is_pinned" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  <i class="fas fa-thumbtack mr-0.5"></i>Pinned
                </span>
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold capitalize', typeBadge(post.type)]">
                  {{ post.type }}
                </span>
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                  {{ post.is_published ? 'Published' : 'Draft' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ post.body }}</p>
              <p class="text-xs text-gray-400">
                Audience: {{ post.audience || 'All' }}
                · Created {{ $fmt.date(post.created_at) }}
                <span v-if="post.published_at"> · Published {{ $fmt.date(post.published_at) }}</span>
              </p>
            </div>
          </div>
          <div class="flex gap-1.5 flex-shrink-0">
            <button v-if="!post.is_published" @click="publish(post.id)"
              class="px-2.5 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700">
              Publish
            </button>
            <button @click="togglePin(post.id)"
              :class="['px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors',
                post.is_pinned ? 'border-yellow-300 text-yellow-700 bg-yellow-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
              <i class="fas fa-thumbtack"></i>
            </button>
            <button @click="openEdit(post)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-xl">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button @click="remove(post.id)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-xl">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
      <i class="fas fa-bullhorn text-4xl text-gray-300 mb-3 block"></i>
      <p class="font-semibold text-gray-600 mb-1">No notices yet</p>
      <p class="text-sm text-gray-400 mb-4">Create a notice to inform users about platform updates, maintenance, or important information.</p>
      <button @click="openAdd()" class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus"></i> Create first notice
      </button>
    </div>
  </div>
</div>`
}
