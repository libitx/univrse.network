class Bitsocket {
  constructor(token) {
    this.baseURL = 'https://txo.bitsocket.network'
    this.token = token
    this.socket = null
    this.lastEventId = null
  }

  crawl(find) {
    const q = {
      find: {
        ...find,
        timestamp: { '$gte': Date.now() - 3600000 }
      },
      sort: { timestamp: -1 },
      limit: 50
    }

    return fetch(this.baseURL + '/crawl', {
      method: 'post',
      headers: {
        'Accept': 'application/x-ndjson',
        'Content-type': 'application/json; charset=utf-8',
        'token': this.token
      },
      body: JSON.stringify({ q })
    })
    .then(res => res.text())
    .then(res => {
      return res
        .split('\n')
        .filter(l => l.length)
        .map(l => JSON.parse(l))
    })
  }

  listen(find, callback) {
    this.close()

    const b64 = btoa(JSON.stringify({ q: { find } }))
    this.socket = new EventSource(this.baseURL + '/s/' + b64, {
      headers: { "Last-Event-ID": this.lastEventId }
    })

    this.socket.onmessage = msg => {
      if (msg.lastEventId !== 'undefined') {
        this.lastEventId = msg.lastEventId
      }
      try {
        const { data, type } = JSON.parse(msg.data)
        if (type === 'push') callback(data);
      } finally {}
    }
  }

  close() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

export default Bitsocket