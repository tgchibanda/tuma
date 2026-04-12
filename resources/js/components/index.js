// ── LoadingSpinner ────────────────────────────────────────────────────────
export const LoadingSpinner = {
    props: { size: { default: 'md' } },
    template: `<div class="flex justify-center items-center py-8">
  <div :class="['animate-spin rounded-full border-t-2 border-green-600 border-r-2 border-gray-200',
    size==='sm'?'w-5 h-5':size==='lg'?'w-12 h-12':'w-8 h-8']"></div>
</div>`
}

// ── AlertBanner ───────────────────────────────────────────────────────────
export const AlertBanner = {
    props: { type: { default: 'info' }, message: String, dismissible: { default: true } },
    data() { return { visible: true } },
    computed: {
        classes() {
            return {
                info: 'bg-blue-50 border-blue-200 text-blue-800',
                success: 'bg-green-50 border-green-200 text-green-800',
                warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                error: 'bg-red-50 border-red-200 text-red-800',
            }[this.type] || 'bg-gray-50 border-gray-200 text-gray-800'
        },
        icon() {
            return { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle' }[this.type] || 'fa-info-circle'
        }
    },
    template: `<div v-if="visible && message" :class="['flex items-start gap-3 p-4 rounded-lg border text-sm', classes]">
  <i :class="['fas mt-0.5 flex-shrink-0', icon]"></i>
  <span class="flex-1">{{ message }}</span>
  <button v-if="dismissible" @click="visible=false" class="opacity-60 hover:opacity-100"><i class="fas fa-times"></i></button>
</div>`
}

// ── StatusBadge ───────────────────────────────────────────────────────────
export const StatusBadge = {
    props: { status: String },
    computed: {
        label() { return this.$fmt ? this.$fmt.statusLabel(this.status) : this.status },
        colorClass() {
            const s = this.status
            if (['completed'].includes(s)) return 'bg-green-100 text-green-800'
            if (['cancelled', 'expired', 'refunded'].includes(s)) return 'bg-red-100 text-red-800'
            if (['disputed'].includes(s)) return 'bg-orange-100 text-orange-800'
            if (['confirmed', 'deposit_verified'].includes(s)) return 'bg-blue-100 text-blue-800'
            if (['open'].includes(s)) return 'bg-gray-100 text-gray-700'
            return 'bg-yellow-100 text-yellow-800'
        }
    },
    template: `<span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass]">{{ label }}</span>`
}

// ── UserAvatar ────────────────────────────────────────────────────────────
export const UserAvatar = {
    props: { user: Object, size: { default: 'md' }, src: String },
    computed: {
        sizeClass() { return { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }[this.size] || 'w-10 h-10 text-sm' },
        initials() {
            if (!this.user) return '?'
            return ((this.user.first_name || this.user.display_name || '?')[0] || '?').toUpperCase()
        },
        bgColor() {
            const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500']
            const idx = (this.user && this.user.id || 0) % colors.length
            return colors[idx]
        }
    },
    template: `<div :class="['rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizeClass, bgColor]">
  <img v-if="src" :src="src" :class="['rounded-full w-full h-full object-cover']" @error="$event.target.style.display='none'"/>
  <span v-else>{{ initials }}</span>
</div>`
}

// ── RatingStars ───────────────────────────────────────────────────────────
export const RatingStars = {
    props: { value: Number, max: { default: 5 }, size: { default: 'sm' }, interactive: { default: false } },
    data() { return { hovered: 0 } },
    computed: {
        display() { return this.hovered || this.value || 0 }
    },
    methods: {
        set(v) { if (this.interactive) this.$emit('input', v) }
    },
    template: `<div class="flex gap-0.5">
  <i v-for="i in max" :key="i"
    :class="['fas fa-star', size==='sm'?'text-sm':'text-base',
      i <= display ? 'text-yellow-400' : 'text-gray-200',
      interactive ? 'cursor-pointer' : '']"
    @mouseenter="interactive && (hovered=i)"
    @mouseleave="interactive && (hovered=0)"
    @click="set(i)"></i>
  <span v-if="value" class="text-xs text-gray-500 ml-1">{{ parseFloat(value).toFixed(1) }}</span>
</div>`
}

// ── EmptyState ────────────────────────────────────────────────────────────
export const EmptyState = {
    props: { icon: { default: 'fa-inbox' }, title: String, subtitle: String, actionLabel: String, actionTo: String },
    template: `<div class="text-center py-16 px-4">
  <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
    <i :class="['fas text-gray-400 text-2xl', icon]"></i>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
  <p v-if="subtitle" class="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{{ subtitle }}</p>
  <router-link v-if="actionLabel && actionTo" :to="actionTo"
    class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
    {{ actionLabel }}
  </router-link>
</div>`
}

// ── ConfirmModal ──────────────────────────────────────────────────────────
export const ConfirmModal = {
    props: { show: Boolean, title: String, message: String, confirmLabel: { default: 'Confirm' }, confirmClass: { default: 'bg-red-600 hover:bg-red-700' }, loading: Boolean },
    template: `<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')"></div>
  <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
    <h3 class="font-semibold text-gray-900 text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-600 text-sm mb-6">{{ message }}</p>
    <div class="flex gap-3 justify-end">
      <button @click="$emit('cancel')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
      <button @click="$emit('confirm')" :disabled="loading"
        :class="['px-4 py-2 text-sm text-white rounded-lg font-medium transition disabled:opacity-50', confirmClass]">
        <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ confirmLabel }}
      </button>
    </div>
  </div>
</div>`
}

// ── PaginationLinks ───────────────────────────────────────────────────────
export const PaginationLinks = {
    props: { meta: Object },
    template: `<div v-if="meta && meta.last_page > 1" class="flex items-center justify-between mt-6">
  <p class="text-sm text-gray-500">
    Showing {{ meta.from }}–{{ meta.to }} of {{ meta.total }}
  </p>
  <div class="flex gap-1">
    <button @click="$emit('page', meta.current_page - 1)" :disabled="meta.current_page <= 1"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
      <i class="fas fa-chevron-left text-xs"></i>
    </button>
    <button v-for="p in meta.last_page" :key="p"
      v-if="Math.abs(p - meta.current_page) <= 2"
      @click="$emit('page', p)"
      :class="['px-3 py-1.5 text-sm rounded-lg border transition',
        p === meta.current_page ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 hover:bg-gray-50']">
      {{ p }}
    </button>
    <button @click="$emit('page', meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
      <i class="fas fa-chevron-right text-xs"></i>
    </button>
  </div>
</div>`
}

// ── AppFooter ─────────────────────────────────────────────────────────────
export const AppFooter = {
    template: `<footer class="bg-white border-t border-gray-100 mt-16 py-8">
  <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-xs">Tu</span>
      </div>
      <span class="font-bold text-gray-900">Tu<span class="text-green-700">Ma</span></span>
      <span class="text-gray-400 text-sm ml-2">© {{ new Date().getFullYear() }}</span>
    </div>
    <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-gray-500">
      <router-link to="/privacy"        class="hover:text-gray-900 transition-colors">Privacy Policy</router-link>
      <router-link to="/terms"          class="hover:text-gray-900 transition-colors">Terms of Service</router-link>
      <router-link to="/aml-policy"     class="hover:text-gray-900 transition-colors">AML &amp; Compliance</router-link>
      <router-link to="/acceptable-use" class="hover:text-gray-900 transition-colors">Acceptable Use</router-link>
      <router-link to="/support"        class="hover:text-gray-900 transition-colors">Support</router-link>
      <router-link to="/directory"      class="hover:text-gray-900 transition-colors">Directory</router-link>
    </div>
  </div>
</footer>`
}

// ── FileUpload ────────────────────────────────────────────────────────────
export const FileUpload = {
    props: { label: String, accept: { default: 'image/*,.pdf' }, hint: String, required: Boolean },
    data() { return { fileName: '', dragOver: false } },
    methods: {
        onFile(e) {
            const file = (e.target && e.target.files ? e.target.files[0] : (e.dataTransfer ? e.dataTransfer.files[0] : null))
            if (!file) return
            this.fileName = file.name
            this.$emit('change', file)
        }
    },
    template: `<div>
  <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
    {{ label }} <span v-if="required" class="text-red-500">*</span>
  </label>
  <div
    :class="['relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition',
      dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50']"
    @dragover.prevent="dragOver=true"
    @dragleave="dragOver=false"
    @drop.prevent="dragOver=false; onFile($event)"
    @click="$refs.input.click()">
    <input ref="input" type="file" :accept="accept" class="hidden" @change="onFile">
    <i v-if="!fileName" class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
    <i v-else class="fas fa-check-circle text-2xl text-green-600 mb-2"></i>
    <p class="text-sm font-medium" :class="fileName ? 'text-green-700' : 'text-gray-700'">
      {{ fileName || 'Click to upload or drag & drop' }}
    </p>
    <p v-if="hint && !fileName" class="text-xs text-gray-400 mt-1">{{ hint }}</p>
  </div>
</div>`
}

export default { LoadingSpinner, AlertBanner, StatusBadge, UserAvatar, RatingStars, EmptyState, ConfirmModal, PaginationLinks, AppFooter, FileUpload }
