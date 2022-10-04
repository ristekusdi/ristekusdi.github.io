import{_ as s,c as a,o as n,a as l}from"./app.c828cd1a.js";const u=JSON.parse('{"title":"SSO PHP","description":"","frontmatter":{},"headers":[{"level":2,"title":"Prasyarat","slug":"prasyarat"},{"level":2,"title":"Instalasi","slug":"instalasi"},{"level":2,"title":"Pengaturan","slug":"pengaturan"},{"level":3,"title":"PHP","slug":"php"},{"level":3,"title":"CodeIgniter 3.x","slug":"codeigniter-3-x"},{"level":2,"title":"Daftar Perintah Auth","slug":"daftar-perintah-auth"},{"level":3,"title":"Auth PHP","slug":"auth-php"},{"level":3,"title":"Auth CodeIgniter 3.x","slug":"auth-codeigniter-3-x"},{"level":2,"title":"Soal Sering Ditanya","slug":"soal-sering-ditanya"}],"relativePath":"sso-php.md"}'),p={name:"sso-php.md"},o=l(`<h1 id="sso-php" tabindex="-1">SSO PHP <a class="header-anchor" href="#sso-php" aria-hidden="true">#</a></h1><p>Petunjuk penggunaan pustaka SSO PHP Universitas Udayana.</p><h2 id="prasyarat" tabindex="-1">Prasyarat <a class="header-anchor" href="#prasyarat" aria-hidden="true">#</a></h2><ul><li>PHP versi minimal 7.2.5</li></ul><blockquote><p>Catatan saat pengujian tutorial dilakukan pada CodeIgniter versi 3.x. Bila Anda mengalami kendala silakan buat <a href="https://github.com/ristekusdi/sso-php/issues" target="_blank" rel="noopener noreferrer">isu di ristekusdi/sso-php</a>.</p></blockquote><h2 id="instalasi" tabindex="-1">Instalasi <a class="header-anchor" href="#instalasi" aria-hidden="true">#</a></h2><p>Gunakan perintah di bawah ini untuk menginstal package ristekusdi/sso-php</p><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">composer require ristekusdi/sso-php</span></span>
<span class="line"></span></code></pre></div><p>Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dev atau IMISSU2 dan taruh di file <code>.env</code>.</p><h2 id="pengaturan" tabindex="-1">Pengaturan <a class="header-anchor" href="#pengaturan" aria-hidden="true">#</a></h2><p>Pengaturan dibagi menjadi dua bagian yakni <a href="#php">PHP</a> dan <a href="#codeigniter-3-x">CodeIgniter 3.x</a>.</p><h3 id="php" tabindex="-1">PHP <a class="header-anchor" href="#php" aria-hidden="true">#</a></h3><p>Jalankan perintah berikut untuk menyalin file SSO yang ada di <code>ristekusdi/sso-php</code>.</p><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">./vendor/bin/sso copy:file --type=php</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Atau bila Anda menggunakan terminal bawaan Laragon (CMDER) gunakan perintah di bawah.</p><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">.\\vendor\\bin\\sso copy:file --type=php</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>File SSO yang disalin akan ditaruh di dalam folder <code>sso</code> di direktori root proyek Anda.</p><h3 id="codeigniter-3-x" tabindex="-1">CodeIgniter 3.x <a class="header-anchor" href="#codeigniter-3-x" aria-hidden="true">#</a></h3><ol><li>Jalankan perintah berikut untuk menyalin file SSO yang ada di <code>ristekusdi/sso-php</code>.</li></ol><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">./vendor/bin/sso copy:file --type=ci3</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Atau bila Anda menggunakan terminal bawaan Laragon (CMDER) gunakan perintah di bawah.</p><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">.\\vendor\\bin\\sso copy:file --type=ci3</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>File-file SSO yang disalin antara lain:</p><ul><li><code>Netauth.php</code> di folder <code>application/controllers</code>.</li><li><code>Webauth.php</code> di folder <code>application/libraries</code>.</li></ul><ol start="2"><li>Hubungkan controller <code>Webauth.php</code> ke dalam routing di file <code>application/config/routes.php</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">route</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sso/login</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webauth/login</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">route</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sso/logout</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webauth/logout</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">route</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sso/callback</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webauth/callback</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">route</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sso/change_role_active</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webauth/change_role_active</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">route</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sso/change_kv_active</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webauth/change_kv_active</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><ol start="3"><li>Tambahkan <code>webauth</code> sebagai autoload library di direktori <code>application/config/autoload.php</code></li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// ... artinya autoload library yang sudah pernah Anda tambahkan sebelumnya</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">autoload</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">libraries</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">array</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">...</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">webguard</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ol start="4"><li>Lakukan perubahan nilai pada <code>base_url</code>, <code>composer_autoload</code> dan <code>enable_hooks</code> di file <code>application/config/config.php</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;?</span><span style="color:#A6ACCD;">php</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Auto detection base_url</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">base_url</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">((</span><span style="color:#82AAFF;">isset</span><span style="color:#89DDFF;">($</span><span style="color:#A6ACCD;">_SERVER</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">HTTPS</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">])</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">_SERVER</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">HTTPS</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">on</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">?</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">http</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">base_url</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">.=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">://</span><span style="color:#89DDFF;">&quot;.</span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">_SERVER</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">HTTP_HOST</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">];</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">base_url</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">.=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">str_replace</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">basename</span><span style="color:#89DDFF;">($</span><span style="color:#A6ACCD;">_SERVER</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">SCRIPT_NAME</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]),</span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">,$</span><span style="color:#A6ACCD;">_SERVER</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">SCRIPT_NAME</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Ubah lokasi autoload composer di direktori \`vendor\` pada root project.</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">composer_autoload</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">./vendor/autoload.php</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Aktifkan hooks pada file \`application/config/hooks.php\`.</span></span>
<span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">enable_hooks</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">TRUE;</span></span>
<span class="line"></span></code></pre></div><ol start="5"><li>Masukkan sintaks berikut untuk mengambil nilai dari file <code>.env</code> dengan perintah <code>$_ENV[&#39;nama_key&#39;]</code> atau <code>$_SERVER[&#39;nama_key&#39;]</code> di file <code>application/config/hooks.php</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">hook</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pre_system</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">dotenv </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> Dotenv</span><span style="color:#89DDFF;">\\</span><span style="color:#FFCB6B;">Dotenv</span><span style="color:#89DDFF;">::</span><span style="color:#82AAFF;">createImmutable</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">FCPATH</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">dotenv</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">load</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span></code></pre></div><ol start="6"><li>Agar halaman tertentu di dalam suatu proyek dilindungi oleh autentikasi, tambahkan perintah <code>$this-&gt;webauth-&gt;authenticated()</code> ke dalam <code>constructor</code> di suatu controller. Sehingga jika pengguna mengakses halaman tertentu belum terautentikasi maka di arahkan ke halaman login SSO.</li></ol><h2 id="daftar-perintah-auth" tabindex="-1">Daftar Perintah Auth <a class="header-anchor" href="#daftar-perintah-auth" aria-hidden="true">#</a></h2><p>Daftar perintah auth terbagi menjadi dua bagian yakni <a href="#auth-php">PHP</a> dan <a href="#auth-codeigniter-3-x">CodeIgniter 3.x</a>.</p><h3 id="auth-php" tabindex="-1">Auth PHP <a class="header-anchor" href="#auth-php" aria-hidden="true">#</a></h3><p>Pustaka ini mengimplementasikan <code>Illuminate\\Contracts\\Auth\\Guard</code> dari Laravel sehingga seolah-olah Anda seperti menggunakan Laravel.</p><p>Caranya adalah dengan mengimpor class <code>WebGuard</code> dengan perintah <code>use RistekUSDI\\SSO\\PHP\\Auth\\Guard\\WebGuard;</code> maka Anda akan memiliki beberapa fungsi berikut.</p><p>Berikut perintah-perintah yang digunakan untuk mengakses data pengguna SSO.</p><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;"># Methods</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengecek apakah pengguna sudah terotentikasi atau login.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">check</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengecek apakah pengguna adalah &quot;tamu&quot; (belum login atau terotentikasi).</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">guest</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Objek pengguna</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Attributes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// sub adalah id user di Keycloak.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// TIDAK DIREKOMENDASIKAN menggunakan atribut ini utk menyimpan nilai.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">sub</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// NIP/NIM - Nama Pengguna</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">full_identity</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Username</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">preferred_username</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">username</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// NIP atau NIM</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">identifier</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Email</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">email</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Daftar peran pengguna dalam suatu aplikasi.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">client_roles</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// id user di Unud.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">unud_identifier_id</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// id tipe pengguna di Unud.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">unud_user_type_id</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// id sso Unud.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// DIREKOMENDASIKAN untuk menggunakan atribut ini untuk menyimpan nilai.</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">())-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#A6ACCD;">unud_sso_id</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h3 id="auth-codeigniter-3-x" tabindex="-1">Auth CodeIgniter 3.x <a class="header-anchor" href="#auth-codeigniter-3-x" aria-hidden="true">#</a></h3><p>Berikut daftar perintah auth pada CodeIgniter 3.x</p><div class="language-php"><span class="copy"></span><pre><code><span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Methods</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengecek apakah ada pengguna yang login atau tidak.</span></span>
<span class="line"><span style="color:#89DDFF;">$this-&gt;</span><span style="color:#A6ACCD;">webguard</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">check</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengembalikan pengguna ke halaman login SSO jika belum login.</span></span>
<span class="line"><span style="color:#89DDFF;">$this-&gt;</span><span style="color:#A6ACCD;">webguard</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">authenticated</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Objek pengguna</span></span>
<span class="line"><span style="color:#89DDFF;">$this-&gt;</span><span style="color:#A6ACCD;">webguard</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengecek apakah pengguna memiliki role tertentu atau tidak (role bisa lebih dari 1 dengan format array) dan mengembalikan nilai bertipe boolean.</span></span>
<span class="line"><span style="color:#89DDFF;">$this-&gt;</span><span style="color:#A6ACCD;">webguard</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#82AAFF;">hasRole</span><span style="color:#89DDFF;">($</span><span style="color:#A6ACCD;">role</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Mengecek apakah pengguna memiliki permission tertentu atau tidak (permission bisa lebih dari 1 dengan format array) dan mengembalikan nilai booelan.</span></span>
<span class="line"><span style="color:#89DDFF;">$this-&gt;</span><span style="color:#A6ACCD;">webguard</span><span style="color:#89DDFF;">-&gt;</span><span style="color:#82AAFF;">user</span><span style="color:#89DDFF;">()-&gt;</span><span style="color:#82AAFF;">hasPermission</span><span style="color:#89DDFF;">($</span><span style="color:#A6ACCD;">permission</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><h2 id="soal-sering-ditanya" tabindex="-1">Soal Sering Ditanya <a class="header-anchor" href="#soal-sering-ditanya" aria-hidden="true">#</a></h2><h5 id="bagaimana-cara-mendapatkan-access-token-dan-refresh-token" tabindex="-1">Bagaimana cara mendapatkan access token dan refresh token? <a class="header-anchor" href="#bagaimana-cara-mendapatkan-access-token-dan-refresh-token" aria-hidden="true">#</a></h5><p>Impor class <code>SSOService</code> dengan perintah <code>use RistekUSDI\\SSO\\PHP\\Services\\SSOService;</code>.</p><p>Gunakan perintah <code>(new SSOService())-&gt;retrieveToken()</code> untuk mendapatkan access token dan refresh token.</p>`,47),e=[o];function t(r,c,i,D,F,y){return n(),a("div",null,e)}var C=s(p,[["render",t]]);export{u as __pageData,C as default};