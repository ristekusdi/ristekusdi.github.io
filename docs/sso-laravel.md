# SSO Laravel

Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.

## Tutorial Web Guard Tingkat Dasar

Tutorial ini akan menjelaskan cara memproteksi halaman-halaman dengan otentikasi SSO IMISSU.

1. Instal `ristekusdi/sso-laravel` dengan perintah.

```bash 
composer require ristekusdi/sso-laravel
```

Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dev atau IMISSU2 dan taruh di file `.env`.

2. Jalankan perintah di bawah ini untuk mengimpor file-file yang diperlukan.

```bash
php artisan vendor:publish --tag=sso-laravel-web
```

File-file yang diimpor antara lain:

- app/Http/Controllers/SSO/Web/AuthController.php
- app/Http/Controllers/SSO/Web/BasicController.php
- app/Models/SSO/Web/User.php
- config/sso.php
- resources/views/sso-web/basic.blade.php
- routes/sso-web.php

3. Tambahkan guard dan provider `imissu-web` di `config/auth.php`.

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

<!-- 5. Ubah nilai `redirect_url` 'redirect_url' => '/', -->

5. Tambahkan middleware `imissu-web` pada route yang ingin diproteksi dengan otentikasi SSO di `routes/web.php`. Contohnya pada halaman `/sso-web-basic` yang mana controller dan viewnya sudah diimpor dari langkah 2.

```php
// Location: routes/web.php

// Laravel 8 - 9
Route::get('/sso-web-basic', [App\Http\Controllers\SSO\Web\BasicController::class, 'index'])->middleware('imissu-web');

// Laravel 5.6 - 7
Route::get('/sso-web-basic', 'App\Http\Controllers\SSO\Web\BasicController@index')->middleware('imissu-web');
```

6. Buka halaman `/sso-web-basic` dengan URL `http://localhost:<port>/sso-web-basic` atau `http://yourapp.test/sso-web-basic` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

## Tutorial Web Guard Tingkat Lanjut

Tutorial ini akan menjelaskan menyisipkan atribut tambahan seperti `role_active` dan `role_active_permission` di objek pengguna IMISSU dan mengubah nilai dari `role_active`.

::: danger PERINGATAN
Anda diwajibkan mengikuti Tutorial Web Guard Tingkat Dasar terlebih dahulu!
:::

1. Jalankan perintah di bawah ini.
```bash
php artisan vendor:publish --tag=tutorial-sso-laravel-web-advance
```

Perintah tersebut akan mengimpor file-file yang diperlukan untuk konfigurasi tingkat lanjut.

2. Daftarkan route `sso-web-demo.php` di `routes/web.php`.

```php
require __DIR__.'/sso-web-demo.php';
```

Route ini berisi controller yang mengarah ke halaman demo yang berisi atribut pengguna SSO, mengubah peran aktif (role_active) pengguna, mengecek daftar permission berdasarkan peran aktif pengguna.

3. Akses halaman demo dengan `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-demo` di aplikasi. Anda akan mendapatkan error berikut.

2. Ubah nilai `guard` pada file `config/sso.php`.

```diff{1,2}
-   'guard' => RistekUSDI\SSO\Auth\Guard\WebGuard::class,
+   'guard' => App\Services\Auth\Guard\WebGuard::class,
```

3. Tambahkan nilai `role_active` dan `role_active_permissions` pada array dengan key `user_attributes` di `config/sso.php`.

```php{3,4}
'user_attributes' => [
    // ...
    'role_active'
    'role_active_permissions',
],
```

4. Daftarkan provider `WebSession` di dalam array `providers` dan class alias `WebSession` di dalam array `aliases` di `config/app.php`.

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

5. Untuk menyisipkan atribut `role_active` dan `role_active_permissions` aktifkan fungsi `WebSession::bind($user)` di `WebGuard.php`.

```php{6,18}
<?php

namespace App\Services\Auth\Guard;

use RistekUSDI\SSO\Auth\Guard\WebGuard as Guard;
use RistekUSDI\SSO\Facades\IMISSUWeb;
use App\Facades\WebSession;

class WebGuard extends Guard
{
    public function authenticate()
    {
        //...   
        /**
         * NOTE
         * Here's the way you want to bind user with additional data from database or session.
         */
        $user = WebSession::bind($user);
        
        $user = $this->provider->retrieveByCredentials($user);
        $this->setUser($user);
        
        return true;
    }
}
```

