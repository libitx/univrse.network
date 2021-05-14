<template>
  <div class="ph2 ba b--white-20">

    <div class="flex-ns items-center mv2 pv2 bg-white-10">
      <div class="flex-auto-ns ph2 mb1 mb0-ns code f7 fw3 white-70 overflow-hidden">
        <a class="link white-70 hover-white" :href="wocLink" target="_blank">{{ out }}</a>
      </div>
      <div class="ph2 code f7 fw3 white-50">{{ dateTime }}</div>
    </div>

    <div class="flex mv2 bg-white-10">
      <div class="w2 pv4 f7 fw7 white-90 ttu bg-blue">
        <div class="heading">Header</div>
      </div>
      <pre class="flex-auto self-center ma0 pv2 ph3 code f7 lh-copy fw3 white-50 pre-wrap">{{ formatted(env.header.headers) }}</pre>
    </div>

    <div class="flex mv2 bg-white-10">
      <div class="w2 pv4 f7 fw7 white-90 ttu bg-green">
        <div class="heading">Payload</div>
      </div>
      <pre class="flex-auto self-center ma0 pv2 ph3 code f7 fw3 white-70 pre-wrap">{{ formatted(env.payload) }}</pre>
    </div>

    <div class="flex mv2 bg-white-10" v-if="signatures.length">
      <div class="w2 pv4b f7 fw7 white-90 ttu bg-hot-pink">
        <div class="heading">Signatures</div>
      </div>
      <div class="flex-auto pa2">
        <div class="dt w-100 white-50" style="table-layout:fixed;">
          <div class="dt-row f7 lh-copy fw7 ttu white-70">
            <div class="dtc pa2">Header</div>
            <div class="dtc pa2">Signature</div>
          </div>
          <div class="dt-row pv2 white-70" v-for="sig in signatures">
            <div class="dtc pa2 bt b--white-20">
              <pre class="w-100 ma0 pa0 code f7 lh-copy fw3 white-50 pre-wrap">{{ formatted(sig.header.headers) }}</pre>
            </div>
            <div class="dtc pa2 bt b--white-20">
              <pre class="w-100 ma0 pa0 code f7 lh-copy fw3 white-50 pre-wrap">{{ formatted(sig.signature) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mv2 bg-white-10" v-if="recipients.length">
      <div class="w2 pv4b f7 fw7 white-90 ttu bg-purple">
        <div class="heading">Recipients</div>
      </div>
      <div class="flex-auto pa2">
        <div class="dt w-100 white-50" style="table-layout:fixed;">
          <div class="dt-row f7 lh-copy fw7 ttu white-70">
            <div class="dtc pa2">Header</div>
            <div class="dtc pa2">Key</div>
          </div>
          <div class="dt-row pv2 white-70" v-for="rec in recipients">
            <div class="dtc pa2 bt b--white-20">
              <pre class="w-100 ma0 pa0 code f7 lh-copy fw3 white-50 pre-wrap">{{ formatted(rec.header.headers) }}</pre>
            </div>
            <div class="dtc pa2 bt b--white-20">
              <pre class="w-100 ma0 pa0 code f7 lh-copy fw3 white-50 pre-wrap">{{ formatted(rec.key) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    env: { type: Object, required: true },
    out: { type: String, required: true },
    timestamp: { type: Number, required: true }
  },

  computed: {
    wocLink() {
      const txid = this.out.substring(0, 64)
      return `https://whatsonchain.com/tx/${ txid }`
    },

    dateTime() {
      const date = new Date(this.timestamp * 1000)
      return `${ date.getFullYear() }-${ this.padDate(date.getMonth()+1) }-${ this.padDate(date.getDate()) } ${ this.padDate(date.getHours()) }:${ this.padDate(date.getMinutes()) }`
    },

    signatures() {
      if (Array.isArray(this.env.signature)) {
        return this.env.signature
      } else if (this.env.signature) {
        return [this.env.signature]
      } else {
        return []
      }
    },

    recipients() {
      if (Array.isArray(this.env.recipient)) {
        return this.env.recipient
      } else if (this.env.recipient) {
        return [this.env.recipient]
      } else {
        return []
      }
    }
  },

  methods: {
    padDate(init) {
      return init.toString().padStart(2, 0)
    },

    // Recursively iterate through object, normalising arrays/buffers
    formatted(val) {
      val = JSON.parse(JSON.stringify(val))
      if (val && val.constructor.name === 'Buffer') {
        val = { type: 'Buffer', data: val.toString('base64') }
      } else if (val && typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
        val.data = btoa(String.fromCharCode(...val.data));
      } else if (val && Array.isArray(val) ) {
        val = val.map(v => this.formatted(v))
      } else if (val && typeof val === 'object') {
        val = Object.keys(val).reduce((tgt, key) => {
          tgt[key] = this.formatted(val[key])
          return tgt;
        }, {})
      }
      return val
    }
  }
}
</script>

<style lang="scss">
.heading {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  margin: 0 -10px;
}

.pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.pv4b {
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
}
</style>