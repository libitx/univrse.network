---
title: Envelope spec
---

# Envelope spec

## Introduction

A Univrse Envelope is a structure for encoding any arbitrary data payload for data interchange and/or storage.

An Envelope consists of a set of headers and a data payload. Optionally one or more [Signature](/docs/signature) structures may be used to protect data integrity with digital signature and MAC algorithms. And optionally, one or more [Recipient](/docs/recipient) structures may be used to ensure confidentiality of the data payload using encryption algorithms.

## Structure

A Univrse Envelope described using Concise Data Definition Language:

```elixir
Envelope = [
  header: Header,
  payload: bytes,
  ? signature: Signature / [+Signature],
  ? recipient: Recipient / [+Recipient]
]

Header = {
  ? crit: [+text],
  ? cty: text,
  ? proto: text / bytes,
  ? zip: text,
  * text => any
}
```

## Headers

A Univrse Envelope may contain any of the following headers. It may also contain any other arbitrary key-value headers.

| Header  | Description           | Required |
| ------- | --------------------- | -------- |
| `crit`  | Critical headers      |          |
| `cty`   | Content type          |          |
| `proto` | Protocol identifier   |          |
| `zip`   | Compression algorithm |          |

## Serialisation

A Univrse Envelope can be serialised into several formats appropriate for data interchange or storage.

* CBOR encoding
* String encoding
* Bitcoin script

### CBOR encoding

The most concise serialisation option, serialises the entire Envelope structure to a single CBOR-encoded binary, as specified by the CDDL schema above.

### String encoding

String encoding is useful for storing the Univrse Envelope in a text-based store such as browser local storage.

String encoding takes each part of the envelope (header, payload, signature, recipient), then in turn CBOR then Base64-url encodes each part, before concatenating it back together in the same order, delimited by the `.` character.

### Bitcoin script

A Universe Envelope can be encoded within a Bitcoin script using the following conventions:

* The script must return with `OP_RETURN`.
* The next push data must be the 4 bytes making up the UTF-8 text, `"UNIV"`.
* The following 2 to 4 push datas must be the Envelope header, payload, signature and recipient parts, each CBOR-encoded.

### Example

```javascript
// Create and sign envelope
const env = Envelope.wrap('Hello world!', { cty: 'text/plain' })
await env.sign(key, { alg: 'ES256K', kid: '1addr' })

// CBOR encoding
env.toBuffer()
// => <Buffer 83 a1 63 63 74 79 6a 74 65 78 74 2f 70 6c 61 69 6e 6c 48 65
//            6c 6c 6f 20 77 6f 72 6c 64 21 82 a2 63 61 6c 67 66 45 53 32
//            35 36 4b 63 6b 69 64 65 31 61 ... 70 more bytes>

// String encoding
env.toString()
// => oWNjdHlqdGV4dC9wbGFpbg.bEhlbGxvIHdvcmxkIQ.gqJjYWxnZkVTMjU2S2NraWRlM
//    WFkZHJYQSAa-R5YjKeElqIiFWsM-goxAD2BaOu81ZSUiSh0VUKetUlw9FqPo27kpCBL
//    810AtsRogK_ANNTweK3g7E-L7JDU

// Bitcoin script
env.toScript().toAsmString()
// => 0 OP_RETURN 554e4956 a1636374796a746578742f706c61696e
//    6c48656c6c6f20776f726c6421
//    82a263616c676645533235364b636b696465316164647258411fb39ba74d4b96f40c6e1c082ff0fdd0388476b955fb818cac56d0377036e445dc5de5f298f786d33213adb33cf6ffe61f3a89d7464aed4de9c1e28d9d8a12334e
```
