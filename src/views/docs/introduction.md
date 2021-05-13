---
title: Introduction to Univrse
---

# Introduction to Univrse

Bitcoin applications often need to store arbitrary data objects encoded in Bitcoin transactions, which are written to the blockchain. Given the open nature of a public blockchain, cryptographic signatures can be used to provide integrity protection for data payloads, and encryption can be employed to ensure the confidentiality of data payloads.

In order to minimise the barriers to building a truly interoperable ecosystem of applications and services on top of Bitcoin, it is preferable that different parties use a consistent and compatible approach for serialising, authenticating and securing data.

Univrse is a universal schema for serialising any arbitrary data in a concise, binary-friendly format, with standardised yet flexible signature and encryption schemes built in as first class citizens.

## Background

At the beginning of 2019, miners on the Bitcoin SV network coordinated to remove previously restrictive limits on the size of data carrier `OP_RETURN` outputs. This simple change ushered in a Cambrian explosion of new apps and services as developers rushed to take advantage of new and novel use cases.

Around the same time Unwriter released Bitcom - a decentralised registry of Bitcoin application protocols. Bitcom went hand in hand with Unwriter's other innovations, Bitdb and Planria. This combination of inventions made it trivially easy to query and filter the blockchain, and developers took full advantage of the tools available building many new decentralised data applications depending on Unwriter's work. Bitcom quickly established itself as a de facto standard set of conventions for encoding arbitrary data in Bitcoin transactions.

### Time for new conventions

The development landscape in Bitcoin has evolved from where we were in 2019. As we better understand how to build truly scalable Bitcoin apps, the best practice and product architectures from 2019 begin to look naive.

Problems with Bitcom:

* **Too much developer pain** - Every single protocol needs to be implemented by everyone that wants to use that protocol. As apps get more complex and "pipe" protocols together, we see transactions with dozens if not hundreds of push data fields. Parsing and serialising these transactions becomes unnecessarily complex and time consuming work for developers.
* **Too much scope for human error** - Humans do make errors. A typo here and a misplaced semi colon there is not the end of the world, but when it comes to implementing cryptographic algorithms, just one byte out means you've just invented an entirely new algorithm. Relying on every participant to create their own perfect implementation of signature and encryption protocols is asking for trouble.
* **Querying and filtering is less significant than in 2019** - As app developers have learnt more about how to scale apps in a Bitcoin world, best practice and conventions have evolved. Today, many apps are adopting a P2P model where users and wallets pass transactions directly to one another and there is less emphasis on "scanning" the blockchain. Under this paradigm, filtering the blockchain is something that happens at the app level, in effect nullifying some of the perceived benefits of Bitcom.

## What is Univrse

Univrse is an entirely new universal schema for serialising data, with signatures and encryption built in as first class citizens.

Internally Univrse uses [CBOR](https://cbor.io), a concise and binary friendly data serialisation format. CBOR uses a JSON-like, schema-less data model, so is ideally suited for environments where needs and models evolve at high speed. CBOR is a [stable standard](https://cbor.io/spec.html), and its lightweight encoding is perfect for environments such as IoT and a Bitcoin world.

Univrse is heavily influenced by the [JOSE](https://datatracker.ietf.org/wg/jose/charter/) family of specifications. Univrse uses digital signature and message authentication code (MACs) algorithms to provide integrity protection for arbitrary data payloads. And authenticated encryption algorithms are used to confidentiality and integrity of data payloads for intended recipients.

### Specification

The following pages detail to Univrse specification:

* [Envelope](/docs/envelope)
* [Signature](/docs/signature)
* [Recipient](/docs/recipient)
* [Key](/docs/key)

### Using Univrse

Implementation of the Univrse specification exist in the following languages:

* [JavaScript](/docs/javascript)
* [Elixir](/docs/elixir)
