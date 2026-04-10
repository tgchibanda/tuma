import VueRouter from 'vue-router'

// ── Lazy-load page components ──────────────────────────────────────────────
const Landing        = () => import('./pages/Landing')
const Login          = () => import('./pages/Login')
const Register       = () => import('./pages/Register')
const ForgotPassword = () => import('./pages/ForgotPassword')
const ResetPassword  = () => import('./pages/ResetPassword')

const Dashboard      = () => import('./pages/Dashboard')
const Orders         = () => import('./pages/Orders')
const CreateOrder    = () => import('./pages/CreateOrder')
const OrderDetail    = () => import('./pages/OrderDetail')
const Browse         = () => import('./pages/Browse')
const Matches        = () => import('./pages/Matches')
const MatchDetail    = () => import('./pages/MatchDetail')
const Templates      = () => import('./pages/Templates')
const Recurring      = () => import('./pages/Recurring')
const Recipients     = () => import('./pages/Recipients')
const Profile        = () => import('./pages/Profile')
const PublicProfile  = () => import('./pages/PublicProfile')
const KYC            = () => import('./pages/KYC')
const BankAccounts   = () => import('./pages/BankAccounts')
const RateAlerts     = () => import('./pages/RateAlerts')
const Contacts       = () => import('./pages/Contacts')
const Notifications  = () => import('./pages/Notifications')
const Settings       = () => import('./pages/Settings')
const History        = () => import('./pages/History')
const Referral       = () => import('./pages/Referral')
const Directory      = () => import('./pages/Directory')
const DirectoryProfile = () => import('./pages/DirectoryProfile')
const Disputes       = () => import('./pages/Disputes')
const DisputeDetail  = () => import('./pages/DisputeDetail')
const Onboarding     = () => import('./pages/Onboarding')

// ── Admin pages ────────────────────────────────────────────────────────────
const AdminLogin     = () => import('./pages/admin/AdminLogin')
const AdminDashboard = () => import('./pages/admin/AdminDashboard')
const AdminUsers     = () => import('./pages/admin/AdminUsers')
const AdminUserDetail= () => import('./pages/admin/AdminUserDetail')
const AdminMatches   = () => import('./pages/admin/AdminMatches')
const AdminMatchDetail = () => import('./pages/admin/AdminMatchDetail')
const AdminDeposits  = () => import('./pages/admin/AdminDeposits')
const AdminDisputes  = () => import('./pages/admin/AdminDisputes')
const AdminDisputeDetail = () => import('./pages/admin/AdminDisputeDetail')
const AdminRates     = () => import('./pages/admin/AdminRates')
const AdminLocations = () => import('./pages/admin/AdminLocations')
const AdminSettings  = () => import('./pages/admin/AdminSettings')
const AdminAuditLogs = () => import('./pages/admin/AdminAuditLogs')
const AdminOrders    = () => import('./pages/admin/AdminOrders')
const AdminNoticeboard = () => import('./pages/admin/AdminNoticeboard')

// ── Auth guard helpers ────────────────────────────────────────────────────
const requireAuth = (to, from, next) => {
    if (!localStorage.getItem('tuma_token')) {
        next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
        next()
    }
}

const requireAdmin = (to, from, next) => {
    const user = JSON.parse(localStorage.getItem('tuma_user') || 'null')
    if (!user || user.role !== 'admin') {
        next('/admin/login')
    } else {
        next()
    }
}

const requireGuest = (to, from, next) => {
    if (localStorage.getItem('tuma_token')) {
        next('/dashboard')
    } else {
        next()
    }
}