5. Sisipkan atribut tambahan `role_active` dan `role_active_permissions` ke objek user kita akan `WebSession.php`.

```php
// Location: app/Services/WebSession.php
<?php

namespace App\Services;

class WebSession
{
    public function bind($user)
    {
        $role_active = $this->getRoleActive($user['roles']);
        $role_active_permissions = $this->getRoleActivePermissions($role_active);
        $data = [
            'role_active' => $role_active,
            'role_active_permissions' => $role_active_permissions,
        ];
        
        $user = array_merge($user, $data);
        
        return $user;
    }

    public function getRoleActive($roles = array())
    {
        return (session()->has('role_active')) ? session()->get('role_active') : $roles[0];
    }

    public function getRoleActivePermissions($role_active)
    {
        $permissions = [
            'Admin' => [
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

5. Tambahkan perintah `WebSession::forget()` pada baris paling atas di dalam method `logout()`. Hal ini bertujuan untuk menghapus session `role_active`.

```php{5,14}
// Location: app/Http/Controllers/SSO/Web/AuthController.php
<?php

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

6. Tambahkan method `forget()` di `WebSession.php`.

```php
// Location: app/Services/WebSession.php
<?php

namespace App\Services;

class WebSession
{
    /**
     * Forget selected session from app
     * Dear maintainer and developers:
     * Please don't use session()->flush() 
     * because it also remove session SSO like access_token and refresh_token!
     * Use session()->forget() instead!
     */
    public function forget()
    {
        session()->forget(['role_active']);
        session()->save();
    }
}
```

7. Tambahkan fungsi `changeRoleActive()` di `WebSession.php` untuk mengubah nilai `role_active` setiap berganti peran.

```php{8-14}
// Location: app/Services/WebSession.php
<?php

namespace App\Services;

class WebSession
{
    public function changeRoleActive($role_active)
    {
        session()->forget('role_active');
        session()->save();
        session()->put('role_active', $role_active);
        session()->save();
    }
}
```

8. Tambahkan fungsi `changeRoleActive()` di `WebGuard.php`.

```php{8,12-16}
// Location: app/Services/Auth/Guard/WebGuard.php
<?php

namespace App\Services\Auth\Guard;

use RistekUSDI\SSO\Auth\Guard\WebGuard as Guard;
use RistekUSDI\SSO\Facades\IMISSUWeb;
use App\Facades\WebSession;

class WebGuard extends Guard
{
    public function changeRoleActive($role_active)
    {
        WebSession::changeRoleActive($role_active);
        return true;
    }
}
```

Berikutnya, bila ingin mengubah nilai `role_active` maka jalankan perintah `Auth::guard('imissu-web')->changeRoleActive($role_active)` atau `auth('imissu-web')->changeRoleActive($role_active)`.

9. Tambahkan fungsi `changeRoleActive()` di `WebSessionController.php`.

```php{8,12-25}
// Location: app/Http/Controllers/SSO/Web/WebSessionController.php
<?php

namespace App\Http\Controllers\SSO\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;

class WebSessionController extends Controller
{
    public function changeRoleActive(Request $request)
    {
        if (Auth::guard('imissu-web')->changeRoleActive($request->role_active)) {
            return response()->json([
                'message' => 'Berhasil mengubah peran aktif',
                'code' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'Gagal mengubah peran aktif',
                'code' => 403
            ], 403);
        }
    }
}
```

10. Tambahkan fungsi mengubah nilai `role_active` di `web-session.php`.

```php
// Location: routes/web-session.php
<?php

use Illuminate\Support\Facades\Route;

Route::post('/web-session/change-role-active', 'SSO\Web\WebSessionController@changeRoleActive')->middleware('imissu-web');
```

11. Daftarkan route `web-session.php` di `routes/web.php`.

```php
require __DIR__.'/web-session.php';
```

12. Buka halaman `http://localhost:<your-port-number>/sso-web-demo` untuk melihat hasil yang sudah dikerjakan.

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