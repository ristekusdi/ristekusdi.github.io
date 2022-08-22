# SSO Laravel

Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.

## Memasang Nilai Environment

Anda akan mendapatkan isian konfigurasi berikut setelah membuat client app dan menyalin environment client app di IMISSU2.

```bash
SSO_ADMIN_URL=https://your-admin-sso-domain.com
SSO_BASE_URL=https://your-sso-domain.com
SSO_REALM=master
SSO_REALM_PUBLIC_KEY=xxxxxxxxxx
SSO_CLIENT_ID=xxxxxxx
SSO_CLIENT_SECRET=xxxxxx
```

Isian konfigurasi tersebut dipasang pada file `.env`.

- `SSO_ADMIN_URL` adalah URL server admin SSO.
- `SSO_BASE_URL` adalah URL server SSO.
- `SSO_REALM` adalah "realm" tempat client app Anda berada yang didapatkan dari IMISSU Dashboard.
- `SSO_REALM_PUBLIC_KEY` adalah realm public key server SSO yang didapatkan dari IMISSU Dashboard.
- `SSO_CLIENT_ID` adalah client id yang didapatkan dari IMISSU Dashboard.
- `SSO_CLIENT_SECRET` adalah client secret yang didapatkan dari IMISSU Dashboard.

## Instalasi

1. Instal `ristekusdi/sso-laravel` dengan perintah

```bash 
# Laravel 8 hingga 9
composer require ristekusdi/sso-laravel:^2
```

```bash
# Laravel 5.6 hingga 7.x
composer require ristekusdi/sso-laravel:^1
```

## Panduan Peningkatan

::: warning PERHATIAN!
Panduan ini ditujukan bagi pengembang yang tidak menggunakan versi sso-laravel 2.4 ke atas.
:::

1. Jalankan perintah berikut untuk memperbaharui versi sso-laravel.

```bash
composer update ristekusdi/sso-laravel
```

> Pastikan versi ristekusdi/sso-laravel adalah versi 2.4

2. Jalankan perintah mengimpor aset-aset yang diperlukan.

```bash
php artisan vendor:publish --tag=sso-laravel-web
php artisan vendor:publish --tag=sso-laravel-web-advance
```

3. Perbaharui `model` dari provider `imissu-web` pada file `config/auth.php`.

```diff{1,2}
-   'model' => App\Models\SSO\User::class,
+   'model' => App\Models\SSO\Web\User::class,
```

4. Pada file `sso.php` di folder `config` tambahkan nilai `role_permissions` dan `role_active` pada sebuah array dengan key `user_attributes`.

```php{3,4}
'user_attributes' => [
    // ...
    'role_permissions',
    'role_active'
],
```

5. Perbaharui nilai `guard` pada file `config/sso.php`.

```diff{1,2}
-   'guard' => RistekUSDI\SSO\Auth\Guard\WebGuard::class,
+   'guard' => App\Services\Auth\Guard\WebGuard::class,
```

6. Daftarkan route `sso-web.php` dan hapus route `sso.php` dari file `routes/web.php`. 

```diff{1,2}
-  require __DIR__.'/sso.php';
+  require __DIR__.'/sso-web.php';
```

7. Pada file `config/app.php` daftarkan provider `WebSession` di dalam array `providers` dan class alias `WebSession` di dalam array `aliases`.

```php{5,12}
'providers' => [
    //...

    // WebSession
    App\Providers\WebSessionProvider::class,
],

'aliases' => [
    //...

    // WebSession
    'WebSession' => App\Facades\WebSession::class,
]
```

8. Impor facade `WebSession` pada file `app/Http/Controllers/SSO/Web/AuthController.php` dan tambahkan perintah `WebSession::forgetRoleActive()` pada baris paling atas di dalam method `logout()`. Hal ini bertujuan untuk menghapus session `role_active` yang disimpan oleh Laravel.

```php{2,11}
// Import facade WebSession
use App\Facades\WebSession;

class AuthController extends Controller
{
    //...

    public function logout()
    {
        // Forget role active
        WebSession::forgetRoleActive();
        
        //...
    }
}
```

9. Daftarkan route `web-session.php` ke dalam file `routes/web.php`. Tujuannya untuk mengganti session `role_active` pengguna.

```php
require __DIR__.'/web-session.php';
```

## Konfigurasi Web Guard

1. Impor aset-aset yang diperlukan dengan perintah berikut
```bash
php artisan vendor:publish --tag=sso-laravel-web
```

2. Menambah guard dan provider `imissu-web` yang ada pada file `config/auth.php`.

```php
// Tambahkan ini di dalam array dengan key 'guards'
'imissu-web' => [
    'driver' => 'imissu-web',
    'provider' => 'imissu-web',
],

// Tambahkan ini di dalam array dengan key 'providers'
'imissu-web' => [
    'driver' => 'imissu-web',
    'model' => App\Models\SSO\Web\User::class,
],
```

4. Daftarkan route `sso-web.php` ke dalam file `routes/web.php`. Ini berfungsi untuk menambahkan route SSO (login, callback, logout).

```php
require __DIR__.'/sso-web.php';
```

