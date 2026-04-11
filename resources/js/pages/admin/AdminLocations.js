export default {
    name: 'AdminLocations',

    data() {
        return {
            items: [],
            loading: true,
            error: null
        }
    },

    async mounted() {
        this.loading = false
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <h1 class="text-xl font-bold text-gray-900 mb-6">Delivery Locations</h1>

      <loading-spinner v-if="loading" />

      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <i class="fas fa-map-marker-alt text-3xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500">Locations management coming soon.</p>
      </div>

    </div>
  </div>
</div>`
}