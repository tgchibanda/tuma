export default {
    name: 'AdminRates',
    data() { return { items:[], loading:true, error:null, stats:{} } },
    async mounted() { await this.load() },
    methods: { async load() { this.loading=false } },
    template: `<div class="min-h-screen bg-gray-100">
  <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
    <div class="flex items-center gap-3">
      <img src="/images/logo-icon.svg" alt="eZimConnect" class="h-8 w-auto">
      <span class="font-bold text-gray-900 text-sm">Admin</span>
    </div>
    <div class="flex items-center gap-4 text-sm">
      <router-link to="/admin/dashboard" class="text-gray-500 hover:text-gray-900">Dashboard</router-link>
      <router-link to="/admin/users" class="text-gray-500 hover:text-gray-900">Users</router-link>
      <router-link to="/admin/matches" class="text-gray-500 hover:text-gray-900">Matches</router-link>
      <router-link to="/admin/deposits" class="text-gray-500 hover:text-gray-900">Deposits</router-link>
      <router-link to="/admin/disputes" class="text-gray-500 hover:text-gray-900">Disputes</router-link>
      <router-link to="/admin/settings" class="text-gray-500 hover:text-gray-900">Settings</router-link>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <h1 class="text-xl font-bold text-gray-900 mb-6">AdminRates</h1>
    <loading-spinner v-if="loading" />
    <div v-else><p class="text-gray-500 text-sm">Content for AdminRates.</p></div>
  </div>
</div>`
}
