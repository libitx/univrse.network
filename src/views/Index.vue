<template>
  <div class="pv5 ph4">
    <h1 class="mt4 mb5 f-subheadline fw1 ttu tracked-mega white-90 tc">
      <img src="/univrse.png"
        srcset="/univrse.png 1x, /univrse@2x.png 2x"
        alt="Univrse" />
    </h1>
    <h2 class="mv0 f3 f2-ns fw1 white-70 tc">Universal schema for data serialization, signing and encryption</h2>
  </div>

  <div class="pb5 ph4 flex items-center justify-center">
    <router-link to="/explore"
      class="dib w4 mh3 ph3 pv2 link f3 fw2 white-90 bg-animate hover-bg-white-10 ba b--white-30 br2 tc">
      Explore
    </router-link>
    <span class="mh3 f7 white-50">&bullet;</span>
    <router-link to="/docs"
      class="dib w4 mh3 ph3 pv2 link f3 fw2 white-90 bg-animate hover-bg-white-10 ba b--white-30 br2 tc">
      Learn
    </router-link>
  </div>

  <div class="mt4 pv5 pb6-l bt b--white-10">
    <div class="flex-ns flex-wrap-ns mw8 center">
      <div class="w-third-l mb4 ph4">
        <h3 class="mt0 mb3 f3 lh-title fw6 white-70 tc">Data serialization</h3>
        <p class="ma0 f5 lh-copy fw3 white-60 tc">Simple, binary-friendly data exchange using the Concise Binary Object Representation (CBOR) data format.</p>
      </div>
      <div class="w-50-ns w-third-l mb4 ph4">
        <h3 class="mt0 mb3 f3 lh-title fw6 white-70 tc">Signatures</h3>
        <p class="ma0 f5 lh-copy fw3 white-60 tc">Protect integrity of data with digital signatures or message authentication code (MAC) algorithms.</p>
      </div>
      <div class="w-50-ns w-third-l mb4 ph4">
        <h3 class="mt0 mb3 f3 lh-title fw6 white-70 tc">Encryption</h3>
        <p class="ma0 f5 lh-copy fw3 white-60 tc">Ensure confidentiality and integrity of data for one or multiple recipients, using authenticated encryption.</p>
      </div>
    </div>
  </div>

  <div class="mw7 pb4 center">
    <p class="mv1 f7 lh-copy fw3 white-60 tc">
      Univrse Explorer powered by Bitbus, Bitsocket and BitFS.
    </p>
    <p class="mv1 f7 lh-copy fw3 white-60 tc">
      &copy; Copyright 2021 Chronos Labs Ltd
    </p>
  </div>
</template>

<script setup>


// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>

</style>