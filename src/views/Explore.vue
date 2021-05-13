<template>
  <div class="mb3 pv4">
    <h1 class="mt0 mb2 f-subheadline fw1 ttu tracked-mega white-90 tc">
      <router-link to="/">
        <img src="/univrse.png" width="235" alt="Univrse" />
      </router-link>
    </h1>
    <p class="ma0 f7 fw3 tc">
      <router-link to="/" class="link white-80 hover-hot-pink">&larr; Back to home</router-link>
    </p>
  </div>

  <div class="mw7 pv3 center">
    <div class="">
      <label for="search" class="db mb2 f7 fw3 tracked lh-copy white-70 tc">Search by TXID</label>
      <input type="text" id="search"
        class="input-reset w-100 pa2 ph3 code f5 lh-copy white bg-transparent ba b--white-30 br2"
        v-model="txid">
    </div>
  </div>

  <div class="mw7 pv3 center">
    <Builder class="mb4" />
    <ul class="list ma0 mv3 pa0">
      <li v-for="e in envs" :key="e.out" class="mb3">
        <Envelope :env="e.env" :out="e.out" :timestamp="e.t" />
      </li>
    </ul>
  </div>

  <div class="mw7 pt4 pb3 center">
    <p class="mv1 f7 lh-copy fw3 white-60 tc">
      Univrse Explorer powered by Bitbus, Bitsocket and BitFS.
    </p>
    <p class="mv1 f7 lh-copy fw3 white-60 tc">
      &copy; Copyright 2021 Chronos Labs Ltd
    </p>
  </div>
</template>

<script>
import Bitbus from '../lib/bitbus.js'
import Bitsocket from '../lib/bitsocket.js'
import BitFS from '../lib/bitfs.js'
import Builder from '../components/Builder.vue'
import EnvelopeComponent from '../components/Envelope.vue'

const { Envelope } = Univrse

const token = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxNFZ1YmF5NmJSRTdLM2tTSHp2SGhTVVhZcmRrU3BzVFFEIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SDZ1WUE0ZDYxOHU2N0VRazYvL011U2FFdysvYzNxRlRtc2VoaFJWYnpOM3lYbk5MN2tFMDRkSGR1cTRTWHo1aVN0dlB3ZG5RYzdOaGplblpRYm1SWVZFPQ'

export default {
  data() {
    return {
      envs: [],
      txid: null,
      query: {
        'out.s2': 'UNIV'
      }
    }
  },

  created() {
    this.$bitbus = new Bitbus(token)
    this.$bitsocket = new Bitsocket(token)
    this.$bitfs = new BitFS()
    this.crawl()
    this.listen()
  },

  watch: {
    txid(val) {
      if (val && val.match(/^[a-f0-9]{64}$/i)) {
        this.$bitsocket.close()
        this.query['tx.h'] = val
        this.crawl()
      } else if (val === null || val === '') {
        delete this.query['tx.h']
        this.crawl()
        this.listen()
      }
    }
  },

  methods: {
    crawl() {
      this.envs = []
      this.$bitbus.crawl(this.query)
        .then(results => this.handleResults(results))
      this.$bitsocket.crawl(this.query)
        .then(results => this.handleResults(results))
    },

    listen() {
      this.$bitsocket.listen(this.query, results => {
        this.handleResults(results)
      })
    },

    handleResults(results) {
      results.forEach(async txo => {
        await this.$bitfs.map(txo)
        const tx = Shapeshifter.toTx(txo)
        tx.txOuts.forEach((o, i) => {
          try {
            const t = txo.timestamp ? Math.round(txo.timestamp / 1000) : txo.blk.t
            const out = `${ txo.tx.h }.out.${ i }`
            const env = Envelope.fromScript(o.script)
            this.push({ out, env, t })
          } catch(e) {}
        })
      })
    },

    push(env) {
      if (!this.envs.some(({ out }) => out === env.out )) {
        const i = this.envs.findIndex(({ t }) => t < env.t)
        if (i >= 0) {
          this.envs.splice(i, 0, env)
        } else {
          this.envs.push(env)
        }
        this.envs = this.envs.slice(0, 50)
      }
    }
  },

  components: {
    Builder,
    Envelope: EnvelopeComponent
  }
}
</script>

<style>

</style>