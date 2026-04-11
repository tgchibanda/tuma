export default {
    name: 'KYC',
    data() {
        return {
            status: null, loading: true, uploading: {},
            files: {}
        }
    },
    computed: {
        steps() {
            if (!this.status) return []
            const docs = this.status.documents || []
            return [
                { type: 'passport',         label: 'Passport or National ID', desc: 'Clear photo of the front of your passport or national ID card.', icon: 'fa-passport' },
                { type: 'selfie',            label: 'Selfie with ID',          desc: 'A photo of you holding your ID next to your face.', icon: 'fa-camera' },
                { type: 'proof_of_address',  label: 'Proof of Address',        desc: 'A utility bill, bank statement, or council notice less than 3 months old.', icon: 'fa-home', optional: true },
            ].map(step => {
                const doc = docs.find(d => d.document_type === step.type)
                return { ...step, doc, uploaded: !!doc, docStatus: doc?.status }
            })
        },
        kycBadgeClass() {
            const s = this.status?.kyc_status
            if (s === 'approved') return 'bg-green-100 text-green-700'
            if (s === 'submitted') return 'bg-blue-100 text-blue-700'
            if (s === 'rejected') return 'bg-red-100 text-red-700'
            return 'bg-gray-100 text-gray-600'
        },
        kycLabel() {
            const map = { pending: 'Not started', submitted: 'Under review', approved: 'Approved', rejected: 'Rejected' }
            return map[this.status?.kyc_status] || 'Pending'
        }
    },
    async mounted() { await this.load() },
    methods: {
        async load() {
            this.loading = true
            try {
                const { data } = await this.$http.get('/kyc')
                this.status = data.data
            } catch {}
            this.loading = false
        },
        onFile(type, e) {
            this.files[type] = e.target?.files?.[0] || e
        },
        async upload(type) {
            if (!this.files[type]) {
                this.$toast.error('Please select a file first.')
                return
            }
            this.$set(this.uploading, type, true)
            const fd = new FormData()
            fd.append('document_type', type)
            fd.append('file', this.files[type])
            try {
                await this.$http.post('/kyc/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.$toast.success('Document uploaded.')
                this.files[type] = null
                await this.load()
            } catch (e) {
                this.$toast.error(e.response?.data?.message || 'Upload failed.')
            }
            this.$set(this.uploading, type, false)
        },
        async deleteDoc(id) {
            if (!confirm('Delete this document?')) return
            try {
                await this.$http.delete('/kyc/documents/' + id)
                this.$toast.success('Document deleted.')
                await this.load()
            } catch { this.$toast.error('Could not delete.') }
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
    <p class="text-gray-500 text-sm mb-6">
      KYC (Know Your Customer) verification is required before you can trade on TuMa.
      Your documents are stored securely and only reviewed by our team.
    </p>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-6">

      <!-- Status banner -->
      <div :class="['rounded-2xl p-4 border flex items-center gap-3',
        status.kyc_status === 'approved' ? 'bg-green-50 border-green-200' :
        status.kyc_status === 'submitted' ? 'bg-blue-50 border-blue-200' :
        status.kyc_status === 'rejected' ? 'bg-red-50 border-red-200' :
        'bg-gray-50 border-gray-200']">
        <i :class="['fas text-xl',
          status.kyc_status === 'approved' ? 'fa-check-circle text-green-600' :
          status.kyc_status === 'submitted' ? 'fa-clock text-blue-600' :
          status.kyc_status === 'rejected' ? 'fa-times-circle text-red-600' :
          'fa-id-card text-gray-400']"></i>
        <div>
          <p class="font-semibold text-gray-900">KYC Status: <span :class="kycBadgeClass.replace('bg-','text-').replace('-100','').replace('-700','')">{{ kycLabel }}</span></p>
          <p v-if="status.kyc_status === 'submitted'" class="text-sm text-blue-600 mt-0.5">
            Under review — typically takes 1-2 business days.
          </p>
          <p v-if="status.kyc_status === 'approved'" class="text-sm text-green-600 mt-0.5">
            Your identity is verified. You can trade without limits.
          </p>
          <p v-if="status.kyc_status === 'rejected'" class="text-sm text-red-600 mt-0.5">
            Some documents were rejected. Please re-upload the affected documents.
          </p>
        </div>
      </div>

      <!-- Document steps -->
      <div v-for="step in steps" :key="step.type"
        :class="['bg-white rounded-2xl border shadow-sm overflow-hidden',
          step.docStatus === 'approved' ? 'border-green-200' :
          step.docStatus === 'rejected' ? 'border-red-200' :
          step.uploaded ? 'border-blue-200' : 'border-gray-100']">

        <div class="p-5">
          <div class="flex items-start gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              step.docStatus === 'approved' ? 'bg-green-100' :
              step.docStatus === 'rejected' ? 'bg-red-100' :
              step.uploaded ? 'bg-blue-100' : 'bg-gray-100']">
              <i :class="['fas', step.icon,
                step.docStatus === 'approved' ? 'text-green-600' :
                step.docStatus === 'rejected' ? 'text-red-600' :
                step.uploaded ? 'text-blue-600' : 'text-gray-400']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-semibold text-gray-900">{{ step.label }}</p>
                <span v-if="step.optional" class="text-xs text-gray-400">(optional)</span>
                <!-- Doc status pill -->
                <span v-if="step.docStatus" :class="['text-xs px-2 py-0.5 rounded-full font-medium',
                  step.docStatus === 'approved' ? 'bg-green-100 text-green-700' :
                  step.docStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700']">
                  {{ step.docStatus }}
                </span>
              </div>
              <p class="text-xs text-gray-500">{{ step.desc }}</p>

              <!-- Rejection reason -->
              <div v-if="step.doc?.rejection_reason" class="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <i class="fas fa-exclamation-circle mr-1"></i>{{ step.doc.rejection_reason }}
              </div>
            </div>
          </div>

          <!-- Upload area (show if not approved) -->
          <div v-if="step.docStatus !== 'approved' && status.can_submit" class="mt-4">
            <file-upload
              :label="step.uploaded ? 'Replace document' : 'Upload document'"
              accept="image/*,.pdf"
              hint="JPG, PNG or PDF, max 10MB"
              @change="onFile(step.type, $event)" />

            <div v-if="files[step.type]" class="mt-2 flex gap-2">
              <button @click="upload(step.type)" :disabled="uploading[step.type]"
                class="flex-1 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
                <i v-if="uploading[step.type]" class="fas fa-spinner fa-spin mr-1"></i>
                Upload
              </button>
              <button @click="files[step.type] = null"
                class="px-4 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>

          <!-- Delete pending doc -->
          <div v-if="step.doc && step.docStatus === 'pending' && status.can_submit" class="mt-2">
            <button @click="deleteDoc(step.doc.id)"
              class="text-xs text-red-500 hover:underline">
              <i class="fas fa-trash mr-1"></i> Remove and re-upload
            </button>
          </div>
        </div>
      </div>

      <!-- All submitted message -->
      <div v-if="status.all_submitted && status.kyc_status === 'pending'"
        class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
        <i class="fas fa-paper-plane text-blue-600 text-2xl mb-2 block"></i>
        <p class="font-semibold text-blue-900">All documents uploaded!</p>
        <p class="text-sm text-blue-700 mt-1">Our team will review your documents and you'll be notified by email.</p>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
