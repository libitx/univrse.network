class BitFS {
  constructor() {
    this.baseURL = 'https://x.bitfs.network'
    this.cache = {}
  }

  get(uri) {
    if (this.cache[uri]) return this.cache[uri];
    
    return fetch(this.baseURL + '/' + uri)
      .then(res => res.arrayBuffer())
      .then(buf => {
        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
        this.cache[uri] = b64
        return b64
      })
  }

  async map(txo) {
    let out, uri
    for (let vout = 0; vout < txo.out.length; vout++) {
      out = txo.out[vout]
      for (let i = 0; i < out.len; i++) {
        if (uri = out['f'+i]) {
          const data = await this.get(uri)
          out['b' + i] = data
        }
      }
    }
  }
}

export default BitFS