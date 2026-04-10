import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import router from './router'

// ── Axios global config ────────────────────────────────────────────────────
axios.defaults.baseURL = '/api/v1'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Bearer token interceptor — reads from localStorage
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('tuma_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Response interceptor — redirect to login on 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('tuma_token')
            localStorage.removeItem('tuma_user')
            router.push('/login').catch(() => {})
        }
        return Promise.reject(error)
    }
)

Vue.prototype.$http = axios
Vue.prototype.$api = axios

Vue.use(VueRouter)

// ── Global helpers on Vue prototype ────────────────────────────────────────
Vue.prototype.$auth = {
    get user() {
        try { return JSON.parse(localStorage.getItem('tuma_user') || 'null') } catch { return null }
    },
    get token() { return localStorage.getItem('tuma_token') },
    get isLoggedIn() { return !!localStorage.getItem('tuma_token') },
    login(token, user) {
        localStorage.setItem('tuma_token', token)
        localStorage.setItem('tuma_user', JSON.stringify(user))
    },
    logout() {
        localStorage.removeItem('tuma_token')
        localStorage.removeItem('tuma_user')
    }
}

Vue.prototype.$fmt = {
    aud: (v) => `AUD $${parseFloat(v || 0).toFixed(2)}`,
    usd: (v) => `USD $${parseFloat(v || 0).toFixed(2)}`,
    date: (v) => v ? new Date(v).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    datetime: (v) => v ? new Date(v).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    statusLabel(s) {
        const map = {
            open: 'Open', negotiating: 'Negotiating', rate_agreed: 'Rate Agreed',
            delivery_method_selecting: 'Choosing Delivery', agreed: 'Agreed',
            awaiting_deposit: 'Awaiting Deposit', deposit_uploaded: 'Proof Uploaded',
            deposit_verified: 'Deposit Verified', awaiting_delivery: 'Awaiting Delivery',
            awaiting_risk_delivery: 'Risk Delivery Pending', delivery_uploaded: 'Delivered',
            awaiting_confirmation: 'Awaiting Confirmation', confirmed: 'Confirmed',
            releasing: 'Releasing Funds', completed: 'Completed',
            cancelled: 'Cancelled', expired: 'Expired', disputed: 'Disputed',
            refunded: 'Refunded'
        }
        return map[s] || s
    },
    statusColor(s) {
        if (['completed'].includes(s)) return 'green'
        if (['cancelled', 'expired', 'refunded'].includes(s)) return 'red'
        if (['disputed'].includes(s)) return 'orange'
        if (['confirmed', 'deposit_verified', 'awaiting_delivery'].includes(s)) return 'blue'
        return 'yellow'
    }
}

Vue.prototype.$toast = {
    _show(msg, type) {
        const el = document.createElement('div')
        el.className = `fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800'
        }`
        el.textContent = msg
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 3500)
    },
    success(msg) { this._show(msg, 'success') },
    error(msg) { this._show(msg, 'error') },
    info(msg) { this._show(msg, 'info') }
}

// ── Global Components ───────────────────────────────────────────────────────
import AppNav from './components/AppNav'
import AppFooter from './components/AppFooter'
import LoadingSpinner from './components/LoadingSpinner'
import AlertBanner from './components/AlertBanner'
import StatusBadge from './components/StatusBadge'
import UserAvatar from './components/UserAvatar'
import RatingStars from './components/RatingStars'
import SmartCalculator from './components/SmartCalculator'
import StatusTimeline from './components/StatusTimeline'
import ChatPanel from './components/ChatPanel'
import TransactionFeedTicker from './components/TransactionFeedTicker'
import OrderCard from './components/OrderCard'
import MatchCard from './components/MatchCard'
import EmptyState from './components/EmptyState'
import ConfirmModal from './components/ConfirmModal'
import FileUpload from './components/FileUpload'
import PaginationLinks from './components/PaginationLinks'

Vue.component('app-nav', AppNav)
Vue.component('app-footer', AppFooter)
Vue.component('loading-spinner', LoadingSpinner)
Vue.component('alert-banner', AlertBanner)
Vue.component('status-badge', StatusBadge)
Vue.component('user-avatar', UserAvatar)
Vue.component('rating-stars', RatingStars)
Vue.component('smart-calculator', SmartCalculator)
Vue.component('status-timeline', StatusTimeline)
Vue.component('chat-panel', ChatPanel)
Vue.component('transaction-feed-ticker', TransactionFeedTicker)
Vue.component('order-card', OrderCard)
Vue.component('match-card', MatchCard)
Vue.component('empty-state', EmptyState)
Vue.component('confirm-modal', ConfirmModal)
Vue.component('file-upload', FileUpload)
Vue.component('pagination-links', PaginationLinks)

// ── Root Vue instance ───────────────────────────────────────────────────────
new Vue({
    el: '#app',
    router,
    template: `<router-view />`
})
