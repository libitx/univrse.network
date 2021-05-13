---
title: Elixir library
---

# Elixir library

Univrse ships with an Elixir implementation.

* [univrse Elixir source code](https://github.com/libitx/univrse)
* [univrse Elixir API docs](https://hexdocs.pm/univrse)

## Installation

The package can be installed by adding `univrse` to your list of dependencies
in `mix.exs`.

```elixir
def deps do
  [
    {:univrse, "~> 0.1"}
  ]
end
```

## Usage

### Serialising data

Any arbitrary payload can be wrapped in a `t:Univrse.Envelope.t/0` structure,
and then encoded in one of three serialisation formats, using
`Univrse.Envelope.encode/2` and `Univrse.Envelope.to_script/2`

* `:cbor` - Concise CBOR-encoded binary value
* `:base64` - Compact Base64-url encoded string value
* `:script` - Encoded in a Bitcoin `OP_RETURN` script

```elixir
# Wrap any arbitrary data payload in an Envelope structure
iex> payload = "Hello world!"
iex> env = Univrse.wrap(payload, %{proto: "univrse.demo"})

# Encode the data in one of three serialisation formats
iex> env_cbor = Univrse.encode(env, :cbor)
iex> env_base64 = Univrse.encode(env, :base64)
iex> env_script = Univrse.Envelope.to_script(env)

# Decode the serialised data back into an Envelope structure
iex> {:ok, env2} = Univrse.decode(env_cbor)
iex> {:ok, env3} = Univrse.decode(env_base64)
iex> {:ok, env4} = Univrse.Envelope.parse_script(env_script)

# Compare payload
iex> env2.payload == payload and env3.payload == payload and env4.payload == payload
true
```

### Using signatures

Digital signatures or message authentication code (MAC) algorithms can be used
to protect the integrity of an Envelope's data payload.

```elixir
# Generate keys
iex> alice_key = Univrse.Key.generate_key({:ec, :secp256k1})
iex> alice_pubkey = Univrse.Key.to_public(alice_key)
iex> app_secret = Univrse.Key.generate_key({:oct, 256})

# Sign and verify using a single key
iex> {:ok, env1} = "Hello world!"
...> |> Univrse.wrap(%{proto: "univrse.demo"})
...> |> Univrse.sign(alice_key, %{"alg" => "ES256K", "kid" => "alice"})

iex> Univrse.verify(env1, alice_pubkey)
true

# Sign and verify using multiple keys and algorithms
iex> {:ok, env2} = "Hello world!"
...> |> Univrse.wrap(%{proto: "univrse.demo"})
...> |> Univrse.sign([
...>      {alice_key, %{"alg" => "ES256K", "kid" => "alice"}},
...>      {app_secret, %{"alg" => "HS256", "kid" => "app"}}
...> ])

iex> Univrse.verify(env2, [alice_pubkey, app_secret])
true
```

### Using encryption

Authenticated encryption algorithms may be used to ensure the confidentiality
of an Envelope's data payload for one or multiple recipients.

```elixir
# Generate keys
iex> bob_key = Univrse.Key.generate_key({:ec, :secp256k1})
iex> bob_pubkey = Univrse.Key.to_public(bob_key)
iex> charlie_key = Univrse.Key.generate_key({:ec, :secp256k1})
iex> charlie_pubkey = Univrse.Key.to_public(charlie_key)
iex> app_secret = Univrse.Key.generate_key({:oct, 256})

# Encrypt and decrypt data for a single recipient
iex> {:ok, env1} = "Hello world!"
...> |> Univrse.wrap(%{proto: "univrse.demo"})
...> |> Univrse.encrypt(bob_pubkey, %{"alg" => "ECDH-ES+A128GCM", "kid" => "bob"})

iex> {:ok, env1} = Univrse.decrypt(env1, bob_key)
iex> env1.payload
"Hello world!"

# Encrypt and decrypt data for multiple recipients using multiple algorithms
iex> {:ok, env2} = "Hello world!"
...> |> Univrse.wrap(%{proto: "univrse.demo"})
...> |> Univrse.encrypt([
...>      {app_secret, %{"alg" => "A256GCM"}},
...>      {bob_pubkey, %{"alg" => "ECDH-ES+A128GCM", "kid" => "bob"}},
...>      {charlie_pubkey, %{"alg" => "ECDH-ES+A128GCM", "kid" => "charlie"}}
...> ])

iex> {:ok, bob_env} = Univrse.Envelope.decrypt_at(env2, 1, bob_key)
iex> bob_env.payload
"Hello world!"

iex> {:ok, charlie_env} = Univrse.Envelope.decrypt_at(env2, 2, charlie_key)
iex> charlie_env.payload
"Hello world!"
```