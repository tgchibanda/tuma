export default {
    name: 'AdminDisputes',
    data() {
        return { items: [], loading: true, stats: {} }
    },
    async mounted() {
        this.loading = false
    },
    template: `<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
      <span class="text-white font-bold text-xs">Tu</span>
    </div>
    <span class="font-bold text-gray-900">TuMa <span class="text-green-600 text-sm">Admin</span></span>
    <nav class="flex items-center gap-1 text-sm ml-4">
      <router-link v-for="link in [{to:'/admin/dashboard',label:'Dashboard'},{to:'/admin/users',label:'Users'},{to:'/admin/matches',label:'Matches'},{to:'/admin/deposits',label:'Deposits'},{to:'/admin/disputes',label:'Disputes'},{to:'/admin/settings',label:'Settings'}]"
        :key="link.to" :to="link.to"
        class="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition">
        { link.label }
      </router-link>
    </nav>
  </div>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <h1 class="text-xl font-bold text-gray-900 mb-6">AdminDisputes</h1>
    <loading-spinner v-if="loading" />
    <div v-else><p class="text-gray-500 text-sm">Content coming soon.</p></div>
  </div>
</div>`
}
