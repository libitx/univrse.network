import{c as t,o as e,g as n}from"./vendor.9944df43.js";const a={class:"markdown-body"},d=n('<h1>Recipient spec</h1><h2>Introduction</h2><p>A Univrse Recipient is a structure attached to an Envelope that helps the intended recipient(s) decrypt the encrypted payload. An encrypted Envelope may contain one or multiple Recipient structures.</p><p>Where the Envelope is intended for a single recipient, the Recipient structure is merely a set of headers that helps the intended recipient identify what key and algorithm is needed to decrypt the payload.</p><p>Where the Envelope is intended for multiple recipients, a Recipient structure may also contain an encrypted Key. In this case, the intended recipient must decrypt the content encryption key, which they can then use to decrypt the payload.</p><h2>Structure</h2><p>A Univrse Recipient described using Concise Data Definition Language:</p><pre><code class="language-elixir">Recipient <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token attr-name">header:</span> Header<span class="token punctuation">,</span>\n  <span class="token attr-name">key:</span> bytes <span class="token operator">/</span> <span class="token boolean">nil</span>\n<span class="token punctuation">]</span>\n\nHeader <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token attr-name">alg:</span> text<span class="token punctuation">,</span>\n  ? <span class="token attr-name">epk:</span> bytes<span class="token punctuation">,</span>\n  ? <span class="token attr-name">iv:</span> bytes<span class="token punctuation">,</span>\n  ? <span class="token attr-name">kid:</span> text<span class="token punctuation">,</span>\n  ? <span class="token attr-name">tag:</span> bytes<span class="token punctuation">,</span>\n  <span class="token operator">*</span> text <span class="token operator">=&gt;</span> any\n<span class="token punctuation">}</span>\n</code></pre><h2>Headers</h2><p>A Univrse Recipient may contain any of the following headers. It may also contain any other arbitrary headers.</p><table><thead><tr><th>Header</th><th>Description</th><th>Required</th></tr></thead><tbody><tr><td><code>alg</code></td><td>Encryption algorithm</td><td>✅</td></tr><tr><td><code>epk</code></td><td>Ephemeral public key</td><td></td></tr><tr><td><code>iv</code></td><td>Initialization vector</td><td></td></tr><tr><td><code>kid</code></td><td>Key ID</td><td></td></tr><tr><td><code>tag</code></td><td>Authentication tag</td><td></td></tr></tbody></table><h2>Multiple recipients</h2><p>Where an envelope contains multiple Recipient structures, the following convention applies:</p><ul><li>The first Recipient (Recipient 0) represents the content encryption key, and thus the <code>alg</code> header specified in the first Recipient structure indicates the algorithm used to encrypt the Envelope payload.</li><li>Each subsequent Recipient represents a unique intended recipient, and it’s Recipient structure contains an encrypted key (the key from Recipient 0). The content encryption key can be decrypted using the Recipient’s specified algorithm and then the payload can be decrypted using the algorithm specified in Recipient 0.</li></ul><h2>Algorithms</h2><p>The following encryption algorithms can be used with Univrse Recipients.</p><table><thead><tr><th>Algorithm</th><th>Description</th><th>Key type</th></tr></thead><tbody><tr><td><code>A128CBC-HS256</code></td><td><code>AES-128-CBC</code> encryption algorithm authenticated with <code>HMAC-SHA256</code></td><td><code>oct</code></td></tr><tr><td><code>A256CBC-HS512</code></td><td><code>AES-256-CBC</code> encryption algorithm authenticated with <code>HMAC-SHA512</code></td><td><code>oct</code></td></tr><tr><td><code>A128GCM</code></td><td><code>AES-128-GCM</code> authenticated encryption algorithm</td><td><code>oct</code></td></tr><tr><td><code>A256GCM</code></td><td><code>AES-256-GCM</code> authenticated encryption algorithm</td><td><code>oct</code></td></tr><tr><td><code>ECDH-ES+A128GCM</code></td><td>Diffie-Hellman Ephemeral key agreement using Concat KDF<br><code>AES-128-GCM</code> authenticated encryption algorithm</td><td><code>EC</code></td></tr><tr><td><code>ECDH-ES+A256GCM</code></td><td>Diffie-Hellman Ephemeral key agreement using Concat KDF<br><code>AES-256-GCM</code> authenticated encryption algorithm</td><td><code>EC</code></td></tr><tr><td><code>ECIES-BIE1</code></td><td>Electrum ECIES encryption algorithm, <code>BIE1</code></td><td><code>EC</code></td></tr></tbody></table>',17),o={expose:[],setup:n=>(n,o)=>(e(),t("div",a,[d]))};export default o;
