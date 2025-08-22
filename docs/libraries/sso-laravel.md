---
title: SSO Laravel
outline: deep
---

# SSO Laravel

Petunjuk penggunaan pustaka SSO (Single Sign-On) Laravel Universitas Udayana.

## Prasyarat

- Laravel versi 10 (PHP 8.1)
- Laravel versi 11 ke atas (PHP 8.2).

> Catatan saat pengujian tutorial dilakukan pada Laravel versi 12. Bila Anda mengalami kendala silakan hubungi programmer USDI yang bertugas mengembangkan pustaka ini.

## Demo

Demo ini akan menunjukkan cara memproteksi halaman-halaman dengan otentikasi SSO IMISSU.

1. Instal `ristekusdi/sso-laravel` dengan perintah di bawah ini.

```bash 
composer require ristekusdi/sso-laravel
```

Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dan taruh di file `.env`.

```txt
KEYCLOAK_ADMIN_URL=
KEYCLOAK_BASE_URL=
KEYCLOAK_REALM=
KEYCLOAK_REALM_PUBLIC_KEY=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=
```

2. Jalankan perintah di bawah ini.

```bash
php artisan vendor:publish --tag=sso-laravel.demo
```

Perintah di atas akan menghasilkan file-file di bawah ini.

- app/Http/Controllers/SSO/Web/AuthController.php
- app/Http/Controllers/SSO/Web/SessionController.php
- app/Http/Middleware/InitWebSession.php
- app/Facades/WebSession.php
- app/Providers/WebSessionProvider.php
- app/Services/WebSession.php
- app/Models/SSO/Web/User.php
- config/sso.php
- resources/views/sso-web/demo.blade.php
- routes/sso-web-demo.php
- routes/sso-web.php
- routes/web-session.php

::: warning PERHATIAN
- Lakukan modifikasi `app/Models/SSO/Web/User` dan `app/Services/WebSession` untuk mengelola sesi tambahan di `auth('imissu-web')->user()`.
- Inisiasi sesi tambahan terjadi saat request `/sso/callback`. Di request `/sso/callback`, terdapat middleware `InitWebSession` dengan alias `init.web-session` yang berfungsi untuk menginisiasi sesi tambahan.
:::

3. Tambahkan route `sso-web.php` dan `web-session.php` ke dalam file `routes/web.php`.

::: code-group
```php [routes/web.php]
<?php
// ...

require __DIR__.'/sso-web.php'; // [!code ++]
require __DIR__.'/web-session.php'; // [!code ++]
```
:::

4. Ubah nilai `redirect_url` menjadi `'/sso-web-demo'` di `config/sso.php`.

::: code-group
```php [config/sso.php]
'redirect_url' => '/', // [!code --]
'redirect_url' => '/sso-web-demo', // [!code ++]
```
:::

5. Tambahkan guard dan provider `imissu-web` di `config/auth.php`.

::: code-group
```php [config/auth.php]

'guards' => [
    // ...
    'imissu-web' => [ // [!code ++]
        'driver' => 'imissu-web', // [!code ++]
        'provider' => 'imissu-web', // [!code ++]
    ], // [!code ++]
],

'providers' => [
    // ...
    'imissu-web' => [ // [!code ++]
        'driver' => 'imissu-web', // [!code ++]
        'model' => App\Models\SSO\Web\User::class, // [!code ++]
    ], // [!code ++]
],
```
:::

Hal ini bertujuan ketika login dengan SSO maka langsung diarahkan ke halaman `/sso-web-demo`.

6. Daftarkan provider `WebSession` dan facade `WebSession` di `config/app.php` pada Laravel versi 10 atau `bootstrap/providers` pada Laravel versi 11 ke atas.

::: code-group
```php [config/app.php - Laravel 10]
'providers' => [
    //...

    // WebSession
    App\Providers\WebSessionProvider::class, // [!code ++]
],

'aliases' => [
    //...

    // WebSession
    'WebSession' => App\Facades\WebSession::class, // [!code ++]
]
```

```php [bootstrap/providers.php - Laravel >= 11]
<?php

return [
    // ...
    App\Providers\WebSessionProvider::class, // [!code ++]
];
```
:::

7. Daftarkan middleware `InitWebSession` di `app/Http/Kernel.php` pada Laravel versi 10 atau `bootstrap/app.php` pada Laravel versi 11 ke atas.

