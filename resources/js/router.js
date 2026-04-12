import VueRouter from 'vue-router'

import Landing        from './pages/Landing'
import Login          from './pages/Login'
import Register       from './pages/Register'
import VerifyEmail    from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import Onboarding     from './pages/Onboarding'
import Dashboard      from './pages/Dashboard'
import Browse         from './pages/Browse'
import CreateOrder    from './pages/CreateOrder'
import Orders         from './pages/Orders'
import OrderDetail    from './pages/OrderDetail'
import Matches        from './pages/Matches'
import MatchDetail    from './pages/MatchDetail'
import Profile        from './pages/Profile'
import PublicProfile  from './pages/PublicProfile'
import KYC            from './pages/KYC'
import BankAccounts   from './pages/BankAccounts'
import Settings       from './pages/Settings'
import Notifications  from './pages/Notifications'
import History        from './pages/History'
import Directory      from './pages/Directory'
import RateAlerts     from './pages/RateAlerts'
import Recipients     from './pages/Recipients'
import Contacts       from './pages/Contacts'
import Templates      from './pages/Templates'
import Recurring      from './pages/Recurring'
import Referral       from './pages/Referral'
import Disputes       from './pages/Disputes'
import DisputeDetail  from './pages/DisputeDetail'

import AdminLogin         from './pages/admin/AdminLogin'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminUsers         from './pages/admin/AdminUsers'
import AdminUserDetail    from './pages/admin/AdminUserDetail'
import AdminMatches       from './pages/admin/AdminMatches'
import AdminMatchDetail   from './pages/admin/AdminMatchDetail'
import AdminDeposits      from './pages/admin/AdminDeposits'
import AdminDisputes      from './pages/admin/AdminDisputes'
import AdminDisputeDetail from './pages/admin/AdminDisputeDetail'
import AdminSettings      from './pages/admin/AdminSettings'
import AdminOrders        from './pages/admin/AdminOrders'
import AdminRates         from './pages/admin/AdminRates'
import AdminLocations     from './pages/admin/AdminLocations'
import AdminAuditLogs     from './pages/admin/AdminAuditLogs'
import AdminNoticeboard   from './pages/admin/AdminNoticeboard'
import AdminReports       from './pages/admin/AdminReports'
import AdminSupport      from './pages/admin/AdminSupport'

