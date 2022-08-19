import{_ as a,c as s,o as n,a as e}from"./app.c828cd1a.js";const h=JSON.parse('{"title":"SSO Laravel","description":"","frontmatter":{},"headers":[{"level":2,"title":"Memasang Nilai Environment","slug":"memasang-nilai-environment"},{"level":2,"title":"Instalasi","slug":"instalasi"},{"level":2,"title":"Daftar Perintah Auth","slug":"daftar-perintah-auth"},{"level":2,"title":"Soal Sering Ditanya","slug":"soal-sering-ditanya"},{"level":3,"title":"Bagaimana cara mendapatkan access token dan refresh token?","slug":"bagaimana-cara-mendapatkan-access-token-dan-refresh-token"},{"level":2,"title":"Konfigurasi Tingkat Lanjut - Web Guard","slug":"konfigurasi-tingkat-lanjut-web-guard"}],"relativePath":"sso-laravel.md"}'),l={name:"sso-laravel.md"},o=e(`<h1 id="sso-laravel" tabindex="-1">SSO Laravel <a class="header-anchor" href="#sso-laravel" aria-hidden="true">#</a></h1><p>Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.</p><h2 id="memasang-nilai-environment" tabindex="-1">Memasang Nilai Environment <a class="header-anchor" href="#memasang-nilai-environment" aria-hidden="true">#</a></h2><p>Anda akan mendapatkan isian konfigurasi berikut setelah membuat client app dan menyalin environment client app di IMISSU2.</p><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">SSO_ADMIN_URL=https://your-admin-sso-domain.com</span></span>
<span class="line"><span style="color:#A6ACCD;">SSO_BASE_URL=https://your-sso-domain.com</span></span>
<span class="line"><span style="color:#A6ACCD;">SSO_REALM=master</span></span>
<span class="line"><span style="color:#A6ACCD;">SSO_REALM_PUBLIC_KEY=xxxxxxxxxx</span></span>
<span class="line"><span style="color:#A6ACCD;">SSO_CLIENT_ID=xxxxxxx</span></span>
<span class="line"><span style="color:#A6ACCD;">SSO_CLIENT_SECRET=xxxxxx</span></span>
<span class="line"></span></code></pre></div><p>Isian konfigurasi tersebut dipasang pada file <code>.env</code>.</p><ul><li><code>SSO_ADMIN_URL</code> adalah URL server admin SSO.</li><li><code>SSO_BASE_URL</code> adalah URL server SSO.</li><li><code>SSO_REALM</code> adalah &quot;realm&quot; tempat client app Anda berada yang didapatkan dari IMISSU Dashboard.</li><li><code>SSO_REALM_PUBLIC_KEY</code> adalah realm public key server SSO yang didapatkan dari IMISSU Dashboard.</li><li><code>SSO_CLIENT_ID</code> adalah client id yang didapatkan dari IMISSU Dashboard.</li><li><code>SSO_CLIENT_SECRET</code> adalah client secret yang didapatkan dari IMISSU Dashboard.</li></ul><h2 id="instalasi" tabindex="-1">Instalasi <a class="header-anchor" href="#instalasi" aria-hidden="true">#</a></h2><ol><li>Instal <code>ristekusdi/sso-laravel</code> dengan perintah</li></ol><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;"># Laravel 8 hingga 9</span></span>
<span class="line"><span style="color:#A6ACCD;">composer require ristekusdi/sso-laravel:^2</span></span>
<span class="line"></span></code></pre></div><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;"># Laravel 5.6 hingga 7.x</span></span>
<span class="line"><span style="color:#A6ACCD;">composer require ristekusdi/sso-laravel:^1</span></span>
<span class="line"></span></code></pre></div><ol start="2"><li>Impor aset-aset yang diperlukan dengan perintah berikut</li></ol><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">php artisan vendor:publish --tag=sso-laravel-web</span></span>
<span class="line"></span></code></pre></div><p>Perintah di atas akan mengimpor aset-aset yang diperlukan antara lain:</p><ul><li><p>File controller <code>AuthController.php</code> ke dalam folder <code>app/Http/Controllers/SSO/Web</code>.</p></li><li><p>File model <code>User.php</code> ke dalam folder <code>app/Models/SSO/Web</code>.</p></li><li><p>File konfigurasi <code>sso.php</code> ke dalam folder <code>config</code>.</p></li><li><p>File route <code>sso-web.php</code> ke dalam folder <code>routes</code>.</p></li><li><p>Folder berisi halaman-halaman HTTP Error (401 dan 403) yang berkaitan dengan <code>error SSO Callback Exception</code>. Lokasi halaman-halaman HTTP Error setelah diimpor berada di folder <code>resources/views/sso-web/errors</code>.</p></li></ul><blockquote><p><strong>Catatan:</strong> Anda memiliki kebebasan untuk melakukan kustomisasi terhadap halaman error tersebut. Untuk menghubungkan halaman-halaman HTTP Error yang berkaitan dengan <code>SSO Callback Exception</code> ke dalam proyek Laravel, silakan menuju halaman <a href="#modifikasi-halaman-error">Modifikasi Halaman Error</a>.</p></blockquote><ol start="3"><li>Menambah guard dan provider <code>imissu-web</code> yang ada pada file <code>config/auth.php</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// Tambahkan ini di dalam array dengan key &#39;guards&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">driver</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">provider</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">],</span></span>
<span class="line"></span></code></pre></div><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// Tambahkan ini di dalam array dengan key &#39;providers&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">driver</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> App</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Models</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">SSO</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Web</span><span style="color:#89DDFF;">\\</span><span style="color:#FFCB6B;">User</span><span style="color:#89DDFF;">::</span><span style="color:#F78C6C;">class</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">],</span></span>
<span class="line"></span></code></pre></div><ol start="4"><li>Daftarkan route <code>sso-web.php</code> ke dalam file <code>routes/web.php</code>. Ini berfungsi untuk menambahkan route SSO (login, callback, logout).</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">require</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">__DIR__</span><span style="color:#89DDFF;">.&#39;</span><span style="color:#C3E88D;">/sso-web.php</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><ol start="5"><li>Untuk melindungi halaman atau URL tertentu (misal /home) dengan otentikasi SSO maka tambahkan middleware <code>imissu-web</code> pada route tersebut.</li></ol><p>Contoh:</p><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#FFCB6B;">Route</span><span style="color:#89DDFF;">::</span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/home</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">HomeController@index</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)-&gt;</span><span style="color:#82AAFF;">middleware</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">imissu-web</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ol start="6"><li>Aplikasi siap dijalankan dengan perintah <code>php artisan serve --port=&lt;port yang dipasang di IMISSU Dashboard&gt;</code> atau custom domain <code>http://yourapp.test</code> dengan bantuan <a href="https://laragon.org/docs/pretty-urls.html" target="_blank" rel="noopener noreferrer">Laragon</a>.</li></ol><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Silakan menuju halaman <a href="#daftar-perintah-auth">daftar perintah auth</a> yang digunakan pada pustaka sso-laravel.</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Jika Anda ingin kendali lebih terhadap SSO, silakan menuju halaman <a href="#konfigurasi-tingkat-lanjut">Konfigurasi Tingkat Lanjut</a></p></div><div class="danger custom-block"><p class="custom-block-title">CATATAN!</p><p>Jika Anda mengalami error hingga langkah 6, silakan menuju halaman <a href="#soal-sering-ditanya">Soal Sering Ditanya</a>.</p></div><h2 id="daftar-perintah-auth" tabindex="-1">Daftar Perintah Auth <a class="header-anchor" href="#daftar-perintah-auth" aria-hidden="true">#</a></h2><p>Pustaka ini mengimplementasikan <code>Illuminate\\Contracts\\Auth\\Guard</code> sehingga hampir semua method di sini mengimplementasikan bawaan Laravel Framework.</p><p>Untuk mengakses data pengguna terotentikasi oleh SSO IMISSU gunakan perintah <code>auth(&#39;imissu-web&#39;)-&gt;user()</code>. Isi dari data-data pengguna terotentikasi oleh SSO IMISSU antara lain:</p><ul><li><code>sub</code>.</li><li><code>full_identity</code> dengan format <code>NIP Nama Pengguna</code>.</li><li><code>username</code>.</li><li><code>identifier</code> berupa NIP atau NIM.</li><li><code>name</code>.</li><li><code>email</code>.</li><li><code>roles</code>.</li><li><code>unud_identifier_id</code>.</li><li><code>unud_sso_id</code>.</li><li><code>unud_user_type_id</code>.</li></ul><p>Kemudian, terdapat method-method tambahan dari perintah <code>auth(&#39;imissu-web&#39;)</code>:</p><h5 id="user-roles" tabindex="-1"><code>user()-&gt;roles()</code> <a class="header-anchor" href="#user-roles" aria-hidden="true">#</a></h5><p>Mendapatkan daftar peran pengguna dalam bentuk array.</p><h5 id="user-hasroles-roles" tabindex="-1"><code>user()-&gt;hasRoles($roles)</code> <a class="header-anchor" href="#user-hasroles-roles" aria-hidden="true">#</a></h5><p>Mengecek apakah pengguna memiliki peran tertentu. Nilai <code>$roles</code> bisa berupa string atau array.</p><h5 id="user-permissions" tabindex="-1"><code>user()-&gt;permissions()</code> <a class="header-anchor" href="#user-permissions" aria-hidden="true">#</a></h5><p>Mendapatkan daftar permissions dalam bentuk array yang melekat pada role active pengguna.</p><h5 id="user-haspermission-permissions" tabindex="-1"><code>user()-&gt;hasPermission($permissions)</code> <a class="header-anchor" href="#user-haspermission-permissions" aria-hidden="true">#</a></h5><p>Mengecek apakah pengguna memiliki permissions yang melekat pada role active user. Nilai <code>$permissions</code> bisa berupa string atau array.</p><h5 id="check" tabindex="-1"><code>check()</code> <a class="header-anchor" href="#check" aria-hidden="true">#</a></h5><p>Mengecek apakah pengguna sudah login?</p><h5 id="guest" tabindex="-1"><code>guest()</code> <a class="header-anchor" href="#guest" aria-hidden="true">#</a></h5><p>Mengecek apakah pengguna belum login?</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Anda juga bisa menggunakan <code>Auth::guard(&#39;imissu-web&#39;)</code> sebagai alternatif dari <code>auth(&#39;imissu-web&#39;)</code>.</p></div><h2 id="soal-sering-ditanya" tabindex="-1">Soal Sering Ditanya <a class="header-anchor" href="#soal-sering-ditanya" aria-hidden="true">#</a></h2><h3 id="bagaimana-cara-mendapatkan-access-token-dan-refresh-token" tabindex="-1">Bagaimana cara mendapatkan access token dan refresh token? <a class="header-anchor" href="#bagaimana-cara-mendapatkan-access-token-dan-refresh-token" aria-hidden="true">#</a></h3><p>Ada dua cara untuk mendapatkan access token dan refresh token:</p><ol><li><p>Mengimpor facade <code>IMISSUWeb</code> dengan perintah <code>use RistekUSDI\\SSO\\Facades\\IMISSUWeb;</code>, kemudian jalankan perintah <code>IMISSUWeb::retrieveToken()</code>.</p></li><li><p>Menggunakan session. Gunakan perintah <code>session()-&gt;get(&#39;_sso_token.access_token&#39;)</code> untuk mendapatkan access token dan <code>session()-&gt;get(&#39;_sso_token.refresh_token&#39;)</code>.</p></li></ol><h2 id="konfigurasi-tingkat-lanjut-web-guard" tabindex="-1">Konfigurasi Tingkat Lanjut - Web Guard <a class="header-anchor" href="#konfigurasi-tingkat-lanjut-web-guard" aria-hidden="true">#</a></h2><p>Konfigurasi ini berguna jika Anda ingin menyisipkan atribut tambahan seperti <code>role_permissions</code> dan <code>role_active</code>. Atribut <code>role_permissions</code> diambil dari database dan <code>role_active</code> diambil dari session.</p><ol><li>Pada file <code>sso.php</code> di folder <code>config</code> tambahkan nilai <code>role_permissions</code> dan <code>role_active</code> pada sebuah array dengan key <code>user_attributes</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">user_attributes</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">role_permissions</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">role_active</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">],</span></span>
<span class="line"></span></code></pre></div><ol start="2"><li>Impor aset-aset yang diperlukan untuk konfigurasi tingkat lanjut dengan perintah</li></ol><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">php artisan vendor:publish --tag=sso-laravel-web-advance-setup</span></span>
<span class="line"></span></code></pre></div><ol start="3"><li>Perbaharui lokasi web guard pada file <code>sso.php</code> di folder <code>config</code> pada sebuah array bernama <code>web</code> dengan key bernama <code>guard</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">guard</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> App</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Services</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Auth</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Guard</span><span style="color:#89DDFF;">\\</span><span style="color:#FFCB6B;">WebGuard</span><span style="color:#89DDFF;">::</span><span style="color:#F78C6C;">class</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span></code></pre></div><ol start="4"><li>Pada file <code>config/app.php</code> daftarkan provider <code>WebSession</code> di dalam array <code>providers</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">providers</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// WebSession</span></span>
<span class="line"><span style="color:#A6ACCD;">    App</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Providers</span><span style="color:#89DDFF;">\\</span><span style="color:#FFCB6B;">WebSessionProvider</span><span style="color:#89DDFF;">::</span><span style="color:#F78C6C;">class</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><ol start="5"><li>Pada file <code>config/app.php</code> daftarkan class alias <code>WebSession</code> di dalam array <code>aliases</code>.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">aliases</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// WebSession</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">WebSession</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> App</span><span style="color:#89DDFF;">\\</span><span style="color:#A6ACCD;">Facades</span><span style="color:#89DDFF;">\\</span><span style="color:#FFCB6B;">WebSession</span><span style="color:#89DDFF;">::</span><span style="color:#F78C6C;">class</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><ol start="6"><li>Daftarkan route <code>web-session.php</code> ke dalam file <code>routes/web.php</code>. Tujuannya untuk mengganti session <code>role_active</code> pengguna.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">//...</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">require</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">__DIR__</span><span style="color:#89DDFF;">.&#39;</span><span style="color:#C3E88D;">/web-session.php</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><ol start="7"><li>Daftarkan route <code>sso-web-demo.php</code> ke dalam file <code>routes/web.php</code>. Tujuannya untuk contoh dari konfigurasi tingkat lanjut.</li></ol><div class="language-php"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">//...</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">require</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">__DIR__</span><span style="color:#89DDFF;">.&#39;</span><span style="color:#C3E88D;">/sso-web-demo.php</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><ol start="8"><li>Pastikan Anda menghapus komentar-komentar yang ada di file <code>App\\Http\\Controllers\\SSO\\Web\\AuthController</code>. Komentar-komentar tersebut antara lain:</li></ol><ul><li><code>use App\\Facades\\WebSession;</code></li><li><code>WebSession::forgetRoleActive();</code></li></ul><p>Hal ini bertujuan untuk menghapus session role active saat pengguna logout.</p><ol start="9"><li>Buka halaman <code>http://localhost:8000/sso-web-demo</code> untuk melihat hasil dari konfigurasi tingkat lanjut.</li></ol>`,70),p=[o];function r(t,i,c,d,D,u){return n(),s("div",null,p)}var F=a(l,[["render",r]]);export{h as __pageData,F as default};
