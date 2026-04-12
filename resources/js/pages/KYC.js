export default {
    name: 'KYC',
    data() {
        return {
            status: null, loading: true,
            uploads: {},      // { [type]: File }
            uploading: {},    // { [type]: boolean }
            errors: {},       // { [type]: string }
        }
    },
    computed: {
        steps() {
            if (!this.status) return []
            const docs = this.status.documents || []
            return [
                {
                    type: 'passport',
                    label: 'Government-issued ID',
                    desc: 'Passport, national ID card, or driver\'s licence. Must be valid and clearly readable.',
                    icon: 'fa-passport',
                    required: true,
                    idTypes: ['Passport', 'National ID', 'Driver\'s Licence']
                },
                {
                    type: 'selfie',
                    label: 'Selfie holding your ID',
                    desc: 'A clear photo of your face while holding your ID document. Both your face and ID must be visible.',
                    icon: 'fa-camera',
                    required: true,
                    idTypes: null
                },
                {
                    type: 'proof_of_address',
                    label: 'Proof of Address',
                    desc: 'Bank statement, utility bill, or council notice less than 3 months old showing your name and address.',
                    icon: 'fa-home',
                    required: false,
                    idTypes: null
                },
            ].map(step => {
                const doc = docs.find(d => d.document_type === step.type)
                return { ...step, doc, uploaded: !!doc, docStatus: doc?.status, rejectionReason: doc?.rejection_reason }
            })
        },
        allRequiredUploaded() {
            return this.steps
                .filter(s => s.required)
                .every(s => s.uploaded && s.docStatus !== 'rejected')
        },
        progressPercent() {
            if (!this.steps.length) return 0
            const done = this.steps.filter(s => s.docStatus === 'approved').length
            return Math.round((done / this.steps.length) * 100)
        },
        statusConfig() {
            const s = this.status?.kyc_status
            if (s === 'approved')  return { icon: 'fa-check-circle', color: 'green',  label: 'Approved', desc: 'Your identity is verified. You can trade without restrictions.' }
            if (s === 'submitted') return { icon: 'fa-clock',        color: 'blue',   label: 'Under Review', desc: 'Our team is reviewing your documents. This usually takes 1–2 business days.' }
            if (s === 'rejected')  return { icon: 'fa-times-circle', color: 'red',    label: 'Action Required', desc: 'Some documents were rejected. Please re-upload the affected documents.' }
            return                        { icon: 'fa-id-card',      color: 'yellow', label: 'Not Started', desc: 'Upload your documents below to verify your identity.' }
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

        onFileSelect(type, event) {
            const file = event.target?.files?.[0] || event
            if (!file) return
            // Validate file
            const maxMb = 10
            if (file.size > maxMb * 1024 * 1024) {
                this.$set(this.errors, type, 'File too large. Maximum size is ' + maxMb + 'MB.')
                return
            }
            const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
            if (!allowed.includes(file.type)) {
                this.$set(this.errors, type, 'Invalid file type. Please upload a JPG, PNG, or PDF.')
                return
            }
            this.$set(this.errors, type, null)
            this.$set(this.uploads, type, file)
        },

        async upload(type) {
            const file = this.uploads[type]
            if (!file) { this.$set(this.errors, type, 'Please select a file first.'); return }

            this.$set(this.uploading, type, true)
            this.$set(this.errors, type, null)

            const fd = new FormData()
            fd.append('document_type', type)
            fd.append('file', file)

            try {
                await this.$http.post('/kyc/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.$set(this.uploads, type, null)
                this.$toast.success('Document uploaded successfully!')
                await this.load()
            } catch (e) {
                const msg = e.response?.data?.message || e.response?.data?.errors?.file?.[0] || 'Upload failed. Please try again.'
                this.$set(this.errors, type, msg)
            }

            this.$set(this.uploading, type, false)
        },

        async deleteDoc(id, type) {
            if (!confirm('Remove this document? You will need to upload it again.')) return
            try {
                await this.$http.delete('/kyc/documents/' + id)
                this.$set(this.uploads, type, null)
                this.$toast.success('Document removed.')
                await this.load()
            } catch { this.$toast.error('Could not remove document.') }
        },

        getFilePreview(type) {
            const file = this.uploads[type]
            if (!file) return null
            return file.type?.startsWith('image/') ? URL.createObjectURL(file) : null
        },

        docViewUrl(docId) {
            return '/api/v1/files/kyc/' + docId
        }
    },
    template: `
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Identity Verification</h1>
      <p class="text-gray-500 text-sm">
        Verify your identity to build trust with other traders.
        Your documents are stored securely and only reviewed by the eZimConnect team.
      </p>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-5">

      <!-- Status banner -->
      <div :class="['rounded-2xl p-5 border-2 flex items-start gap-4',
        statusConfig.color === 'green'  ? 'bg-green-50  border-green-200' :
        statusConfig.color === 'blue'   ? 'bg-blue-50   border-blue-200' :
        statusConfig.color === 'red'    ? 'bg-red-50    border-red-200' :
        'bg-yellow-50 border-yellow-200']">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
          statusConfig.color === 'green'  ? 'bg-green-100' :
          statusConfig.color === 'blue'   ? 'bg-blue-100' :
          statusConfig.color === 'red'    ? 'bg-red-100' :
          'bg-yellow-100']">
          <i :class="['fas text-xl',
            statusConfig.icon,
            statusConfig.color === 'green'  ? 'text-green-600' :
            statusConfig.color === 'blue'   ? 'text-blue-600' :
            statusConfig.color === 'red'    ? 'text-red-600' :
            'text-yellow-600']"></i>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">{{ statusConfig.label }}</p>
          <p class="text-sm text-gray-600 mt-0.5">{{ statusConfig.desc }}</p>
          <div v-if="status?.kyc_status === 'submitted'" class="mt-3 flex items-center gap-2">
            <div class="flex-1 bg-blue-200 rounded-full h-1.5">
              <div class="bg-blue-600 h-1.5 rounded-full" style="width: 60%"></div>
            </div>
            <span class="text-xs text-blue-600 font-medium">In review</span>
          </div>
        </div>
      </div>

      <!-- What you need -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">What you need to upload</h2>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="step in steps" :key="step.type"
            :class="['flex flex-col items-center text-center p-3 rounded-xl transition',
              step.docStatus === 'approved' ? 'bg-green-50' : step.uploaded ? 'bg-blue-50' : 'bg-gray-50']">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center mb-1.5',
              step.docStatus === 'approved' ? 'bg-green-100' : step.uploaded ? 'bg-blue-100' : 'bg-gray-100']">
              <i :class="['fas text-sm',
                step.docStatus === 'approved' ? 'fa-check text-green-600' :
                step.uploaded ? 'fa-clock text-blue-600' :
                step.icon + ' text-gray-400']"></i>
            </div>
            <p class="text-xs font-medium text-gray-700 leading-tight">{{ step.label }}</p>
            <span :class="['text-xs mt-1 font-medium',
              step.required ? 'text-red-500' : 'text-gray-400']">
              {{ step.required ? 'Required' : 'Optional' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Document upload cards -->
      <div v-for="step in steps" :key="step.type"
        :class="['bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition',
          step.docStatus === 'approved' ? 'border-green-200' :
          step.docStatus === 'rejected' ? 'border-red-200' :
          step.uploaded ? 'border-blue-200' :
          'border-gray-100']">

        <!-- Card header -->
        <div :class="['px-5 py-4 border-b flex items-center justify-between',
          step.docStatus === 'approved' ? 'border-green-100 bg-green-50' :
          step.docStatus === 'rejected' ? 'border-red-100 bg-red-50' :
          step.uploaded ? 'border-blue-100 bg-blue-50' :
          'border-gray-100 bg-gray-50']">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center',
              step.docStatus === 'approved' ? 'bg-green-100' :
              step.docStatus === 'rejected' ? 'bg-red-100' :
              step.uploaded ? 'bg-blue-100' : 'bg-gray-200']">
              <i :class="['fas', step.icon,
                step.docStatus === 'approved' ? 'text-green-600' :
                step.docStatus === 'rejected' ? 'text-red-600' :
                step.uploaded ? 'text-blue-600' : 'text-gray-500']"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-gray-900">{{ step.label }}</p>
                <span v-if="step.required" class="text-xs text-red-500 font-medium">Required</span>
                <span v-else class="text-xs text-gray-400">Optional</span>
              </div>
            </div>
          </div>
          <!-- Status pill -->
          <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full',
            step.docStatus === 'approved' ? 'bg-green-100 text-green-700' :
            step.docStatus === 'rejected' ? 'bg-red-100 text-red-700' :
            step.docStatus === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-500']">
            {{ step.docStatus === 'approved' ? '✓ Approved' : step.docStatus === 'rejected' ? '✗ Rejected' : step.docStatus === 'pending' ? '⏳ Under review' : 'Not uploaded' }}
          </span>
        </div>

        <!-- Card body -->
        <div class="p-5">
          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ step.desc }}</p>

          <!-- Rejection reason -->
          <div v-if="step.rejectionReason" class="mb-4 flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
            <i class="fas fa-exclamation-circle text-red-500 mt-0.5 flex-shrink-0"></i>
            <div>
              <p class="text-sm font-medium text-red-800">Rejection reason:</p>
              <p class="text-sm text-red-700 mt-0.5">{{ step.rejectionReason }}</p>
            </div>
          </div>

          <!-- Approved: show view link -->
          <div v-if="step.docStatus === 'approved'" class="flex items-center gap-2 text-sm text-green-700">
            <i class="fas fa-check-circle"></i>
            <span class="font-medium">Document approved</span>
            <a v-if="step.doc" :href="docViewUrl(step.doc.id)" target="_blank"
              class="ml-auto text-xs text-green-700 hover:underline flex items-center gap-1">
              <i class="fas fa-eye text-xs"></i> View
            </a>
          </div>

          <!-- Under review: show note with delete option -->
          <div v-else-if="step.docStatus === 'pending'" class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-blue-700">
              <i class="fas fa-clock"></i>
              <span>Submitted — under review</span>
            </div>
            <button @click="deleteDoc(step.doc.id, step.type)"
              class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition">
              <i class="fas fa-trash-alt text-xs"></i> Remove
            </button>
          </div>

          <!-- Can upload -->
          <div v-else-if="status?.can_submit">

            <!-- File preview -->
            <div v-if="uploads[step.type]" class="mb-3">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <img v-if="getFilePreview(step.type)" :src="getFilePreview(step.type)"
                  class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
                <div v-else class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-file-pdf text-red-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ uploads[step.type].name }}</p>
                  <p class="text-xs text-gray-500">{{ (uploads[step.type].size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
                <button @click="$set(uploads, step.type, null)" class="text-gray-400 hover:text-red-500 p-1">
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="errors[step.type]" class="mb-3 text-xs text-red-600 flex items-center gap-1.5">
              <i class="fas fa-exclamation-circle"></i>{{ errors[step.type] }}
            </div>

            <!-- Upload area + button -->
            <div class="flex gap-3">
              <label :class="['flex-1 flex items-center justify-center gap-2 p-3.5 border-2 border-dashed rounded-xl cursor-pointer transition text-sm font-medium',
                uploads[step.type] ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-green-400 hover:bg-green-50 hover:text-green-700']">
                <i :class="['fas', uploads[step.type] ? 'fa-check-circle' : 'fa-cloud-upload-alt']"></i>
                {{ uploads[step.type] ? 'Change file' : 'Click to select file' }}
                <input type="file" class="hidden" accept="image/jpeg,image/jpg,image/png,application/pdf"
                  @change="onFileSelect(step.type, $event)">
              </label>

              <button v-if="uploads[step.type]"
                @click="upload(step.type)"
                :disabled="uploading[step.type]"
                class="px-5 py-3 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors flex items-center gap-2 flex-shrink-0">
                <i v-if="uploading[step.type]" class="fas fa-spinner fa-spin text-xs"></i>
                <i v-else class="fas fa-upload text-xs"></i>
                {{ uploading[step.type] ? 'Uploading...' : 'Upload' }}
              </button>
            </div>

            <p class="text-xs text-gray-400 mt-2">
              Accepted: JPG, PNG, PDF &middot; Max 10MB
            </p>
          </div>
        </div>
      </div>

      <!-- All submitted success state -->
      <div v-if="allRequiredUploaded && status?.kyc_status === 'submitted'"
        class="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <i class="fas fa-paper-plane text-blue-600 text-3xl mb-3 block"></i>
        <p class="font-semibold text-blue-900 text-lg">Documents submitted!</p>
        <p class="text-sm text-blue-700 mt-1">
          Our team will review your documents within 1–2 business days.
          You'll receive an email notification once approved.
        </p>
      </div>

      <!-- Tips -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <i class="fas fa-lightbulb text-yellow-500"></i> Tips for faster approval
        </h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Make sure documents are well-lit and all text is clearly readable
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Selfie: hold your ID next to your face — both must be fully visible
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Documents must not be expired
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            File size under 10MB — high quality JPEG or PNG preferred
          </li>
        </ul>
      </div>
    </div>
  </div>
  <app-footer />
</div>`
}
