export default {
    name: 'Referral',
    data() {
        return { items: [], loading: true, error: null }
    },
    async mounted() {
        this.loading = false
    },
    template: `<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Referral</h1>
    <loading-spinner v-if="loading" />
    <p v-else class="text-gray-500 text-sm">This page is coming soon.</p>
  </div>
  <app-footer />
</div>`
}
