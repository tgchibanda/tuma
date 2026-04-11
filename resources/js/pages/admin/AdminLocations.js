export default {
    name: 'AdminLocations',
    data() { return { items: [], loading: true, stats: {} } },
    async mounted() { this.loading = false },
    template: `<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />
  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Delivery Locations</h1>
      </div>
      <loading-spinner v-if="loading" />
      <div v-else>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <i class="fas fa-tools text-3xl text-gray-300 mb-3 block"></i>
          <p class="text-gray-500">This section is being built.</p>
        </div>
      </div>
    </div>
  </div>
</div>`
}
