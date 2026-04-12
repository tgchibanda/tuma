export default {
    name: 'SmartCalculator',
    props: { amountAud: { type: Number, default: 0 }, rate: Object },
    computed: {
        feePercent() { return parseFloat(this.rate?.platform_fee_percent || 1.5) },
        feeAud() { return parseFloat((this.amountAud * this.feePercent / 100).toFixed(2)) },
        netAud() { return parseFloat((this.amountAud - this.feeAud).toFixed(2)) },
        amountUsd() {
            if (!this.rate?.rate) return 0
            return parseFloat((this.netAud * parseFloat(this.rate.rate)).toFixed(2))
        },
        wuFee() { return parseFloat((this.amountAud * 0.05).toFixed(2)) },
        savings() { return parseFloat((this.wuFee - this.feeAud).toFixed(2)) }
    },
    template: `<div v-if="amountAud > 0" class="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
  <div class="flex justify-between">
    <span class="text-gray-600">Amount you send</span>
    <span class="font-semibold text-gray-900">{{ $fmt.aud(amountAud) }}</span>
  </div>
  <div class="flex justify-between text-gray-500">
    <span>Platform fee ({{ feePercent }}%)</span>
    <span class="text-red-500">- {{ $fmt.aud(feeAud) }}</span>
  </div>
  <div class="flex justify-between border-t border-gray-200 pt-2">
    <span class="text-gray-600">Net amount</span>
    <span class="font-medium">{{ $fmt.aud(netAud) }}</span>
  </div>
  <div class="flex justify-between text-gray-500">
    <span>Guide rate <span class="text-xs text-orange-500 font-medium">(indicative)</span></span>
    <span>1 AUD ≈ {{ rate ? parseFloat(rate.rate).toFixed(4) : '—' }} USD</span>
  </div>
  <div class="flex justify-between bg-green-50 -mx-5 px-5 py-3 rounded-b-2xl border-t border-green-100">
    <span class="font-semibold text-green-800">Estimated receive <span class="text-xs font-normal text-green-600">(guide only)</span></span>
    <span class="font-bold text-green-700 text-base">≈ {{ $fmt.usd(amountUsd) }}</span>
  </div>
  <p class="text-xs text-orange-600 flex items-start gap-1.5 pt-1">
    <i class="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
    The actual USD amount is negotiated between you and the other party when you match.
  </p>
  <div v-if="savings > 0" class="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
    <i class="fas fa-piggy-bank"></i>
    <span>You save approx. <strong>{{ $fmt.aud(savings) }}</strong> vs Other Providers</span>
  </div>
</div>`
}
