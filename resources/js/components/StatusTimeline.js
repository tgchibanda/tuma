export default {
    name: 'StatusTimeline',
    props: { match: Object },
    computed: {
        steps() {
            const m = this.match || {}
            const isSecure = m.delivery_method === 'secure' || m.delivery_method === 'pending'
            const steps = [
                { key: 'proposed',     label: 'Match Proposed',     icon: 'fa-handshake', done: true },
                { key: 'rate_agreed',  label: 'Rate Agreed',        icon: 'fa-check-double',
                  done: !['proposed','negotiating'].includes(m.status) },
                { key: 'delivery_method', label: 'Delivery Method', icon: isSecure ? 'fa-shield-alt' : 'fa-exclamation-triangle',
                  done: m.delivery_method_agreed, active: m.status === 'delivery_method_selecting' },
            ]

            if (isSecure || m.delivery_method === 'pending') {
                steps.push(
                    { key: 'deposit', label: 'AUD Deposited', icon: 'fa-dollar-sign',
                      done: ['deposit_verified','awaiting_delivery','delivery_uploaded','awaiting_confirmation','confirmed','releasing','completed'].includes(m.status),
                      active: ['awaiting_deposit','deposit_uploaded'].includes(m.status) },
                    { key: 'delivery', label: 'Cash Delivered', icon: 'fa-money-bill-wave',
                      done: ['awaiting_confirmation','confirmed','releasing','completed'].includes(m.status),
                      active: ['awaiting_delivery','delivery_uploaded'].includes(m.status) }
                )
            } else {
                steps.push(
                    { key: 'risk_delivery', label: 'Cash Delivered First', icon: 'fa-money-bill-wave',
                      done: ['risk_confirmed','awaiting_risk_deposit','risk_deposit_uploaded','risk_deposit_verified','releasing','completed'].includes(m.status),
                      active: ['awaiting_risk_delivery','risk_delivery_uploaded','awaiting_risk_confirmation'].includes(m.status) },
                    { key: 'risk_deposit', label: 'AUD Deposited', icon: 'fa-dollar-sign',
                      done: ['risk_deposit_verified','releasing','completed'].includes(m.status),
                      active: ['awaiting_risk_deposit','risk_deposit_uploaded'].includes(m.status) }
                )
            }
            steps.push(
                { key: 'confirmed', label: 'Receipt Confirmed', icon: 'fa-thumbs-up',
                  done: ['confirmed','releasing','completed'].includes(m.status) },
                { key: 'completed', label: 'Funds Released', icon: 'fa-check-circle',
                  done: m.status === 'completed', active: m.status === 'releasing' }
            )
            return steps
        }
    },
    template: `<div class="relative">
  <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
  <div class="space-y-4">
    <div v-for="(step, i) in steps" :key="step.key" class="flex items-start gap-4 relative">
      <div :class="['relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
        step.done ? 'bg-green-600' : step.active ? 'bg-blue-600 animate-pulse' : 'bg-gray-200']">
        <i :class="['fas text-xs', step.icon, step.done || step.active ? 'text-white' : 'text-gray-400']"></i>
      </div>
      <div class="pt-1 pb-4">
        <p :class="['text-sm font-medium', step.done ? 'text-gray-900' : step.active ? 'text-blue-700' : 'text-gray-400']">
          {{ step.label }}
        </p>
        <p v-if="step.active" class="text-xs text-blue-600 mt-0.5">In progress</p>
      </div>
    </div>
  </div>
</div>`
}
