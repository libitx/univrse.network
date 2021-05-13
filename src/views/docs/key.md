---
title: Key spec
---

# Key spec

## Introduction

A Univrse Key is a CBOR data structure that represents a cryptographic key. Univrse Keys closely mirror JSON Web Keys, and it should prove simple to convert keys between the two specifications.

Keys are used in the [Univrse Signature](/docs/signature) and [Univrse Recipient](/docs/recipient) specifications.

## Structure

A Univrse Key described using Concise Data Definition Language:

```elixir
Key = {
  kty: text,
  ? crv: text,
  ? x: bytes,
  ? y: bytes,
  ? k: bytes,
  ? d: bytes
}
```

## Key types

The following values are valid key types (`kty`):

* `EC` - Elliptic curve key
* `oct` - Octet sequence

### `EC` - Elliptic curve key

Elliptic curve keys can be used for signature algorithms and asynchronous encryption algorithms. The key parameters are:

| Param | Description    | Required |
| ----- | -------------- | -------- |
| `kty` | Key type       | `EC`     |
| `crv` | Elliptic curve | ✅       |
| `x`   | X coordinate   | ✅       |
| `y`   | Y coordinate   | ✅       |
| `d`   | Private key    |          |

### `oct` - Octet sequence

Octet sequence keys can be used for HMAC algorithms and synchronous encryption algorithms. The key parameters are:

| Param | Description | Required |
| ----- | ----------- | -------- |
| `kty` | Key type    | `oct`    |
| `k`   | Private key | ✅       |

## Serialisation

A Univrse Key can be serialised into a single CBOR-encoded binary. When encrypting Envelopes for two or more recipients, the content encryption key is serialised, and then encrypted for each recipient.
