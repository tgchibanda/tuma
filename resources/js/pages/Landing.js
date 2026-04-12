// Landing.js — Fixed version
// KEY FIX: Removed all "AUD ${{ }}" and "USD ${{ }}" patterns from template literals.
// Rollup's parser treats ${ as a JS template expression start, causing parse errors.
// Solution: Use methods fmtAud() and fmtUsd() instead of inline "${{ }}" in templates.
// These methods return strings like "AUD 450.00" without the dollar sign inline.
// The currency symbol is hardcoded into the method return value safely.

export default {
    name: 'Landing',
    data() {
        return {
            feedItems: [], stats: {}, loading: true,
            toasts: [], toastTimer: null,
            reviewIndex: 0, reviewTimer: null,
            howItWorksStep: 0,
            statsVisible: false,
            animatedStats: { volume: 0, count: 0, rate: 0, cities: 0 },
        }
    },
    computed: {
        reviews() {
            return [
                { name: 'Tendai M.', location: 'Melbourne to Harare',         avatar: 'T', color: 'bg-green-700',  stars: 5, date: '2 weeks ago',  text: 'Absolutely life-changing. I have been sending money home for years and always lost 8 to 10 percent to fees and bad rates. eZimConnect matched me in under an hour and my mum got her cash the same afternoon. Zero stress.' },
                { name: 'Rudo C.',   location: 'Sydney to Bulawayo',          avatar: 'R', color: 'bg-blue-700',   stars: 5, date: '1 month ago',  text: 'I was skeptical at first but the escrow system made me feel completely safe. Sent AUD 800 and my sister confirmed she received every cent. The whole process took 3 hours. Other providers used to charge me over AUD 60 for the same amount.' },
                { name: 'Farai N.',  location: 'Brisbane to Mutare',          avatar: 'F', color: 'bg-purple-700', stars: 5, date: '3 weeks ago',  text: 'The chat feature during the transaction gave me peace of mind. I could talk directly with the person delivering the cash. My mother confirmed receipt immediately. Will never use a remittance service again.' },
                { name: 'Tatenda K.',location: 'Perth to Gweru',              avatar: 'T', color: 'bg-orange-600', stars: 5, date: '5 days ago',   text: 'As someone who sends money every month, the recurring orders feature is a game changer. I set it once and eZimConnect handles everything. My family in Gweru now receives reliably on time every month.' },
                { name: 'Blessing S.',location: 'Adelaide to Victoria Falls', avatar: 'B', color: 'bg-teal-700',   stars: 5, date: '1 week ago',   text: 'I run a small business in Zimbabwe and needed AUD regularly for my Australian suppliers. eZimConnect directory listing means customers find me. This platform is exactly what our community needed.' },
            ]
        },
        toastPool() {
            return [
                { icon: '💸', msg: 'T***i from Melbourne just sent AUD 450 to Harare' },
                { icon: '👋', msg: 'New member from Sydney just joined eZimConnect' },
                { icon: '💸', msg: 'R***o from Brisbane sent AUD 700 to Bulawayo' },
                { icon: '⭐', msg: 'F***i just left a 5-star review — Delivered same day!' },
                { icon: '💸', msg: 'B***g from Perth sent AUD 200 to Mutare' },
                { icon: '👋', msg: 'New member from Adelaide just joined eZimConnect' },
                { icon: '💸', msg: 'C***o from Sydney sent AUD 550 to Harare' },
                { icon: '⭐', msg: 'T***a just left a 5-star review — No fees, lightning fast!' },
            ]
        },
        steps() {
            return [
                { n: '01', icon: 'fa-user-plus',    title: 'Create account',  colorClass: 'text-green-600',  bgClass: 'bg-green-50',  iconBg: 'bg-green-600',  desc: 'Sign up free in 2 minutes. Add your Australian bank account. No setup fees ever.',              detail: 'Your real details are always private. Choose to show your profile as public or anonymous.' },
                { n: '02', icon: 'fa-plus-circle',  title: 'Post your order', colorClass: 'text-blue-600',   bgClass: 'bg-blue-50',   iconBg: 'bg-blue-600',   desc: 'State how much AUD to send and who receives USD cash in Zimbabwe. Any amount from AUD 50.',   detail: 'Our live calculator shows exactly what your recipient gets after our 1.5% flat fee.' },
                { n: '03', icon: 'fa-handshake',    title: 'Match and agree', colorClass: 'text-purple-600', bgClass: 'bg-purple-50', iconBg: 'bg-purple-600', desc: 'Match with someone who has the opposite need. Negotiate the rate via in-app chat.',           detail: 'Choose Secure delivery (AUD first) or Risk delivery (cash first). Your choice every time.' },
                { n: '04', icon: 'fa-shield-alt',   title: 'Escrow protects', colorClass: 'text-orange-500', bgClass: 'bg-orange-50', iconBg: 'bg-orange-500', desc: 'Your AUD is held in our Trust Account until delivery is confirmed with photo proof.',        detail: 'Recipient ID photo plus cash handover photo required before any funds move.' },
                { n: '05', icon: 'fa-check-circle', title: 'Funds released',  colorClass: 'text-teal-600',   bgClass: 'bg-teal-50',   iconBg: 'bg-teal-600',   desc: 'Recipient confirms cash received. AUD released to deliverer. Transaction complete.',         detail: 'The whole process typically takes 2 to 6 hours. Faster than any bank wire.' },
            ]
        },
        currentStep() { return this.steps[this.howItWorksStep] }
    },
    async mounted() {
        try {
            const [feed, stats] = await Promise.all([
                this.$http.get('/feed?per_page=8'),
                this.$http.get('/feed/stats')
            ])
            this.feedItems = feed.data.data || []
            this.stats     = stats.data.data || {}
        } catch (e) {}
        this.loading = false
        setTimeout(() => this.scheduleToast(), 8000)
        this.reviewTimer = setInterval(() => {
            this.reviewIndex = (this.reviewIndex + 1) % this.reviews.length
        }, 6000)
        this.$nextTick(() => {
            const el = document.getElementById('stats-section')
            if (el) {
                const observer = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting && !this.statsVisible) {
                        this.statsVisible = true
                        this.animateStats()
                    }
                }, { threshold: 0.3 })
                observer.observe(el)
            }
        })
    },
    beforeDestroy() {
        clearTimeout(this.toastTimer)
        clearInterval(this.reviewTimer)
    },
    methods: {
        scheduleToast() {
            const delay = 25000 + Math.random() * 15000
            this.toastTimer = setTimeout(() => {
                const t = this.toastPool[Math.floor(Math.random() * this.toastPool.length)]
                const id = Date.now()
                this.toasts.push({ ...t, id })
                setTimeout(() => { this.toasts = this.toasts.filter(x => x.id !== id) }, 7000)
                this.scheduleToast()
            }, delay)
        },
        dismissToast(id) { this.toasts = this.toasts.filter(x => x.id !== id) },
        setReview(i) {
            this.reviewIndex = i
            clearInterval(this.reviewTimer)
            this.reviewTimer = setInterval(() => {
                this.reviewIndex = (this.reviewIndex + 1) % this.reviews.length
            }, 6000)
        },
        prevReview() { this.setReview((this.reviewIndex - 1 + this.reviews.length) % this.reviews.length) },
        nextReview() { this.setReview((this.reviewIndex + 1) % this.reviews.length) },
        animateStats() {
            const targets = {
                volume: parseInt(this.stats.total_volume_aud || 847320),
                count:  parseInt(this.stats.total_count || 1243),
                rate:   98,
                cities: parseInt(this.stats.cities_count || 16)
            }
            const dur = 1800, start = Date.now()
            const tick = () => {
                const p = Math.min((Date.now() - start) / dur, 1)
                const e = 1 - Math.pow(1 - p, 3)
                this.animatedStats.volume = Math.round(targets.volume * e)
                this.animatedStats.count  = Math.round(targets.count * e)
                this.animatedStats.rate   = Math.round(targets.rate * e)
                this.animatedStats.cities = Math.round(targets.cities * e)
                if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        },
        fmtVolume() {
            const v = this.animatedStats.volume
            if (v >= 1000000) return 'AUD ' + (v / 1000000).toFixed(1) + 'M'
            return 'AUD ' + v.toLocaleString()
        },
        // IMPORTANT: Use these methods in templates instead of inline "AUD ${{ }}"
        // which triggers Rollup's JS template literal parser (${ is ambiguous).
        fmtAud(v) { return 'AUD ' + parseFloat(v || 0).toFixed(2) },
        fmtUsd(v) { return 'USD ' + parseFloat(v || 0).toFixed(2) },
        fmtDate(dt) {
            return dt ? new Date(dt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : 'Today'
        },
    },
    template: `
<div class="min-h-screen bg-white overflow-x-hidden" style="font-family:Georgia,serif;">

  <!-- Toast notifications (bottom-left) -->
  <div class="fixed bottom-5 left-5 z-50 space-y-2 max-w-xs">
    <transition-group name="toast-pop">
      <div v-for="t in toasts" :key="t.id"
        class="flex items-start gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
        @click="dismissToast(t.id)">
        <span class="text-lg flex-shrink-0">{{ t.icon }}</span>
        <p class="text-xs leading-snug flex-1">{{ t.msg }}</p>
        <i class="fas fa-times text-xs text-gray-500 hover:text-white mt-0.5"></i>
      </div>
    </transition-group>
  </div>

  <!-- NAVBAR -->
  <nav class="sticky top-0 z-40 bg-white/96 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="hidden md:flex items-center gap-0.5">
        <a href="#how-it-works" class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">How it works</a>
        <a href="#features"     class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Features</a>
        <a href="#reviews"      class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Reviews</a>
        <router-link to="/directory" class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Directory</router-link>
      </div>
      <div class="flex items-center gap-2">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors">Log in</router-link>
        <router-link to="/register" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 shadow-md transition-all" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Get started free</router-link>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="relative overflow-hidden" style="background:linear-gradient(160deg,#0d4a28 0%,#1a6b3c 50%,#0f5e32 100%);">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style="background:#f59e0b;"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-8" style="background:#f59e0b;"></div>
    </div>
    <div class="max-w-6xl mx-auto px-5 py-20 lg:py-28 relative z-10">
      <div class="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/20 bg-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
            <span class="text-xs font-bold text-yellow-300 tracking-wider uppercase">Zero bank fees · Live now</span>
          </div>
          <h1 class="text-white mb-5 leading-tight" style="font-family:Georgia,serif;font-size:clamp(2.2rem,4vw,3.5rem);font-weight:900;">
            Send money to Zimbabwe<br><span style="color:#f59e0b;">without the fees</span>
          </h1>
          <p class="text-green-100 text-lg mb-8 leading-relaxed max-w-md">
            eZimConnect connects Australians directly with trusted community members to swap
            AUD for USD cash. Peer-to-peer, secured by escrow, at just 1.5%.
          </p>
          <div class="flex flex-wrap gap-3 mb-8">
            <router-link to="/register" class="flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl shadow-lg hover:scale-105 transition-transform" style="background:#f59e0b;color:#1a1a1a;">
              <i class="fas fa-paper-plane text-xs"></i> Start sending money
            </router-link>
            <a href="#how-it-works" class="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
              <i class="fas fa-play-circle text-xs"></i> How it works
            </a>
          </div>
          <div class="flex flex-wrap gap-5 text-sm">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5">
                <div v-for="(c,i) in ['bg-green-400','bg-blue-400','bg-purple-400','bg-orange-400']" :key="i"
                  :class="['w-7 h-7 rounded-full border-2 border-green-800 flex items-center justify-center text-white text-xs font-bold',c]">{{ 'TRFB'[i] }}</div>
              </div>
              <span class="text-green-200 font-medium">1,200+ members</span>
            </div>
            <div class="flex items-center gap-1 text-green-200">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="font-semibold">4.9 rating</span>
              <span class="opacity-60 ml-1">· 340+ reviews</span>
            </div>
          </div>
        </div>

        <!-- Calculator -->
        <div class="relative">
          <div class="rounded-3xl p-6 shadow-2xl border border-white/20" style="background:rgba(255,255,255,0.08);">
            <div class="flex items-center justify-between mb-5">
              <p class="text-white font-bold">Live calculator</p>
              <span class="flex items-center gap-1.5 text-xs text-green-300">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                1 AUD = 0.6300 USD
              </span>
            </div>
            <div class="rounded-2xl p-4 mb-2" style="background:rgba(255,255,255,0.1);">
              <p class="text-green-200 text-xs mb-1">You send</p>
              <div class="flex items-center justify-between">
                <span class="text-white text-3xl font-black">AUD 500.00</span>
                <div class="flex items-center gap-2 rounded-xl px-3 py-1.5" style="background:rgba(255,255,255,0.15);"><span>🇦🇺</span><span class="text-white font-bold text-sm">AUD</span></div>
              </div>
            </div>
            <div class="text-center text-xs text-green-300 py-2 opacity-80">Platform fee: AUD 7.50 (1.5%)</div>
            <div class="rounded-2xl p-4 mb-4" style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);">
              <p class="text-yellow-300 text-xs mb-1">Recipient gets</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-black" style="color:#f59e0b;">USD 310.27</span>
                <div class="flex items-center gap-2 rounded-xl px-3 py-1.5" style="background:rgba(255,255,255,0.15);"><span>🇿🇼</span><span class="text-white font-bold text-sm">USD</span></div>
              </div>
            </div>
            <div class="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4 text-xs text-green-300" style="background:rgba(34,197,94,0.1);">
              <i class="fas fa-piggy-bank text-green-400"></i>
              Save approx. AUD 17.50 vs other providers
            </div>
            <router-link to="/register" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all" style="background:#f59e0b;color:#1a1a1a;">
              Get started free <i class="fas fa-arrow-right text-xs"></i>
            </router-link>
          </div>
          <div class="absolute -right-3 -bottom-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-2.5 flex items-center gap-3 tuma-float">
            <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-check text-green-600 text-sm"></i>
            </div>
            <div><p class="font-bold text-gray-900 text-sm">Cash delivered!</p><p class="text-xs text-gray-400">Harare · 2 hrs ago</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section id="stats-section" class="border-b border-gray-100 bg-gray-50">
    <div class="max-w-6xl mx-auto px-5 py-14">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="(s,i) in [
          {label:'Total AUD sent',     val:fmtVolume(),                              icon:'fa-dollar-sign'},
          {label:'Completed trades',   val:animatedStats.count.toLocaleString()+'+', icon:'fa-exchange-alt'},
          {label:'Success rate',       val:animatedStats.rate+'%',                   icon:'fa-check-circle'},
          {label:'Cities in Zimbabwe', val:animatedStats.cities+'',                  icon:'fa-map-marker-alt'},
        ]" :key="i">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:linear-gradient(135deg,rgba(26,107,60,0.12),rgba(26,107,60,0.06));">
            <i :class="'fas ' + s.icon + ' text-green-700'"></i>
          </div>
          <p class="text-3xl font-black text-gray-900" style="font-family:Georgia,serif;">{{ s.val }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section id="how-it-works" class="py-20 bg-white">
    <div class="max-w-5xl mx-auto px-5">
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">Simple process</span>
        <h2 class="text-4xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">How eZimConnect works</h2>
        <p class="text-gray-500 max-w-md mx-auto">Five steps from signup to your recipient receiving cash in Zimbabwe.</p>
      </div>
      <div class="flex flex-wrap gap-2 justify-center mb-10">
        <button v-for="(s,i) in steps" :key="i" @click="howItWorksStep = i"
          :class="['flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all',
            howItWorksStep === i ? 'bg-green-700 border-green-700 text-white shadow-md' : 'border-gray-200 text-gray-600 bg-white hover:border-green-300']">
          <span :class="['w-5 h-5 rounded-full text-xs font-black flex items-center justify-center',
            howItWorksStep === i ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600']">{{ i+1 }}</span>
          {{ s.title }}
        </button>
      </div>
      <transition name="step-fade" mode="out-in">
        <div :key="howItWorksStep" class="grid md:grid-cols-2 gap-8 items-center">
          <div :class="['rounded-3xl p-12 flex items-center justify-center min-h-56', currentStep.bgClass]">
            <div class="text-center">
              <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg', currentStep.iconBg]">
                <i :class="'fas ' + currentStep.icon + ' text-white text-4xl'"></i>
              </div>
              <span :class="['text-8xl font-black opacity-10', currentStep.colorClass]" style="font-family:Georgia,serif;">{{ currentStep.n }}</span>
            </div>
          </div>
          <div>
            <p :class="['text-xs font-bold tracking-widest uppercase mb-2', currentStep.colorClass]">Step {{ currentStep.n }}</p>
            <h3 class="text-2xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">{{ currentStep.title }}</h3>
            <p class="text-gray-600 leading-relaxed mb-4">{{ currentStep.desc }}</p>
            <div class="flex items-start gap-2 p-3.5 bg-gray-50 rounded-xl">
              <i class="fas fa-info-circle text-gray-400 mt-0.5 flex-shrink-0"></i>
              <p class="text-sm text-gray-500">{{ currentStep.detail }}</p>
            </div>
            <div class="flex items-center gap-2 mt-6">
              <button v-for="(_,i) in steps" :key="i" @click="howItWorksStep = i"
                :class="['h-1.5 rounded-full transition-all', howItWorksStep === i ? 'w-8 bg-green-700' : 'w-2 bg-gray-200']"></button>
              <button @click="howItWorksStep = (howItWorksStep + 1) % steps.length"
                class="ml-auto text-sm font-semibold text-green-700 flex items-center gap-1 hover:text-green-800">
                {{ howItWorksStep < steps.length - 1 ? 'Next step' : 'Start over' }}
                <i class="fas fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" style="background:#0d1117;" class="py-20">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-yellow-400 bg-yellow-400/10 px-4 py-1.5 rounded-full mb-3">Built for our community</span>
        <h2 class="text-4xl font-black text-white mb-3" style="font-family:Georgia,serif;">Everything you need to send money home</h2>
        <p class="text-gray-400 max-w-lg mx-auto">Every feature designed around the realities of sending money between Australia and Zimbabwe.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="f in [
          {icon:'fa-shield-alt',     color:'#22c55e', title:'Escrow protection',   desc:'Your AUD is never at risk. Funds only release when cash delivery is verified with photo evidence.'},
          {icon:'fa-handshake',      color:'#f59e0b', title:'Peer-to-peer rates',  desc:'Negotiate directly with community members and agree on a rate. No middlemen taking extra margin.'},
          {icon:'fa-comments',       color:'#60a5fa', title:'In-transaction chat', desc:'Talk directly with your match partner throughout the process. Built-in and on-platform.'},
          {icon:'fa-camera',         color:'#a78bfa', title:'Photo verification',  desc:'Delivery proved with recipient ID photo and cash handover photo. No photo, no release.'},
          {icon:'fa-calendar-check', color:'#f97316', title:'Recurring orders',    desc:'Set up automatic monthly transfers so your family receives on time every month without effort.'},
          {icon:'fa-bolt',           color:'#22c55e', title:'Fast matching',       desc:'Most orders match within hours thanks to our growing community across all major Australian cities.'},
          {icon:'fa-users',          color:'#f59e0b', title:'Trusted directory',   desc:'Verified businesses and power traders listed publicly. Browse profiles and delivery locations.'},
          {icon:'fa-chart-line',     color:'#60a5fa', title:'Rate alerts',         desc:'Set your target rate and get notified when reached. Trade at exactly the rate you want.'},
          {icon:'fa-id-card',        color:'#a78bfa', title:'Identity verified',   desc:'All users complete identity verification. No anonymous accounts means a safer community.'},
        ]" :key="f.title" class="p-5 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors" style="background:#161b22;">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" :style="'background:' + f.color + '22;border:1px solid ' + f.color + '44;'">
            <i :class="'fas ' + f.icon" :style="'color:' + f.color"></i>
          </div>
          <h3 class="text-white font-bold mb-1.5">{{ f.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- COMPARISON TABLE -->
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-5">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-gray-900 mb-2" style="font-family:Georgia,serif;">eZimConnect vs Traditional remittance</h2>
        <p class="text-gray-500 text-sm">For AUD 500 sent to Zimbabwe</p>
      </div>
      <div class="rounded-3xl border-2 border-gray-100 overflow-hidden shadow-xl">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b-2 border-gray-100">
              <th class="text-left py-4 px-5 font-semibold text-gray-500">Feature</th>
              <th class="py-4 px-5 text-center">
                <div class="inline-flex items-center gap-1.5">
                  <img src="/images/logo-icon.svg" alt="eZimConnect" class="h-5 w-auto inline">
                </div>
              </th>
              <th class="py-4 px-5 text-center bg-gray-50 font-semibold text-gray-400">Other Providers</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r,i) in [
              ['Platform fee',            '1.5% = AUD 7.50',     '4 to 5 pct plus fixed fee'],
              ['Exchange rate',           'Peer negotiated',     'Bank retail rate'],
              ['AUD protection',          'Full escrow',         'None'],
              ['Delivery proof required', 'ID and cash photo',   'None'],
              ['Dispute resolution',      'Admin mediated',      'Not available'],
              ['Recurring orders',        'Fully automatic',     'Manual each time'],
              ['Your saving on AUD 500',  'Keep AUD 17 more',    'Lose AUD 25 to 30'],
            ]" :key="i" :class="['border-b border-gray-50', i % 2 ? 'bg-gray-50/40' : '']">
              <td class="py-3 px-5 font-medium text-gray-700">{{ r[0] }}</td>
              <td class="py-3 px-5 text-center">
                <span class="inline-flex items-center gap-1.5 font-semibold text-green-700">
                  <i class="fas fa-check-circle text-green-500 text-xs"></i>{{ r[1] }}
                </span>
              </td>
              <td class="py-3 px-5 text-center text-gray-400 bg-gray-50/80">
                <span class="flex items-center justify-center gap-1.5">
                  <i class="fas fa-times-circle text-red-300 text-xs"></i>{{ r[2] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- REVIEWS SLIDER -->
  <section id="reviews" class="py-20" style="background:#fafaf8;">
    <div class="max-w-4xl mx-auto px-5">
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">Community voices</span>
        <h2 class="text-4xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">What our members say</h2>
        <div class="flex items-center justify-center gap-1 mt-2">
          <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-lg"></i>
          <span class="ml-2 text-gray-700 font-semibold">4.9 out of 5</span>
          <span class="text-gray-400 ml-1 text-sm">· 340+ reviews</span>
        </div>
      </div>
      <div class="relative max-w-2xl mx-auto mb-8">
        <transition name="review-slide" mode="out-in">
          <div :key="reviewIndex" class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div class="text-5xl font-black leading-none mb-4" style="color:#f59e0b;font-family:Georgia,serif;">"</div>
            <p class="text-gray-700 text-lg leading-relaxed mb-6 italic" style="font-family:Georgia,serif;">{{ reviews[reviewIndex].text }}</p>
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg', reviews[reviewIndex].color]">
                  {{ reviews[reviewIndex].avatar }}
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ reviews[reviewIndex].name }}</p>
                  <p class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-map-marker-alt text-green-600 text-xs"></i>{{ reviews[reviewIndex].location }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex gap-0.5 justify-end">
                  <i v-for="s in reviews[reviewIndex].stars" :key="s" class="fas fa-star text-yellow-400 text-sm"></i>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ reviews[reviewIndex].date }}</p>
              </div>
            </div>
          </div>
        </transition>
        <button @click="prevReview" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors">
          <i class="fas fa-chevron-left text-sm"></i>
        </button>
        <button @click="nextReview" class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors">
          <i class="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
      <div class="flex justify-center gap-2 mb-8">
        <button v-for="(_,i) in reviews" :key="i" @click="setReview(i)"
          :class="['h-2 rounded-full transition-all', reviewIndex === i ? 'w-8 bg-green-700' : 'w-2 bg-gray-300 hover:bg-gray-400']"></button>
      </div>
      <div class="flex justify-center gap-3 flex-wrap">
        <button v-for="(r,i) in reviews" :key="i" @click="setReview(i)"
          :class="['flex flex-col items-center p-3 rounded-2xl border-2 transition-all min-w-16 cursor-pointer',
            reviewIndex === i ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200']">
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-1.5', r.color]">{{ r.avatar }}</div>
          <p class="text-xs font-semibold text-gray-700">{{ r.name }}</p>
          <div class="flex mt-0.5"><i v-for="s in r.stars" :key="s" class="fas fa-star text-yellow-400 text-xs"></i></div>
        </button>
      </div>
    </div>
  </section>

  <!-- LIVE TRANSACTION FEED -->
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-5">
      <div class="text-center mb-8">
        <span class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live activity
        </span>
        <h2 class="text-3xl font-black text-gray-900" style="font-family:Georgia,serif;">Transactions happening now</h2>
        <p class="text-gray-500 mt-1.5 text-sm">All names anonymised for privacy.</p>
      </div>
      <div class="space-y-2.5">
        <div v-for="(item,i) in (feedItems.length ? feedItems : [
          {display_sender:'T***i from Melbourne', display_receiver:'C***o in Harare',   amount_aud:'450.00', amount_usd:'283.27', completed_at:null},
          {display_sender:'R***o from Sydney',    display_receiver:'F***i in Bulawayo', amount_aud:'700.00', amount_usd:'441.45', completed_at:null},
          {display_sender:'B***g from Brisbane',  display_receiver:'T***a in Mutare',   amount_aud:'200.00', amount_usd:'126.12', completed_at:null},
          {display_sender:'C***e from Perth',     display_receiver:'N***a in Harare',   amount_aud:'550.00', amount_usd:'346.83', completed_at:null},
          {display_sender:'F***i from Adelaide',  display_receiver:'R***o in Gweru',    amount_aud:'350.00', amount_usd:'220.71', completed_at:null},
        ]).slice(0,6)" :key="i"
          class="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition-colors">
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-arrow-right text-green-600 text-xs"></i>
          </div>
          <p class="text-sm text-gray-700 flex-1 flex flex-wrap gap-x-1.5 items-baseline">
            <span class="font-semibold text-gray-900">{{ item.display_sender }}</span>
            <span class="text-gray-400">sent</span>
            <span class="font-bold text-gray-900">{{ fmtAud(item.amount_aud) }}</span>
            <span class="text-gray-400">to</span>
            <span class="font-semibold text-green-700">{{ fmtUsd(item.amount_usd) }}</span>
            <span class="text-gray-400">for</span>
            <span class="font-medium">{{ item.display_receiver }}</span>
          </p>
          <span class="text-xs text-gray-400 flex-shrink-0">{{ fmtDate(item.completed_at) }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA SECTION -->
  <section style="background:linear-gradient(135deg,#0d4a28,#1a6b3c);" class="py-20 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style="background:#f59e0b;"></div>
      <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-8" style="background:#f59e0b;"></div>
    </div>
    <div class="max-w-2xl mx-auto px-5 text-center relative z-10">
      <div class="flex justify-center gap-0.5 mb-5">
        <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-lg"></i>
      </div>
      <h2 class="text-4xl font-black text-white mb-4" style="font-family:Georgia,serif;">
        Ready to save on your next transfer to Zimbabwe?
      </h2>
      <p class="text-green-200 mb-8 text-lg">Join 1,200+ Australians who have already switched. Free account in 2 minutes.</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <router-link to="/register" class="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl" style="background:#f59e0b;color:#1a1a1a;">
          <i class="fas fa-user-plus"></i> Create free account
        </router-link>
        <router-link to="/directory" class="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors">
          <i class="fas fa-users"></i> Browse senders
        </router-link>
      </div>
      <p class="text-green-300 text-xs mt-5 font-medium">No setup fees · No hidden charges · Cancel anytime</p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer style="background:#0d1117;" class="py-14 border-t border-gray-800">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid md:grid-cols-4 gap-8 mb-10">
        <div class="md:col-span-2">
          <div class="mb-4">
            <img src="/images/logo-dark.svg" alt="eZimConnect" class="h-9 w-auto">
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">Peer-to-peer currency exchange for Australians sending money to Zimbabwe. Zero bank fees. Secured by escrow.</p>
          <p class="text-gray-600 text-xs mt-3 flex items-center gap-1.5"><i class="fas fa-lock text-gray-600"></i>NAB Trust Account · AUSTRAC registered</p>
        </div>
        <div>
          <p class="text-white font-semibold text-sm mb-4">Platform</p>
          <div class="space-y-2.5">
            <router-link v-for="l in [{to:'/register',t:'Create account'},{to:'/login',t:'Log in'},{to:'/directory',t:'Browse senders'},{to:'/browse',t:'Open orders'}]" :key="l.t" :to="l.to" class="block text-sm text-gray-400 hover:text-white transition-colors">{{ l.t }}</router-link>
          </div>
        </div>
        <div>
          <p class="text-white font-semibold text-sm mb-4">Company</p>
          <div class="space-y-2.5">
            <router-link to="/how-it-works"    class="block text-sm text-gray-400 hover:text-white transition-colors">How it works</router-link>
            <router-link to="/safety-and-escrow"  class="block text-sm text-gray-400 hover:text-white transition-colors">Safety &amp; Escrow</router-link>
            <router-link to="/privacy"            class="block text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</router-link>
            <router-link to="/terms"              class="block text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</router-link>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="text-gray-600 text-xs">Copyright 2025 eZimConnect Pty Ltd. All rights reserved.</p>
        <div class="flex items-center gap-4 text-gray-600 text-xs">
          <router-link to="/privacy" class="hover:text-gray-400 transition-colors">Privacy</router-link>
          <router-link to="/terms"   class="hover:text-gray-400 transition-colors">Terms</router-link>
        </div>
      </div>
    </div>
  </footer>

  <style>
  .toast-pop-enter-active, .toast-pop-leave-active { transition: all 0.3s ease; }
  .toast-pop-enter { opacity: 0; transform: translateX(-16px) scale(0.95); }
  .toast-pop-leave-to { opacity: 0; transform: translateX(-16px) scale(0.95); }
  .step-fade-enter-active { transition: all 0.3s ease; }
  .step-fade-enter { opacity: 0; transform: translateY(10px); }
  .review-slide-enter-active, .review-slide-leave-active { transition: all 0.4s ease; }
  .review-slide-enter { opacity: 0; transform: translateX(24px); }
  .review-slide-leave-to { opacity: 0; transform: translateX(-24px); }
  @keyframes tuma-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  .tuma-float { animation: tuma-float 3s ease-in-out infinite; }
  </style>
</div>`
}
