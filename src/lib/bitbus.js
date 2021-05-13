const INIT_BLOCK = 683600

class Bitbus {
  constructor(token) {
    this.baseURL = 'https://txo.bitbus.network'
    this.token = token
  }

  crawl(find) {
    const q = {
      find: {
        ...find,
        'blk.i': { '$gte': INIT_BLOCK }
      },
      sort: { 'blk.i': -1 },
      limit: 50
    }

    return fetch(this.baseURL + '/block', {
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
}

export default Bitbus