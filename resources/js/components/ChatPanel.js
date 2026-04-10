export default {
    name: 'ChatPanel',
    props: { matchUlid: String, isClosed: Boolean },
    data() {
        return {
            messages: [], loading: true, sending: false,
            newMessage: '', attachment: null,
            page: 1, meta: null, polling: null
        }
    },
    computed: {
        myId() { return this.$auth.user?.id }
    },
    mounted() {
        this.load()
        if (!this.isClosed) {
            this.polling = setInterval(this.loadNew, 8000)
        }
    },
    beforeDestroy() { clearInterval(this.polling) },
    methods: {
        async load() {
            try {
                const { data } = await this.$http.get(`/matches/${this.matchUlid}/messages?page=${this.page}`)
                this.messages = [...data.data.reverse(), ...this.messages]
                this.meta = data.meta?.pagination
                await this.$http.post(`/matches/${this.matchUlid}/messages/read`)
            } catch (e) {}
            this.loading = false
            this.$nextTick(() => this.scrollBottom())
        },
        async loadNew() {
            try {
                const { data } = await this.$http.get(`/matches/${this.matchUlid}/messages?page=1`)
                const newMsgs = data.data.reverse().filter(m => !this.messages.find(e => e.id === m.id))
                if (newMsgs.length) {
                    this.messages = [...this.messages, ...newMsgs]
                    this.$nextTick(() => this.scrollBottom())
                }
                await this.$http.post(`/matches/${this.matchUlid}/messages/read`)
            } catch {}
        },
        async send() {
            if ((!this.newMessage.trim() && !this.attachment) || this.sending) return
            this.sending = true
            try {
                const fd = new FormData()
                if (this.newMessage.trim()) fd.append('message', this.newMessage)
                if (this.attachment) fd.append('attachment', this.attachment)
                const { data } = await this.$http.post(`/matches/${this.matchUlid}/messages`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                this.messages.push({ ...data.data, is_mine: true, sender: this.$auth.user })
                this.newMessage = ''
                this.attachment = null
                this.$nextTick(() => this.scrollBottom())
            } catch { this.$toast.error('Failed to send message') }
            this.sending = false
        },
        onFile(e) { this.attachment = e.target.files[0] },
        scrollBottom() {
            const el = this.$refs.msgList
            if (el) el.scrollTop = el.scrollHeight
        }
    },
    template: `<div class="border border-gray-200 rounded-2xl overflow-hidden flex flex-col" style="height:420px">
  <!-- Header -->
  <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <i class="fas fa-comments text-green-600"></i>
      <span class="text-sm font-medium text-gray-800">Transaction Chat</span>
    </div>
    <span v-if="isClosed" class="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Closed</span>
  </div>

  <!-- Messages -->
  <div ref="msgList" class="flex-1 overflow-y-auto p-4 space-y-3">
    <loading-spinner v-if="loading" />
    <div v-for="msg in messages" :key="msg.id"
      :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']">
      <div :class="['max-w-xs lg:max-w-sm rounded-2xl px-4 py-2.5 text-sm',
        msg.is_mine ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm']">
        <p>{{ msg.message }}</p>
        <p :class="['text-xs mt-1', msg.is_mine ? 'text-green-200' : 'text-gray-400']">
          {{ msg.created_human }}
          <i v-if="msg.is_mine" :class="['fas ml-1', msg.is_read ? 'fa-check-double text-blue-200' : 'fa-check']"></i>
        </p>
      </div>
    </div>
    <div v-if="!loading && messages.length === 0" class="text-center text-sm text-gray-400 py-8">
      No messages yet. Start the conversation!
    </div>
  </div>

  <!-- Input -->
  <div v-if="!isClosed" class="px-3 py-2 border-t border-gray-200 bg-white flex items-end gap-2">
    <label class="cursor-pointer text-gray-400 hover:text-green-600 p-1.5">
      <i class="fas fa-paperclip"></i>
      <input type="file" class="hidden" accept="image/*,.pdf" @change="onFile">
    </label>
    <div class="flex-1">
      <div v-if="attachment" class="text-xs text-green-700 mb-1 flex items-center gap-1">
        <i class="fas fa-paperclip"></i> {{ attachment.name }}
        <button @click="attachment=null" class="ml-1 text-red-400"><i class="fas fa-times"></i></button>
      </div>
      <textarea v-model="newMessage" @keydown.enter.exact.prevent="send"
        placeholder="Type a message…"
        class="w-full text-sm border-0 resize-none outline-none bg-transparent"
        rows="1"></textarea>
    </div>
    <button @click="send" :disabled="sending || (!newMessage.trim() && !attachment)"
      class="w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-green-700 flex-shrink-0">
      <i class="fas fa-paper-plane text-sm"></i>
    </button>
  </div>

  <div v-if="isClosed" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
    This transaction is complete. Chat has been closed.
  </div>
</div>`
}
