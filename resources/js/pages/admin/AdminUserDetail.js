export default {
    name: 'AdminUserDetail',

    data() {
        return {
            user: null,
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
    <div class="max-w-5xl mx-auto px-6 py-6">

      <h1 class="text-xl font-bold text-gray-900 mb-6">User Detail</h1>

      <loading-spinner v-if="loading" />

      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <i class="fas fa-user text-3xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500">User detail view coming soon.</p>
      </div>

    </div>
  </div>
</div>`
}