::: code-group
```php [config/app.php - Laravel 10]
protected $middlewareAliases = [
    // ...
    'init.web-session' => \App\Http\Middleware\InitWebSession::class,
]
```

```php [bootstrap/providers.php - Laravel >= 11]
<?php

use App\Http\Middleware\InitWebSession;

->withMiddleware(function (Middleware $middleware) {
    // ...
    $middleware->alias([
        'init.web-session' => InitWebSession::class,
    ]);
})
```
:::

8. Tambahkan route `sso-web-demo.php` ke dalam file `routes/web.php` untuk melihat demo SSO web.

::: code-group
```php [routes/web.php]
<?php
// ...

require __DIR__.'/sso-web-demo.php'; // [!code ++]
```
:::

9. Buka halaman `/sso-web-demo` dengan URL `http://localhost:8000/sso-web-demo` atau `http://yourapp.test/sso-web-demo` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

![Image of SSO web demo](/img/sso-web-demo.png)

## Web Guard - Auth

Berikut perintah-perintah yang digunakan untuk mengakses data pengguna SSO.

```php
# Attributes

// sub adalah id user di Keycloak.
// Atribut TIDAK DIREKOMENDASIKAN untuk menyimpan id unik pengguna.
auth('imissu-web')->user()->sub;

auth('imissu-web')->user()->preferred_username;
auth('imissu-web')->user()->name;
auth('imissu-web')->user()->email;

// Daftar peran pengguna dalam suatu aplikasi.
auth('imissu-web')->user()->client_roles;

// id user di Unud.
// Atribut ini DIREKOMENDASIKAN untuk menyimpan id unik pengguna.
auth('imissu-web')->user()->unud_identifier_id;

// id sso Unud.
// Atribut ini DIREKOMENDASIKAN untuk menyimpan id unik pengguna.
auth('imissu-web')->user()->unud_sso_id;

// id tipe pengguna di Unud.
auth('imissu-web')->user()->unud_user_type_id;

# Virtual attributes

auth('imissu-web')->user()->username;

// Identifier = NIP/NIM
auth('imissu-web')->user()->identifier;

// Identitas lengkap dalam bentuk NIP/NIM Nama pengguna
auth('imissu-web')->user()->full_identity;

# Methods

// Mengecek apakah pengguna memiliki peran tertentu dalam daftar peran aplikasi. 
// Nilai `$roles` bertipe string atau array.
auth('imissu-web')->user()->hasRole($roles);

// Mengecek apakah pengguna memiliki peran tertentu.
// Nilai input bertipe string atau array
auth('imissu-web')->user()->hasRole($role);

// Mengecek apakah pengguna memiliki permission tertentu.
// Nilai input bertipe string atau array.
auth('imissu-web')->user()->hasPermission($permissions);

# Utility

// Mengecek apakah pengguna sudah login?
auth('imissu-web')->check();

// Mengecek apakah pengguna belum login?
auth('imissu-web')->guest();
```

## Web Guard Middleware

Berikut daftar web middleware yang disediakan oleh SSO Laravel.

```php
// Middleware untuk mengecek apakah pengguna sudah terotentikasi.
// Jika belum terotentikasi maka diarahkan ke halaman login.
middleware('imissu-web');

// Middleware untuk mengecek apakah pengguna memiliki peran Admin
// Jika peran lebih dari satu maka gunakan tanda "|"
Route::middleware('imissu-web.role:Admin');
Route::middleware('imissu-web.role:Admin|Super Admin');

// Middleware untuk mengecek apakah pengguna memiliki permission user.create
// Jika permission lebih dari satu maka gunakan tanda "|"
Route::middleware('imissu-web.permission:user.create');
Route::middleware('imissu-web.permission:user.create|user.view');
```

## Soal Sering Ditanya

### Bagaimana cara mendapatkan access token dan refresh token?

Terdapat dua cara untuk mendapatkan access token dan refresh token:

1. Menggunakan facade `IMISSUWeb` dari package `ristekusdi/sso-laravel`.

```php
<?php

use RistekUSDI\SSO\Laravel\Facades\IMISSUWeb;

$token = IMISSUWeb::retrieveToken();
$access_token = $token['access_token'];
$refresh_token = $token['refresh_token'];
```

2. Menggunakan fitur Session dari Laravel.

```php
<?php

$access_token = session()->get('_sso_token.access_token');
$refresh_token = session()->get('_sso_token.refresh_token');
```
