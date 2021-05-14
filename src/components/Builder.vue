<template>
  <div :class="{'modal-show': show}">
    <a class="db w4 center ph3 pv2 link f4 fw2 white-90 bg-animate hover-bg-white-10 ba b--white-30 br2 tc pointer"
      @click="open()">
      Try Univrse
    </a>

    <div class="fixed top-0 bottom-0 left-0 right-0 z-4 flex flex-column justify-center bg-black-60 | modal-bg"
      @click.self="close()">
      <div class="w-100 mw7 center ph3 ph4-ns ph5-l | modal">
        <div class="pa4 bg-black ba b--white-40">
          <p class="mt0 mb4 f6 lh-copy fw3 white-80 tc">
            Try <span class="white">Univrse</span> out by creating your own
            data envelope. Add some content to the payload, choose whether to
            sign and/or encrypt the payload, and tap the button.
          </p>

          <div class="flex bg-white-10">
            <div class="w2 pv4 f7 fw4 white-80 ttu bg-white-20">
              <div class="heading">Payload</div>
            </div>
            <div class="flex-auto">
              <textarea class="input-reset w-100 pa2 ph3 code f6 lh-copy white-80 bg-transparent bn outline-0"
                ref="form"
                rows="3"
                v-model="payload" />
            </div>
          </div>

          <div>
            <ul class="list mv3 pa0 f6 lh-copy fw3 white-80">
              <li class="mb1 ph2">
                <label>
                  <input type="checkbox" v-model="sign" class="mr2 v-mid">
                  Sign payload
                </label>
              </li>
              <li class="mb1 ph2">
                <label>
                  <input type="checkbox" v-model="encrypt" class="mr2 v-mid">
                  Encrypt payload
                </label>
              </li>
            </ul>
          </div>

          <div class="flex items-center">
            <a class="db w4 ph3 pv2 link f4 fw2 white-90 ba b--white-30 br2 tc pointer"
              @click="create()">
              Create
            </a>
            <span class="flex-auto ph3 f7 fw3 i white-60">Accept Money Button permissions when prompted.</span>
            <a class="f7 fw6 link light-red hover-hot-pink pointer"
              @click="close()">
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { Envelope, Signature, Recipient } = window.Univrse

export default {
  data() {
    return {
      show: false,
      payload: null,
      sign: true,
      encrypt: false
    }
  },

  methods: {
    open() {
      this.payload = null
      this.show = true
      setTimeout(_ => {
        this.$refs.form.focus()
      }, 250)
      
    },

    close() {
      this.show = false
    },

    async create() {
      const env = Envelope.wrap(this.payload, { proto: 'univrse.demo' })
      const imb = new window.moneyButton.IMB({
        clientIdentifier: '07a24628aa41070553073e5bc2e9b6cb',
        suggestedAmount: {
          amount: '0.01',
          currency: 'USD'
        },
        permission: localStorage.getItem('UNIV_IMB_TOKEN'),
        onNewPermissionGranted(token) {
          localStorage.setItem('UNIV_IMB_TOKEN', token)
        }
      })

      if (this.sign) {
        await imb.swipe({
          cryptoOperations: [{
            method: 'sign',
            name: 'sig',
            data: env.encodedPayload.toString('hex'),
            dataEncoding: 'hex',
            key: 'identity',
            algorithm: 'bitcoin-signed-message'
          }, {
            method: 'paymail',
            name: 'address',
            key: 'identity'
          }]
        }).then(({ cryptoOperations }) => {
          const b64sig = cryptoOperations.find(o => o.name === 'sig').value
          const sig = Uint8Array.from(atob(b64sig), c => c.charCodeAt(0))
          const address = cryptoOperations.find(o => o.name === 'address').value
          const signature = Signature.wrap(sig, { alg: 'ES256K-BSM', kid: address })
          env.pushSignature(signature)
        })
      }

      if (this.encrypt) {
        await imb.swipe({
          cryptoOperations: [{
            method: 'encrypt',
            name: 'cipher',
            data: env.encodedPayload.toString('hex'),
            dataEncoding: 'hex',
            key: 'identity',
            algorithm: 'electrum-ecies'
          }, {
            method: 'paymail',
            name: 'address',
            key: 'identity'
          }]
        }).then(({ cryptoOperations }) => {
          const hexcipher = cryptoOperations.find(o => o.name === 'cipher').value
          const cipher = Uint8Array.from(hexcipher.match(/.{1,2}/g), byte => parseInt(byte, 16))
          const address = cryptoOperations.find(o => o.name === 'address').value
          env.payload = cipher
          const recipient = Recipient.wrap(null, { alg: 'ECDH-BIE1', kid: address })
          env.pushRecipient(recipient)
        })
      }

      return imb.swipe({
        outputs: [{
          amount: 0,
          currency: 'BSV',
          script: env.toScript().toAsmString()
        }],
        onPayment: _ => this.close(),
        onError: e => {
          alert('An error occurred. Please check browser console.')
          console.log(e)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.modal-bg {
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease-in;
}

.modal {
  transform: scale(0.9) translateY(-200px);
  transition: transform 300ms ease-out;
}

.modal-show {
  .modal-bg {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    transform: scale(1) translateY(0);
  }
}
</style>