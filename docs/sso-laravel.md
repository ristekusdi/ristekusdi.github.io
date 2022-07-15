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

2. Impor aset yang ada di dalam library sso-laravel jalankan perintah berikut
```bash
php artisan vendor:publish --provider="RistekUSDI\SSO\WebGuardServiceProvider"
```

Perintah di atas akan mengimpor aset:

- File konfigurasi `sso.php` ke dalam folder `config`.

- Folder berisi halaman-halaman HTTP Error (401 dan 403) yang berkaitan dengan `SSO Callback Exception`. Lokasi halaman-halaman HTTP Error setelah diimpor berada di folder `resources/views/sso-laravel/errors`.

- File route `sso.php` ke dalam folder `routes`.

- File controller `AuthController.php` ke dalam folder `app/Http/Controllers/SSO`.

> **Catatan:** Anda memiliki kebebasan untuk melakukan kustomisasi terhadap halaman error tersebut. Untuk menghubungkan halaman-halaman HTTP Error yang berkaitan dengan `SSO Callback Exception` ke dalam proyek Laravel, silakan menuju halaman [Modifikasi Halaman Error](#modifikasi-halaman-error).

3. Menambah guard `imissu-web` yang ada pada file `config/auth.php`.

```php
'guards' => [
    // ...
    'imissu-web' => [
        'driver' => 'imissu-web',
        'provider' => 'imissu-web',
    ],
]
```


```php
'providers' => [
    'imissu-web' => [
        'driver' => 'imissu-web',
        'model' => RistekUSDI\SSO\Models\Web\User::class,
    ],
],
```

4. Memuat route `sso.php` yang ada di dalam folder routes ke dalam file `web.php` yang ada di dalam folder routes dengan perintah berikut.

```php
require __DIR__.'/sso.php';
```

5. Untuk melindungi halaman atau URL tertentu (misal /home) dengan otentikasi SSO maka tambahkan middleware `imissu-web` pada route tersebut. 

Contoh: 

```php
Route::get('/home', 'HomeController@index')->middleware('imissu-web');
```

6. Aplikasi siap dijalankan dengan perintah `php artisan serve --port=<port yang dipasang di IMISSU Dashboard>` atau custom domain `http://yourapp.test` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

::: info
Silakan menuju halaman [daftar perintah auth](#daftar-perintah-auth) yang digunakan pada pustaka sso-laravel.
:::

::: tip
Jika Anda ingin kendali lebih terhadap SSO, silakan menuju halaman [Konfigurasi Tingkat Lanjut](#konfigurasi-tingkat-lanjut)
:::

::: danger CATATAN!
Jika Anda mengalami error hingga langkah 6, silakan menuju halaman [Soal Sering Ditanya](#soal-sering-ditanya).
:::

## Modifikasi Halaman Error

Pada file `Handler.php` di folder `app/Exceptions` impor class `CallbackException` dan gunakan class tersebut di method `render`.

```php
<?php

// ....
use RistekUSDI\SSO\Exceptions\CallbackException;

class Handler extends ExceptionHandler
{
    // ...

    public function render($request, Exception $e)
    {
        // Hubungkan CallbackException ke dalam method render
        if ($e instanceof CallbackException) {
            return $e->render($request);
        }
        return parent::render($request, $e);
    }
}
```

## Daftar Perintah Auth

Pustaka ini mengimplementasikan `Illuminate\Contracts\Auth\Guard` sehingga hampir semua method di sini mengimplementasikan bawaan Laravel Framework. 

Yang berbeda adalah Anda harus mengisi nilai `guard` dengan `imissu-web`. Kemudian adanya tambahan method seperti `roles()`, `hasRoles($roles)`, `permissions()` dan `hasPermission($permissions)` dari pustaka ini.

Daftar perintah tersebut antara lain:

##### `Auth::guard('imissu-web')->user()` 

Mendapatkan data pengguna yang terotentikasi.

##### `Auth::guard('imissu-web')->user()->roles()`

Mendapatkan daftar peran user.

##### `Auth::guard('imissu-web')->user()->hasRoles($roles)` 

Mengecek apakah user memiliki peran tertentu. Nilai `$roles` bisa berupa string atau array.

##### `Auth::guard('imissu-web')->user()->permissions()`

Mendapatkan daftar permissions yang melekat pada role active user.

##### `Auth::guard('imissu-web')->user()->hasPermission($permissions)`

Mengecek apakah user memiliki permissions yang melekat pada role active user. Nilai `$permissions` bisa berupa string atau array.

##### `Auth::guard('imissu-web')->check()`

Mengecek apakah pengguna sudah login?

##### `Auth::guard('imissu-web')->guest()`

Mengecek apakah pengguna belum login?

::: tip
Anda bisa menggunakan `auth('imissu-web')->user()` sebagai pengganti dari `Auth::guard('imissu-web')`.
:::

Atribut-atribut pengguna yang tersedia antara lain:

- `sub`.
- `full_identity` dengan format `NIP Nama Pengguna`.
- `username`.
- `identifier` berupa NIP atau NIM.
- `name`.
- `email`.
- `roles`.

## Soal Sering Ditanya

### Bagaimana cara menghilangkan error null UserProvider?

Kira-kira pesan error nya seperti di bawah ini.

```
Argument 2 passed to Illuminate\Auth\SessionGuard::__construct() 
must implement interface Illuminate\Contracts\Auth\UserProvider, 
null given, 
called in \vendor\laravel\framework\src\Illuminate\Auth\AuthManager.php 
on line 125
```

Hal ini terjadi karena bawaan guard yang dideteksi oleh aplikasi adalah guard `web` dan provider `web` yang dipakai bernama `users` pada file `config/auth.php`.

```php
'defaults' => [
    'guard' => 'web',
    'passwords' => 'users',
],

'web' => [
    'driver' => 'session',
    'provider' => 'users', // Apakah Anda sudah mendefinisikan provider ini di array providers?
],
```

Masalahnya, apakah Anda sudah mendefinisikan provider `users` di array providers? Jika belum Anda bisa mendefinisikannya di dalam array providers. Terdapat dua opsi yakni menggunakan driver `eloquent` atau `database`.

```php
// Opsi eloquent
'users' => [
    'driver' => 'eloquent',
    'model' => App\Models\User::class,
],

// Opsi database
'users' => [
    'driver' => 'database',
    'table' => 'users',
],
```

### Bagaimana cara mendapatkan access token dan refresh token?

Ada dua cara untuk mendapatkan access token dan refresh token:

1. Mengimpor facade `IMISSUWeb` dengan perintah `use RistekUSDI\SSO\Facades\IMISSUWeb;`, kemudian jalankan perintah `IMISSUWeb::retrieveToken()`.

2. Menggunakan session. Gunakan perintah `session()->get('_sso_token.access_token')` untuk mendapatkan access token dan `session()->get('_sso_token.refresh_token')`.

## Konfigurasi Tingkat Lanjut

Konfigurasi ini berguna jika Anda ingin menyisipkan atribut tambahan seperti `role_permissions` dan `role_active`. Yang mana atribut `role_permissions` diambil dari database dan `role_active` diambil dari session.

Pada User model extend class User model dari RistekUSDI dengan sintaks berikut.

```php
use RistekUSDI\SSO\Models\Web\User as SSOUser;

class User extends SSOUser
{

}
```

Berikutnya, pada file `auth.php` ubah User model seperti berikut.

```php
'providers' => [
    'imissu-web' => [
        'driver' => 'imissu-web',
        'model' => App\User::class, // sesuaikan dengan lokasi User model Anda.
    ],
],
```

Agar Anda bisa menyisipkan atribut lain ke dalam User model maka Anda perlu melakukan proses extend class User model dari RistekUSDI yang ada pada langkah sebelumnya. Setelah itu, Anda bisa menambahkan atribut-atribut lain pada properti `$custom_fillable`.

```php
use RistekUSDI\SSO\Models\Web\User as SSOUser;

class User extends SSOUser
{
    public $custom_fillable = [
        'unud_identifier_id',
        'unud_user_type_id',
        'role_active',
        'role_permissions',
        // dan lain-lain...
    ]
}
```

Setelah Anda menambahkan atribut-atribut tersebut maka Anda bisa memanggilnya dengan perintah `auth('imissu-web')->user()`. Misal: `auth('imissu-web')->user()->unud_identifier_id`, `auth('imissu-web')->user()->unud_user_type_id`, dan seterusnya.

Selanjutnya, extend WebGuard dengan membuat file WebGuard baru dan mengubah nilai `guards.web` pada file `sso.php`.

```php
/**
 * Load guard class.
 */
'guards' => [
    // Sebelum...
    'web' => RistekUSDI\SSO\Auth\Guard\WebGuard::class,

    // Sesudah...
    'web' => App\Services\Auth\Guard\WebGuard::class,
],
```

**Catatan:** Extend WebGuard berguna jika Anda ingin menyisipkan session aplikasi Anda ke dalam property user saat berhasil melakukan otentikasi.

Pada file WebGuard yang baru, Anda akan melakukan override method `authenticate` dengan tujuan untuk menyisipkan data session dari aplikasi Anda. Data session ini berupa `role_active` dan `role_permissions` yang didapatkan dari facade `AppSession`.

```php
<?php

namespace App\Services\Auth\Guard;

use RistekUSDI\SSO\Auth\Guard\WebGuard as SSOWebGuard;
use RistekUSDI\SSO\Facades\IMISSUWeb;
use App\Facades\AppSession;

class WebGuard extends SSOWebGuard
{
    public function authenticate()
    {
        // Get Credentials
        $credentials = IMISSUWeb::retrieveToken();
        if (empty($credentials)) {
            return false;
        }

        $user = IMISSUWeb::getUserProfile($credentials);
        if (empty($user)) {
            IMISSUWeb::forgetToken();
            return false;
        }
        
        /**
         * NOTE
         * Sometimes, you maybe want to bind user data with session.
         * Here's the way.
         */
        $user = AppSession::bindWithExtraData($user);
        
        $user = $this->provider->retrieveByCredentials($user);
        $this->setUser($user);
        
        return true;
    }

    public function permissions()
    {
        if (! $this->check()) {
            return false;
        }

        // role_permission attribute get from $custom_fillable.
        return $this->user()->role_permissions;
    }

    // Ini digunakan untuk mengubah role active dalam session internal aplikasi
    public function changeRoleActive($role_active)
    {
        AppSession::changeRoleActive($role_active);
        return true;
    }
}
```

File `AppSession.php` di folder `App\Services`.

```php
<?php

namespace App\Services;

class AppSession
{
    public function bindWithExtraData($user)
    {
        $role_active = $this->getRoleActive($user['roles']);
        $role_permissions = $this->getRolePermissions($role_active);
        $data = [
            'role_active' => $role_active,
            'role_permissions' => $role_permissions,
        ];
        
        $user = array_merge($user, $data);
        
        return $user;
    }

    public function getRoleActive($roles = array())
    {
        return (session()->has('role_active')) ? session()->get('role_active') : $roles[0];
    }

    public function changeRoleActive($role_active)
    {
        $this->forgetRoleActive();
        session()->put('role_active', $role_active);
        session()->save();
    }

    public function forgetRoleActive()
    {
        session()->forget('role_active');
        session()->save();
    }

    public function getRolePermissions($role_active)
    {
        $permissions = [
            'Administrator' => [
                'manage-users',
                'manage-roles',
                'impersonate'
            ],
            'Developer' => [
                'manage-settings',
                'manage-users',
                'manage-roles',
                'impersonate'
            ],
            'Operator Fakultas' => [
                'manage-users'
            ]
        ];

        $selected_permissions = [];
        foreach ($permissions as $key => $value) {
            if ($key == $role_active) {
                $selected_permissions = $permissions[$key];
            }
        }

        return $selected_permissions;
    }
}
```

**Catatan:** Silakan buka tautan berjudul [Creating Custom Facades in Laravel](https://medium.com/@cmanish049/creating-custom-facades-in-laravel-b9b72d573752) untuk membuat Laravel Custom Facades.

Jika kita perhatikan sebelumnya ada method `changeRoleActive` di dalam class `WebGuard` dan `AppSession`. Tujuannya adalah Anda ingin mengubah nilai dari atribut-atribut `role_active` dan `role_permissions` saat ingin mengubah role active di aplikasi internal.

Yang perlu Anda lakukan hanyalah tinggal memanggil perintah `Auth::changeRoleActive` di controller yang Anda buat. Berikut contohnya.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class WebSessionController extends Controller
{
    public function changeRoleActive(Request $request)
    {
        $role_active = $request->role_active;
        
        if (Auth::changeRoleActive($role_active)) {
            return response()->json([
                'message' => 'Berhasil mengubah peran aktif',
                'code' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'Cannot change role active',
                'code' => 403
            ], 403);
        }
    }
}
```

File `routes/web.php`.

```php
<?php

use App\Http\Controllers\WebSessionController;

require __DIR__.'/sso.php';

Route::get('/', function () {
    return view('home');
})->middleware('imissu-web');

Route::post('/web-session/change-role-active', [WebSessionController::class, 'changeRoleActive'])->middleware('imissu-web');
```

### Apakah ada contoh kode untuk Konfigurasi Tingkat Lanjut?

Anda bisa melihatnya di [github.com/ristekusdi/test-sso-laravel](https://github.com/ristekusdi/test-sso-laravel). Repositori ini menggunakan Laravel 6.x namun bisa digunakan di versi Laravel lainnya.