export default {
    name: 'AdminSettings',

    data() {
        return {
            settings: {},
            edited: {},
            loading: true,
            saving: false
        }
    },

    async mounted() { await this.load() },

    methods: {
        async load() {
            this.loading = true

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/settings')
                this.settings = data.data || {}
            } catch {}

            this.loading = false
        },

        edit(key, val) {
            this.$set(this.edited, key, val)
        },

        async save() {
            if (!Object.keys(this.edited).length) return

            this.saving = true

            try {
                await this.$http.put('/../../api/v1/admin/settings', this.edited)
                this.$toast.success('Saved')
                this.edited = {}
                await this.load()
            } catch (e) {
                this.$toast.error('Failed')
            }

            this.saving = false
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-4xl mx-auto px-6 py-6">

      <div class="flex justify-between mb-5">
        <h1 class="text-xl font-bold">Settings</h1>

        <button v-if="Object.keys(edited).length"
          @click="save"
          class="px-4 py-2 bg-green-700 text-white rounded">
          Save
        </button>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else class="space-y-3">
        <div v-for="(s, key) in settings" :key="key"
          class="bg-white border rounded-xl p-4 flex justify-between items-center">

          <span class="font-mono text-sm">{{ key }}</span>

          <input :value="s.value"
            @input="edit(key, $event.target.value)"
            class="border px-3 py-1 rounded text-sm w-40 text-right" />
        </div>
      </div>

    </div>
  </div>
</div>`
}