import Support         from './pages/Support'
import HowItWorks      from './pages/public/HowItWorks'
import SafetyAndEscrow from './pages/public/SafetyAndEscrow'
import PublicTerms     from './pages/public/PublicTerms'
import PublicPrivacy   from './pages/public/PublicPrivacy'
import TermsOfService  from './pages/legal/TermsOfService'
import PrivacyPolicy   from './pages/legal/PrivacyPolicy'
import AmlPolicy       from './pages/legal/AmlPolicy'
import AcceptableUse   from './pages/legal/AcceptableUse'

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        // ── Public ──────────────────────────────────────────────────────
        { path: '/',                component: Landing,        name: 'landing'        },
        { path: '/login',           component: Login,          name: 'login',         meta: { guest: true } },
        { path: '/register',        component: Register,       name: 'register',      meta: { guest: true } },
        { path: '/forgot-password', component: ForgotPassword, name: 'forgot'         },
        { path: '/verify-email/:id/:hash', component: VerifyEmail, name: 'verify-email' },
        { path: '/reset-password',  component: ResetPassword,  name: 'reset'          },
        { path: '/directory',       component: Directory,      name: 'directory'      },
        // Public info pages
        { path: '/how-it-works',    component: HowItWorks,      name: 'how-it-works'    },
        { path: '/safety-and-escrow', component: SafetyAndEscrow, name: 'safety-escrow'  },
        // Legal pages — public, no auth required
        { path: '/terms',           component: PublicTerms,    name: 'terms'           },
        { path: '/privacy',         component: PublicPrivacy,  name: 'privacy'         },
        { path: '/aml-policy',      component: AmlPolicy,      name: 'aml'             },
        { path: '/acceptable-use',  component: AcceptableUse,  name: 'acceptable-use'  },
        // Public profile — /profile/:ulid used by Directory and Browse "View profile" buttons
        { path: '/profile/:ulid',   component: PublicProfile,  name: 'public-profile' },

        // ── Authenticated ────────────────────────────────────────────────
        { path: '/onboarding',      component: Onboarding,    meta: { auth: true } },
        { path: '/dashboard',       component: Dashboard,     meta: { auth: true } },
        { path: '/browse',          component: Browse,        meta: { auth: true } },

        // Orders — /orders/create MUST come before /orders/:ulid
        { path: '/orders/create',   component: CreateOrder,   meta: { auth: true } },
        { path: '/orders',          component: Orders,        meta: { auth: true } },
        { path: '/orders/:ulid',    component: OrderDetail,   meta: { auth: true } },

        // Matches
        { path: '/matches',         component: Matches,       meta: { auth: true } },
        { path: '/matches/:ulid',   component: MatchDetail,   meta: { auth: true } },

        // Account
        { path: '/profile',         component: Profile,       meta: { auth: true } },
        { path: '/kyc',             component: KYC,           meta: { auth: true } },
        { path: '/bank-accounts',   component: BankAccounts,  meta: { auth: true } },
        { path: '/settings',        component: Settings,      meta: { auth: true } },
        { path: '/notifications',   component: Notifications, meta: { auth: true } },
        { path: '/history',         component: History,       meta: { auth: true } },
        { path: '/rate-alerts',     component: RateAlerts,    meta: { auth: true } },
        { path: '/recipients',      component: Recipients,    meta: { auth: true } },
        { path: '/contacts',        component: Contacts,      meta: { auth: true } },
        { path: '/templates',       component: Templates,     meta: { auth: true } },
        { path: '/recurring',       component: Recurring,     meta: { auth: true } },
        { path: '/referral',        component: Referral,      meta: { auth: true } },
        { path: '/disputes',        component: Disputes,      meta: { auth: true } },
        { path: '/disputes/:id',    component: DisputeDetail, meta: { auth: true } },
        { path: '/support',         component: Support,        meta: { auth: true } },

        // ── Admin ────────────────────────────────────────────────────────
        { path: '/admin/login',           component: AdminLogin,        meta: { guest: true } },
        { path: '/admin/dashboard',       component: AdminDashboard,    meta: { admin: true } },
        { path: '/admin/users',           component: AdminUsers,        meta: { admin: true } },
        { path: '/admin/users/:id',       component: AdminUserDetail,   meta: { admin: true } },
        { path: '/admin/matches',         component: AdminMatches,      meta: { admin: true } },
        { path: '/admin/matches/:ulid',   component: AdminMatchDetail,  meta: { admin: true } },
        { path: '/admin/deposits',        component: AdminDeposits,     meta: { admin: true } },
        { path: '/admin/disputes',        component: AdminDisputes,     meta: { admin: true } },
        { path: '/admin/disputes/:id',    component: AdminDisputeDetail,meta: { admin: true } },
        { path: '/admin/settings',        component: AdminSettings,     meta: { admin: true } },
        { path: '/admin/orders',          component: AdminOrders,       meta: { admin: true } },
        { path: '/admin/rates',           component: AdminRates,        meta: { admin: true } },
        { path: '/admin/locations',       component: AdminLocations,    meta: { admin: true } },
        { path: '/admin/audit-logs',      component: AdminAuditLogs,    meta: { admin: true } },
        { path: '/admin/noticeboard',     component: AdminNoticeboard,  meta: { admin: true } },
        { path: '/admin/reports',         component: AdminReports,      meta: { admin: true } },
        { path: '/admin/support',         component: AdminSupport,      meta: { admin: true } },

        // Catch-all
        { path: '*', redirect: '/' },
    ],
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('tuma_token')
    const user  = (() => {
        try { return JSON.parse(localStorage.getItem('tuma_user') || 'null') } catch { return null }
    })()

    if (to.meta.auth && !token)                             return next('/login')
    if (to.meta.admin && (!token || user?.role !== 'admin'))return next('/admin/login')
    if (to.meta.guest && token) {
        return next(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }
    next()
})

export default router
