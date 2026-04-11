export default {
    name: 'Templates',
    data() { return { templates: [], loading: true } },
    async mounted() {
        try { const { data } = await this.$http.get('/templates'); this.templates = data.data || [] } catch {}
        this.loading = false
    },
    methods: {
        async useTemplate(id) {
            try { const { data } = await this.$http.post('/templates/' + id + '/use'); this.$toast.success('Order created from template!'); this.$router.push('/orders/' + data.data.ulid) } catch (e) { this.$toast.error(e.response?.data?.message || 'Failed.') }
        },
        async remove(id) {
            if (!confirm('Delete this template?')) return
            try { await this.$http.delete('/templates/' + id); this.templates = this.templates.filter(t => t.id !== id) } catch {}
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order Templates</h1>
        <p class="text-sm text-gray-500 mt-0.5">Saved order configurations for one-tap reuse</p>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="templates.length" class="space-y-3">
      <div v-for="t in templates" :key="t.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-bold text-gray-900">{{ t.name }}</p>
            <p class="text-sm text-gray-600 mt-0.5">{{ $fmt.aud(t.amount_aud) }} &middot; {{ t.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}</p>
            <p v-if="t.saved_recipient" class="text-xs text-gray-400 mt-0.5">Recipient: {{ t.saved_recipient.nickname }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Used {{ t.use_count }} times<span v-if="t.last_used_at"> &middot; Last: {{ $fmt.date(t.last_used_at) }}</span></p>
          </div>
          <div class="flex gap-2">
            <button @click="useTemplate(t.id)"
              class="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors">
              Use now
            </button>
            <button @click="remove(t.id)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-layer-group text-gray-400 text-2xl"></i>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">No templates yet</h3>
      <p class="text-sm text-gray-500 mb-5">Templates are created automatically when you check "Save as template" during order creation.</p>
      <router-link to="/orders/create" class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Create your first order
      </router-link>
    </div>
  </div>
  <app-footer />
</div>`
}