const routes = [
    // ── Public routes ─────────────────────────────────────────────────────
    { path: '/',            component: Landing,        beforeEnter: requireGuest },
    { path: '/login',       component: Login,          beforeEnter: requireGuest },
    { path: '/register',    component: Register,       beforeEnter: requireGuest },
    { path: '/forgot-password', component: ForgotPassword, beforeEnter: requireGuest },
    { path: '/reset-password',  component: ResetPassword,  beforeEnter: requireGuest },
    { path: '/directory',   component: Directory },
    { path: '/directory/:ulid', component: DirectoryProfile },
    { path: '/users/:ulid', component: PublicProfile },

    // ── Authenticated routes ──────────────────────────────────────────────
    { path: '/onboarding',  component: Onboarding,     beforeEnter: requireAuth },
    { path: '/dashboard',   component: Dashboard,      beforeEnter: requireAuth },
    { path: '/orders',      component: Orders,         beforeEnter: requireAuth },
    { path: '/orders/create', component: CreateOrder,  beforeEnter: requireAuth },
    { path: '/orders/:ulid', component: OrderDetail,   beforeEnter: requireAuth },
    { path: '/browse',      component: Browse,         beforeEnter: requireAuth },
    { path: '/matches',     component: Matches,        beforeEnter: requireAuth },
    { path: '/matches/:ulid', component: MatchDetail,  beforeEnter: requireAuth },
    { path: '/templates',   component: Templates,      beforeEnter: requireAuth },
    { path: '/recurring',   component: Recurring,      beforeEnter: requireAuth },
    { path: '/recipients',  component: Recipients,     beforeEnter: requireAuth },
    { path: '/profile',     component: Profile,        beforeEnter: requireAuth },
    { path: '/kyc',         component: KYC,            beforeEnter: requireAuth },
    { path: '/bank-accounts', component: BankAccounts, beforeEnter: requireAuth },
    { path: '/rate-alerts', component: RateAlerts,     beforeEnter: requireAuth },
    { path: '/contacts',    component: Contacts,       beforeEnter: requireAuth },
    { path: '/notifications', component: Notifications, beforeEnter: requireAuth },
    { path: '/settings',    component: Settings,       beforeEnter: requireAuth },
    { path: '/history',     component: History,        beforeEnter: requireAuth },
    { path: '/referral',    component: Referral,       beforeEnter: requireAuth },
    { path: '/disputes',    component: Disputes,       beforeEnter: requireAuth },
    { path: '/disputes/:id', component: DisputeDetail, beforeEnter: requireAuth },

    // ── Admin routes ──────────────────────────────────────────────────────
    { path: '/admin/login', component: AdminLogin },
    { path: '/admin',       redirect: '/admin/dashboard' },
    { path: '/admin/dashboard',  component: AdminDashboard,   beforeEnter: requireAdmin },
    { path: '/admin/users',      component: AdminUsers,       beforeEnter: requireAdmin },
    { path: '/admin/users/:id',  component: AdminUserDetail,  beforeEnter: requireAdmin },
    { path: '/admin/matches',    component: AdminMatches,     beforeEnter: requireAdmin },
    { path: '/admin/matches/:ulid', component: AdminMatchDetail, beforeEnter: requireAdmin },
    { path: '/admin/deposits',   component: AdminDeposits,    beforeEnter: requireAdmin },
    { path: '/admin/disputes',   component: AdminDisputes,    beforeEnter: requireAdmin },
    { path: '/admin/disputes/:id', component: AdminDisputeDetail, beforeEnter: requireAdmin },
    { path: '/admin/rates',      component: AdminRates,       beforeEnter: requireAdmin },
    { path: '/admin/locations',  component: AdminLocations,   beforeEnter: requireAdmin },
    { path: '/admin/orders',     component: AdminOrders,      beforeEnter: requireAdmin },
    { path: '/admin/noticeboard', component: AdminNoticeboard, beforeEnter: requireAdmin },
    { path: '/admin/settings',   component: AdminSettings,    beforeEnter: requireAdmin },
    { path: '/admin/audit-logs', component: AdminAuditLogs,   beforeEnter: requireAdmin },

    // ── 404 fallback ──────────────────────────────────────────────────────
    { path: '*', redirect: '/' }
]

const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 }
    }
})

export default router
