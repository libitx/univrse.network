---
title: Recipient spec
---

# Recipient spec

## Introduction

A Univrse Recipient is a structure attached to an Envelope that helps the intended recipient(s) decrypt the encrypted payload. An encrypted Envelope may contain one or multiple Recipient structures.

Where the Envelope is intended for a single recipient, the Recipient structure is merely a set of headers that helps the intended recipient identify what key and algorithm is needed to decrypt the payload.

Where the Envelope is intended for multiple recipients, a Recipient structure may also contain an encrypted Key. In this case, the intended recipient must decrypt the content encryption key, which they can then use to decrypt the payload.

## Structure

A Univrse Recipient described using Concise Data Definition Language:

```elixir
Recipient = [
  header: Header,
  key: bytes / nil
]

Header = {
  alg: text,
  ? epk: bytes,
  ? iv: bytes,
  ? kid: text,
  ? tag: bytes,
  * text => any
}
```

## Headers

A Univrse Recipient may contain any of the following headers. It may also contain any other arbitrary headers.

| Header | Description           | Required |
| ------ | --------------------- | -------- |
| `alg`  | Encryption algorithm  | ✅       |
| `epk`  | Ephemeral public key  |          |
| `iv`   | Initialization vector |          |
| `kid`  | Key ID                |          |
| `tag`  | Authentication tag    |          |

## Multiple recipients

Where an envelope contains multiple Recipient structures, the following convention applies:

* The first Recipient (Recipient 0) represents the content encryption key, and thus the `alg` header specified in the first Recipient structure indicates the algorithm used to encrypt the Envelope payload.
* Each subsequent Recipient represents a unique intended recipient, and it's Recipient structure contains an encrypted key (the key from Recipient 0). The content encryption key can be decrypted using the Recipient's specified algorithm and then the payload can be decrypted using the algorithm specified in Recipient 0.

## Algorithms

The following encryption algorithms can be used with Univrse Recipients.

| Algorithm         | Description                                                                                                 | Key type |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `A128CBC-HS256`   | `AES-128-CBC` encryption algorithm authenticated with `HMAC-SHA256`                                         | `oct`    |
| `A256CBC-HS512`   | `AES-256-CBC` encryption algorithm authenticated with `HMAC-SHA512`                                         | `oct`    |
| `A128GCM`         | `AES-128-GCM` authenticated encryption algorithm                                                            | `oct`    |
| `A256GCM`         | `AES-256-GCM` authenticated encryption algorithm                                                            | `oct`    |
| `ECDH-ES+A128GCM` | Diffie-Hellman Ephemeral key agreement using Concat KDF<br>`AES-128-GCM` authenticated encryption algorithm | `EC`     |
| `ECDH-ES+A256GCM` | Diffie-Hellman Ephemeral key agreement using Concat KDF<br>`AES-256-GCM` authenticated encryption algorithm | `EC`     |
| `ECIES-BIE1`      | Electrum ECIES encryption algorithm, `BIE1`                                                                 | `EC`     |