5. Untuk melindungi halaman atau URL tertentu (misal /home) dengan otentikasi SSO maka tambahkan middleware `imissu-web` pada route tersebut. 

Contoh: 

```php
Route::get('/home', 'HomeController@index')->middleware('imissu-web');
```

6. Aplikasi siap dijalankan dengan perintah `php artisan serve --port=<port yang dipasang di IMISSU Dashboard>` atau custom domain `http://yourapp.test` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

Konfigurasi telah selesai. Tetapi, ada kalanya kita memiliki kasus seperti menyisipkan atribut-atribut tambahan seperti `role_permissions` dan `role_active`. Atribut `role_permissions` diambil dari database dan `role_active` diambil dari session.

Untuk kasus tersebut kita lanjutkan pada tahap Konfigurasi Web Guard - Tingkat Lanjut.

## Konfigurasi Web Guard - Tingkat Lanjut

1. Impor aset-aset yang diperlukan dengan perintah berikut
```bash
php artisan vendor:publish --tag=sso-laravel-web-advance
```

2. Perbaharui nilai `guard` pada file `config/sso.php`.

```diff{1,2}
-   'guard' => RistekUSDI\SSO\Auth\Guard\WebGuard::class,
+   'guard' => App\Services\Auth\Guard\WebGuard::class,
```

3. Pada file `sso.php` di folder `config` tambahkan nilai `role_permissions` dan `role_active` pada sebuah array dengan key `user_attributes`.

```php{3,4}
'user_attributes' => [
    // ...
    'role_permissions',
    'role_active'
],
```

4. Pada file `config/app.php` daftarkan provider `WebSession` di dalam array `providers` dan class alias `WebSession` di dalam array `aliases`.

```php{5,12}
'providers' => [
    //...

    // WebSession
    App\Providers\WebSessionProvider::class,
],

'aliases' => [
    //...

    // WebSession
    'WebSession' => App\Facades\WebSession::class,
]
```

5. Impor facade `WebSession` pada file `app/Http/Controllers/SSO/Web/AuthController.php` dan tambahkan perintah `WebSession::forgetRoleActive()` pada baris paling atas di dalam method `logout()`. Hal ini bertujuan untuk menghapus session `role_active` yang disimpan oleh Laravel.

```php{2,11}
// Import facade WebSession
use App\Facades\WebSession;

class AuthController extends Controller
{
    //...

    public function logout()
    {
        // Forget role active
        WebSession::forgetRoleActive();
        
        //...
    }
}
```

6. Daftarkan route `web-session.php` ke dalam file `routes/web.php`. Tujuannya untuk mengganti session `role_active` pengguna.

```php
require __DIR__.'/web-session.php';
```

7. Daftarkan route `sso-web-demo.php` ke dalam file `routes/web.php`. Tujuannya untuk demo dari konfigurasi tingkat lanjut.

```php
require __DIR__.'/sso-web-demo.php';
```

8. Buka halaman `http://localhost:<your-port-number>/sso-web-demo` untuk melihat hasil dari konfigurasi tingkat lanjut.

## Daftar Perintah Auth

Pustaka ini mengimplementasikan `Illuminate\Contracts\Auth\Guard` sehingga hampir semua method di sini mengimplementasikan bawaan Laravel Framework.

Untuk mengakses data pengguna terotentikasi oleh SSO IMISSU gunakan perintah `auth('imissu-web')->user()`. Isi dari data-data pengguna terotentikasi oleh SSO IMISSU antara lain:

- `sub`.
- `full_identity` dengan format `NIP Nama Pengguna`.
- `username`.
- `identifier` berupa NIP atau NIM.
- `name`.
- `email`.
- `roles`.
- `unud_identifier_id`.
- `unud_sso_id`.
- `unud_user_type_id`.

Kemudian, terdapat method-method tambahan dari perintah `auth('imissu-web')`:

##### `user()->roles()`

Mendapatkan daftar peran pengguna dalam bentuk array.

##### `user()->hasRoles($roles)` 

Mengecek apakah pengguna memiliki peran tertentu. Nilai `$roles` bisa berupa string atau array.

##### `user()->permissions()`

Mendapatkan daftar permissions dalam bentuk array yang melekat pada role active pengguna.

##### `user()->hasPermission($permissions)`

Mengecek apakah pengguna memiliki permissions yang melekat pada role active user. Nilai `$permissions` bisa berupa string atau array.

##### `check()`

Mengecek apakah pengguna sudah login?

##### `guest()`

Mengecek apakah pengguna belum login?

::: tip
Anda juga bisa menggunakan `Auth::guard('imissu-web')` sebagai alternatif dari `auth('imissu-web')`.
:::

## Soal Sering Ditanya

### Bagaimana cara mendapatkan access token dan refresh token?

Ada dua cara untuk mendapatkan access token dan refresh token:

1. Mengimpor facade `IMISSUWeb` dengan perintah `use RistekUSDI\SSO\Facades\IMISSUWeb;`, kemudian jalankan perintah `IMISSUWeb::retrieveToken()`.

2. Menggunakan session. Gunakan perintah `session()->get('_sso_token.access_token')` untuk mendapatkan access token dan `session()->get('_sso_token.refresh_token')`.