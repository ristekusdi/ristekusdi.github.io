# SSO Laravel

Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.

## Instalasi

1. Instal `ristekusdi/sso-laravel` dengan perintah

```bash 
composer require ristekusdi/sso-laravel
```

Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dev atau IMISSU2 dan taruh di file `.env`.

## Web Guard

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

Silakan menuju ke tahap konfigurasi Web Guard - Tingkat Lanjut untuk menyisipkan session dan database aplikasi.

## Web Guard - Tingkat Lanjut

Ada kalanya kita memiliki kasus seperti menyisipkan atribut-atribut tambahan seperti `role_active` dan `role_active_permissions`. Atribut `role_active` diambil dari session dan `role_active_permissions` diambil dari database.

Konfigurasi ini bertujuan untuk menyelesaikan kasus tersebut.

1. Impor aset-aset yang diperlukan dengan perintah berikut
```bash
php artisan vendor:publish --tag=sso-laravel-web-advance
```

2. Perbaharui nilai `guard` pada file `config/sso.php`.

```diff{1,2}
-   'guard' => RistekUSDI\SSO\Auth\Guard\WebGuard::class,
+   'guard' => App\Services\Auth\Guard\WebGuard::class,
```

3. Pada file `sso.php` di folder `config` telah ditambahkan nilai `role_active` dan `role_active_permissions` pada array dengan key `user_attributes`.

```php{3,4}
'user_attributes' => [
    // ...
    'role_active'
    'role_active_permissions',
],
```

Ini berfungsi untuk menyisipkan session aplikasi agar bisa diakses dengan perintah `auth('imissu-web')` atau `Auth::guard('imissu-web')`.

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

5. Impor facade `WebSession` pada file `app/Http/Controllers/SSO/Web/AuthController.php` dan tambahkan perintah `WebSession::forget()` pada baris paling atas di dalam method `logout()`. Hal ini bertujuan untuk menghapus session `role_active` dan atau `role_active_permissions` yang disimpan oleh Laravel.

```php{2,11}
// Import facade WebSession
use App\Facades\WebSession;

class AuthController extends Controller
{
    //...

    public function logout()
    {
        // Forget app session
        WebSession::forget();
        
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

Untuk mengakses data pengguna terotentikasi oleh SSO IMISSU gunakan perintah `auth('imissu-web')->user()` atau `Auth::guard('imissu-web')->user()`. Isi dari data pengguna terotentikasi oleh SSO IMISSU antara lain:

- `sub`.
- `full_identity` dengan format `NIP Nama Pengguna`.
- `username`.
- `identifier` yakni NIP atau NIM.
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

## Soal Sering Ditanya

### Bagaimana cara mendapatkan access token dan refresh token?

Ada dua cara untuk mendapatkan access token dan refresh token:

1. Mengimpor facade `IMISSUWeb` dengan perintah `use RistekUSDI\SSO\Facades\IMISSUWeb;`, kemudian jalankan perintah `IMISSUWeb::retrieveToken()`.

2. Menggunakan session. Gunakan perintah `session()->get('_sso_token.access_token')` untuk mendapatkan access token dan `session()->get('_sso_token.refresh_token')`.