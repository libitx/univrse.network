import{c as n,o as s,g as a}from"./vendor.9944df43.js";const t={class:"markdown-body"},p=a('<h1>Elixir library</h1><p>Univrse ships with an Elixir implementation.</p><ul><li><a href="https://github.com/libitx/univrse">univrse Elixir source code</a></li><li><a href="https://hexdocs.pm/univrse">univrse Elixir API docs</a></li></ul><h2>Installation</h2><p>The package can be installed by adding <code>univrse</code> to your list of dependencies in <code>mix.exs</code>.</p><pre><code class="language-elixir"><span class="token keyword">def</span> deps <span class="token keyword">do</span>\n  <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span><span class="token atom symbol">:univrse</span><span class="token punctuation">,</span> <span class="token string">&quot;~&gt; 0.1&quot;</span><span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token keyword">end</span>\n</code></pre><h2>Usage</h2><h3>Serialising data</h3><p>Any arbitrary payload can be wrapped in a <code>t:Univrse.Envelope.t/0</code> structure, and then encoded in one of three serialisation formats, using <code>Univrse.Envelope.encode/2</code> and <code>Univrse.Envelope.to_script/2</code></p><ul><li><code>:cbor</code> - Concise CBOR-encoded binary value</li><li><code>:base64</code> - Compact Base64-url encoded string value</li><li><code>:script</code> - Encoded in a Bitcoin <code>OP_RETURN</code> script</li></ul><pre><code class="language-elixir"><span class="token comment"># Wrap any arbitrary data payload in an Envelope structure</span>\niex<span class="token operator">&gt;</span> payload <span class="token operator">=</span> <span class="token string">&quot;Hello world!&quot;</span>\niex<span class="token operator">&gt;</span> env <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>wrap<span class="token punctuation">(</span>payload<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token attr-name">proto:</span> <span class="token string">&quot;univrse.demo&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment"># Encode the data in one of three serialisation formats</span>\niex<span class="token operator">&gt;</span> env_cbor <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token atom symbol">:cbor</span><span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> env_base64 <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token atom symbol">:base64</span><span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> env_script <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Envelope<span class="token punctuation">.</span>to_script<span class="token punctuation">(</span>env<span class="token punctuation">)</span>\n\n<span class="token comment"># Decode the serialised data back into an Envelope structure</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env2<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>decode<span class="token punctuation">(</span>env_cbor<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env3<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>decode<span class="token punctuation">(</span>env_base64<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env4<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Envelope<span class="token punctuation">.</span>parse_script<span class="token punctuation">(</span>env_script<span class="token punctuation">)</span>\n\n<span class="token comment"># Compare payload</span>\niex<span class="token operator">&gt;</span> env2<span class="token punctuation">.</span>payload <span class="token operator">==</span> payload <span class="token keyword">and</span> env3<span class="token punctuation">.</span>payload <span class="token operator">==</span> payload <span class="token keyword">and</span> env4<span class="token punctuation">.</span>payload <span class="token operator">==</span> payload\n<span class="token boolean">true</span>\n</code></pre><h3>Using signatures</h3><p>Digital signatures or message authentication code (MAC) algorithms can be used to protect the integrity of an Envelope’s data payload.</p><pre><code class="language-elixir"><span class="token comment"># Generate keys</span>\niex<span class="token operator">&gt;</span> alice_key <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>generate_key<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token atom symbol">:ec</span><span class="token punctuation">,</span> <span class="token atom symbol">:secp256k1</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> alice_pubkey <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>to_public<span class="token punctuation">(</span>alice_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> app_secret <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>generate_key<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token atom symbol">:oct</span><span class="token punctuation">,</span> <span class="token number">256</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment"># Sign and verify using a single key</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env1<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;Hello world!&quot;</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>wrap<span class="token punctuation">(</span><span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token attr-name">proto:</span> <span class="token string">&quot;univrse.demo&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>sign<span class="token punctuation">(</span>alice_key<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;ES256K&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;alice&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\niex<span class="token operator">&gt;</span> Univrse<span class="token punctuation">.</span>verify<span class="token punctuation">(</span>env1<span class="token punctuation">,</span> alice_pubkey<span class="token punctuation">)</span>\n<span class="token boolean">true</span>\n\n<span class="token comment"># Sign and verify using multiple keys and algorithms</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env2<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;Hello world!&quot;</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>wrap<span class="token punctuation">(</span><span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token attr-name">proto:</span> <span class="token string">&quot;univrse.demo&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>sign<span class="token punctuation">(</span><span class="token punctuation">[</span>\n<span class="token operator">...</span>&gt;      <span class="token punctuation">{</span>alice_key<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;ES256K&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;alice&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token operator">...</span>&gt;      <span class="token punctuation">{</span>app_secret<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;HS256&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;app&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span>\n<span class="token operator">...</span>&gt; <span class="token punctuation">]</span><span class="token punctuation">)</span>\n\niex<span class="token operator">&gt;</span> Univrse<span class="token punctuation">.</span>verify<span class="token punctuation">(</span>env2<span class="token punctuation">,</span> <span class="token punctuation">[</span>alice_pubkey<span class="token punctuation">,</span> app_secret<span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token boolean">true</span>\n</code></pre><h3>Using encryption</h3><p>Authenticated encryption algorithms may be used to ensure the confidentiality of an Envelope’s data payload for one or multiple recipients.</p><pre><code class="language-elixir"><span class="token comment"># Generate keys</span>\niex<span class="token operator">&gt;</span> bob_key <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>generate_key<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token atom symbol">:ec</span><span class="token punctuation">,</span> <span class="token atom symbol">:secp256k1</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> bob_pubkey <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>to_public<span class="token punctuation">(</span>bob_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> charlie_key <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>generate_key<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token atom symbol">:ec</span><span class="token punctuation">,</span> <span class="token atom symbol">:secp256k1</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> charlie_pubkey <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>to_public<span class="token punctuation">(</span>charlie_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> app_secret <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Key<span class="token punctuation">.</span>generate_key<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token atom symbol">:oct</span><span class="token punctuation">,</span> <span class="token number">256</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment"># Encrypt and decrypt data for a single recipient</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env1<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;Hello world!&quot;</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>wrap<span class="token punctuation">(</span><span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token attr-name">proto:</span> <span class="token string">&quot;univrse.demo&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>encrypt<span class="token punctuation">(</span>bob_pubkey<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;ECDH-ES+A128GCM&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;bob&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env1<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>decrypt<span class="token punctuation">(</span>env1<span class="token punctuation">,</span> bob_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> env1<span class="token punctuation">.</span>payload\n<span class="token string">&quot;Hello world!&quot;</span>\n\n<span class="token comment"># Encrypt and decrypt data for multiple recipients using multiple algorithms</span>\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> env2<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token string">&quot;Hello world!&quot;</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>wrap<span class="token punctuation">(</span><span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token attr-name">proto:</span> <span class="token string">&quot;univrse.demo&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token operator">...</span>&gt; <span class="token operator">|&gt;</span> Univrse<span class="token punctuation">.</span>encrypt<span class="token punctuation">(</span><span class="token punctuation">[</span>\n<span class="token operator">...</span>&gt;      <span class="token punctuation">{</span>app_secret<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;A256GCM&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token operator">...</span>&gt;      <span class="token punctuation">{</span>bob_pubkey<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;ECDH-ES+A128GCM&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;bob&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token operator">...</span>&gt;      <span class="token punctuation">{</span>charlie_pubkey<span class="token punctuation">,</span> <span class="token punctuation">%</span><span class="token punctuation">{</span><span class="token string">&quot;alg&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;ECDH-ES+A128GCM&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;kid&quot;</span> <span class="token operator">=&gt;</span> <span class="token string">&quot;charlie&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span>\n<span class="token operator">...</span>&gt; <span class="token punctuation">]</span><span class="token punctuation">)</span>\n\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> bob_env<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Envelope<span class="token punctuation">.</span>decrypt_at<span class="token punctuation">(</span>env2<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> bob_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> bob_env<span class="token punctuation">.</span>payload\n<span class="token string">&quot;Hello world!&quot;</span>\n\niex<span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token atom symbol">:ok</span><span class="token punctuation">,</span> charlie_env<span class="token punctuation">}</span> <span class="token operator">=</span> Univrse<span class="token punctuation">.</span>Envelope<span class="token punctuation">.</span>decrypt_at<span class="token punctuation">(</span>env2<span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> charlie_key<span class="token punctuation">)</span>\niex<span class="token operator">&gt;</span> charlie_env<span class="token punctuation">.</span>payload\n<span class="token string">&quot;Hello world!&quot;</span>\n</code></pre>',17),o={expose:[],setup:a=>(a,o)=>(s(),n("div",t,[p]))};export default o;