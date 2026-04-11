export default {
    name: 'AdminUsers',

    data() {
        return {
            items: [],
            stats: {},
            meta: null,

            loading: true,
            error: null,

            search: '',
            kycFilter: '',
            statusFilter: '',

            actionLoading: null
        }
    },

    async mounted() {
        await this.load()
    },

    methods: {
        async load(page = 1) {
            this.loading = true
            this.error = null

            const params = { page }

            if (this.search) params.search = this.search
            if (this.kycFilter) params.kyc_status = this.kycFilter
            if (this.statusFilter) params.account_status = this.statusFilter

            try {
                const { data } = await this.$http.get('/../../api/v1/admin/users', { params })

                this.items = data.data || []
                this.stats = data.stats || {}
                this.meta  = data.meta?.pagination || null

            } catch (e) {
                this.error = e.response?.data?.message || 'Failed to load users'
            }

            this.loading = false
        },

        async approveKyc(id) {
            this.actionLoading = id + '_kyc'
            try {
                await this.$http.put('/../../api/admin/users/' + id + '/kyc/approve')
                this.$toast.success('KYC approved.')
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed')
            }
            this.actionLoading = null
        },

        async rejectKyc(id) {
            const reason = prompt('Rejection reason (required):')
            if (!reason) return

            this.actionLoading = id + '_kyc'
            try {
                await this.$http.put('/../../api/admin/users/' + id + '/kyc/reject', { reason })
                this.$toast.success('KYC rejected.')
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed')
            }
            this.actionLoading = null
        },

        async suspend(id) {
            const reason = prompt('Suspension reason:')
            if (!reason) return

            this.actionLoading = id + '_suspend'
            try {
                await this.$http.put('/../../api/admin/users/' + id + '/suspend', { reason })
                this.$toast.success('User suspended.')
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Failed')
            }
            this.actionLoading = null
        },

        kycBadge(s) {
            return {
                pending: 'bg-gray-100 text-gray-600',
                submitted: 'bg-blue-100 text-blue-700',
                approved: 'bg-green-100 text-green-700',
                rejected: 'bg-red-100 text-red-700'
            }[s] || 'bg-gray-100 text-gray-600'
        },

        statusBadge(s) {
            return {
                active: 'bg-green-100 text-green-700',
                suspended: 'bg-orange-100 text-orange-700',
                banned: 'bg-red-100 text-red-700'
            }[s] || 'bg-gray-100 text-gray-600'
        }
    },

    template: `
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Users</h1>
        <span v-if="meta" class="text-sm text-gray-500">{{ meta.total }} total</span>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-4 gap-3">
          <div class="sm:col-span-2">
            <input v-model="search" @keyup.enter="load()"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Search by name, email, ULID...">
          </div>

          <select v-model="kycFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All KYC</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select v-model="statusFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">KYC</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trades</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trust</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              <tr v-for="user in items" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </td>

                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', kycBadge(user.kyc_status)]">
                    {{ user.kyc_status }}
                  </span>
                </td>

                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', statusBadge(user.account_status)]">
                    {{ user.account_status }}
                  </span>
                </td>

                <td class="px-4 py-3 text-center">{{ user.successful_trades }}</td>

                <td class="px-4 py-3 text-center">
                  <span :class="user.trust_score >= 70 ? 'text-green-600' : user.trust_score >= 40 ? 'text-yellow-600' : 'text-red-500'">
                    {{ user.trust_score }}
                  </span>
                </td>

                <td class="px-4 py-3 text-xs text-gray-500">
                  {{ $fmt.date(user.created_at) }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <router-link :to="'/admin/users/' + user.id"
                      class="px-2 py-1 text-xs text-green-700 border border-green-200 rounded-lg">
                      View
                    </router-link>

                    <button v-if="user.kyc_status === 'submitted'"
                      @click="approveKyc(user.id)"
                      :disabled="actionLoading === user.id + '_kyc'"
                      class="px-2 py-1 text-xs text-white bg-green-600 rounded-lg">
                      Approve
                    </button>

                    <button v-if="user.kyc_status === 'submitted'"
                      @click="rejectKyc(user.id)"
                      class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded-lg">
                      Reject
                    </button>

                    <button v-if="user.account_status === 'active'"
                      @click="suspend(user.id)"
                      class="px-2 py-1 text-xs text-orange-600 border border-orange-200 rounded-lg">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`
}