export default {
    name: 'AdminDeposits',
    data() { return { items:[], loading:true, error:null, stats:{} } },
    async mounted() { await this.load() },
    methods: { async load() { this.loading=false } },
    template: `<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />
  <div class="flex-1 min-w-0 lg:ml-60">
  
  <div class="max-w-7xl mx-auto px-6 py-6">
    <h1 class="text-xl font-bold text-gray-900 mb-6">AdminDeposits</h1>
    <loading-spinner v-if="loading" />
    <div v-else><p class="text-gray-500 text-sm">Content for AdminDeposits.</p></div>
  </div>
  </div>
</div>`
}
