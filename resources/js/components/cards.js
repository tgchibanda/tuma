// ── OrderCard ─────────────────────────────────────────────────────────────
export const OrderCard = {
    props: { order: Object, showOwner: { default: false } },
    template: `<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg',
          order.order_type==='send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
          <i :class="['fas mr-1', order.order_type==='send_to_zim' ? 'fa-paper-plane' : 'fa-hand-holding-usd']"></i>
          {{ order.order_type==='send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
        </span>
        <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          <i class="fas fa-bolt mr-0.5"></i> Boosted
        </span>
        <status-badge :status="order.status" />
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span class="text-xl font-bold text-gray-900">{{ $fmt.aud(order.amount_aud) }}</span>
        <span class="text-sm text-gray-400">↔ {{ $fmt.usd(order.amount_usd) }}</span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <i class="fas fa-map-marker-alt text-green-600"></i>
        {{ order.delivery_location?.name }}
        <span v-if="order.delivery_location?.province" class="text-gray-400">· {{ order.delivery_location.province }}</span>
      </div>
    </div>
    <div v-if="showOwner && order.owner" class="text-right flex-shrink-0">
      <user-avatar :user="order.owner" size="sm" />
      <div class="mt-1 flex items-center gap-1 justify-end">
        <i class="fas fa-star text-yellow-400 text-xs"></i>
        <span class="text-xs text-gray-600">{{ order.owner.rating || 'New' }}</span>
      </div>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-between">
    <span class="text-xs text-gray-400">
      <i class="far fa-clock mr-1"></i>{{ order.created_human || $fmt.date(order.created_at) }}
    </span>
    <router-link :to="'/orders/'+order.ulid"
      class="text-xs font-medium text-green-700 hover:text-green-800">View →</router-link>
  </div>
</div>`
}

// ── MatchCard ─────────────────────────────────────────────────────────────
export const MatchCard = {
    props: { match: Object },
    template: `<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-center justify-between gap-3">
    <div class="flex-1">
      <div class="flex items-center gap-2 flex-wrap">
        <status-badge :status="match.status" />
        <span v-if="match.delivery_method && match.delivery_method !== 'pending'"
          :class="['text-xs px-2 py-0.5 rounded-full font-medium',
            match.delivery_method==='secure' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
          <i :class="['fas mr-0.5', match.delivery_method==='secure' ? 'fa-shield-alt' : 'fa-exclamation-triangle']"></i>
          {{ match.delivery_method === 'secure' ? 'Secure' : 'Risk' }}
        </span>
        <span v-if="match.unread_messages" class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
          {{ match.unread_messages }} new
        </span>
      </div>
      <div v-if="match.agreed_aud" class="mt-2">
        <span class="text-lg font-bold text-gray-900">{{ $fmt.aud(match.agreed_aud) }}</span>
        <span class="text-sm text-gray-400 ml-1">↔ {{ $fmt.usd(match.agreed_usd) }}</span>
      </div>
      <div v-else-if="match.proposed_aud" class="mt-2 text-sm text-gray-600">
        Proposed: {{ $fmt.aud(match.proposed_aud) }} ↔ {{ $fmt.usd(match.proposed_usd) }}
      </div>
      <p class="text-xs text-gray-400 mt-1">
        <i class="far fa-clock mr-1"></i>{{ $fmt.datetime(match.created_at) }}
      </p>
    </div>
    <router-link :to="'/matches/'+match.ulid"
      class="flex-shrink-0 px-4 py-2 bg-green-700 text-white text-xs font-medium rounded-xl hover:bg-green-800 transition">
      View
    </router-link>
  </div>
</div>`
}

export default { OrderCard, MatchCard }
