<template>
  <div class="relative flex-l min-vh-100">

    <div class="bb bb-0-l br-l b--white-10 | side-column">
      <div class="fixed-l pa4">
        <div class="pv4">
          <h1 class="mt0 mb3 f-subheadline fw1 ttu tracked-mega white-90 tc">
            <router-link to="/">
              <img src="/univrse.png" width="235" alt="Univrse" class="db center" />
            </router-link>
          </h1>
          <p class="ma0 f7 fw3 tc">
            <router-link to="/" class="link white-80 hover-hot-pink">&larr; Back to home</router-link>
          </p>
        </div>

        <div class="flex-m pv4-l">
          <div class="w-50-m pr3-m mb4 mb0-ns mb5-l">
            <h4 class="mt0 mb2 f5 lh-title fw6 white-80">Developing with Univrse</h4>
            <ul class="list ma0 pa0 f5 lh-copy fw3">
              <li>
                <router-link to="/docs/introduction" class="db pv1 link white-80">Introduction</router-link>
              </li>
              <li>
                <router-link to="/docs/javascript" class="db pv1 link white-80">JavaScript library</router-link>
              </li>
              <li>
                <router-link to="/docs/elixir" class="db pv1 link white-80">Elixir library</router-link>
              </li>
            </ul>
          </div>
          <div class="w-50-m pl3-m">
            <h4 class="mt0 mb2 f5 lh-title fw6 white-80">Univrse Specification</h4>
            <ul class="list ma0 pa0 f5 lh-copy fw3">
              <li>
                <router-link to="/docs/envelope" class="db pv1 link white-80">Envelope</router-link>
              </li>
              <li>
                <router-link to="/docs/signature" class="db pv1 link white-80">Signature</router-link>
              </li>
              <li>
                <router-link to="/docs/recipient" class="db pv1 link white-80">Recipient</router-link>
              </li>
              <li>
                <router-link to="/docs/key" class="db pv1 link white-80">Key</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-auto-l ph4 pv5 bt bt-0-l bl-l b--black">
      <div class="mw7 center">
        <router-view ref="content" />
      </div>
      <div class="mw7 pt5 pb3 center">
        <p class="mv1 f7 lh-copy fw3 white-60">
          &copy; Copyright 2021 Chronos Labs Ltd.
          <br>Univrse is open source and released under the <a href="https://choosealicense.com/licenses/apache-2.0/" class="link underline fw4 white-70 hover-hot-pink">Apache-2 License</a>.
          <br>Univrse documentation is published under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="link underline fw4 white-70 hover-hot-pink">CC BY-SA License</a>.
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  created() {
    this.redirectIfDocsRoot()
  },

  watch: {
    '$route.path'(_path) {
      this.redirectIfDocsRoot()
    }
  },

  methods: {
    redirectIfDocsRoot() {
      if (this.$route.path === '/docs') {
        this.$router.replace('/docs/introduction')
      }
    }
  }
}
</script>

<style lang="scss">
.side-column {
  //position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10;
  
  background: rgba(#fff, 0.05);

  @media screen and (min-width: 60em) {
    width: 20rem;
  }

  a {
    outline: none !important;

    &:hover {
      color: #FF41B4;
    }

    &.router-link-active {
      font-weight: 600;
      color: #96CCFF;
    }
  }
}
</style>