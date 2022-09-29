# SSO Laravel

Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.

## Tutorial Web Guard - Tingkat Dasar

Tutorial ini akan menjelaskan cara memproteksi halaman-halaman dengan otentikasi SSO IMISSU.

1. Instal `ristekusdi/sso-laravel` dengan perintah.

```bash 
composer require ristekusdi/sso-laravel
```

Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dev atau IMISSU2 dan taruh di file `.env`.

2. Jalankan perintah di bawah ini.

```bash
php artisan vendor:publish --tag=sso-laravel-web-demo-basic
```

Perintah di atas untuk mengimpor file-file antara lain:

- app/Http/Controllers/SSO/Web/AuthController.php
- app/Http/Controllers/SSO/Web/DemoController.php
- app/Models/SSO/Web/User.php
- config/sso.php
- resources/views/sso-web/basic.blade.php
- resources/views/sso-web/demo.blade.php
- routes/sso-web-demo.php

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

4. Impor route `sso-web` dengan perintah berikut.

```bash
// Laravel 6 - 7
php artisan vendor:publish --tag=sso-laravel-web-route-v1

// Laravel 8 - 9
php artisan vendor:publish --tag=sso-laravel-web-route-v2
```

Perintah ini akan menghasilkan file `sso-web.php` di folder `routes`.

5. Tambahkan route `sso-web.php` ke dalam file `routes/web.php`. Ini berfungsi untuk menambahkan route SSO (login, callback, logout).

```php
require __DIR__.'/sso-web.php';
```

6. Ubah nilai `redirect_url` menjadi `'/sso-web-basic'` di `config/sso.php`.

```diff
- 'redirect_url' => '/',
+ 'redirect_url' => '/sso-web-demo',
```

Hal ini bertujuan ketika login dengan SSO maka langsung diarahkan ke halaman `/sso-web-demo`.

7. Tambahkan route `sso-web-demo.php` ke dalam file `routes/web.php` untuk melihat demo SSO web.

```php
require __DIR__.'/sso-web-demo.php';
```

8. Buka halaman `/sso-web-demo` dengan URL `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-basic` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

9. Klik tautan "Basic" dan tampilannya seperti gambar di bawah.

![Image of SSO web basic](/img/sso-web-demo-basic.png)

::: tip RANGKUMAN
Pada tutorial Web Guard tingkat dasar ini kita telah belajar cara:
- Instalasi package ristekusdi/sso-laravel.
- Mendaftarkan guard dan provider imissu-web di config/auth.php.
- Mendaftarkan route SSO web untuk login, callback, dan logout.
- Mengubah nilai redirect_url di config/sso.php.
- Melihat halaman SSO web demo basic sebagai contoh implementasi Web Guard tingkat dasar.
:::

## Tutorial Web Guard - Tingkat Lanjut

::: danger PERINGATAN
Anda diwajibkan mengikuti Tutorial Web Guard Tingkat Dasar terlebih dahulu!
:::

Kita akan belajar menyisipkan atribut tambahan seperti `role_active` dan `role_active_permission` di objek pengguna IMISSU dan mengubah nilai dari `role_active` dengan `session`.

1. Jalankan perintah di bawah ini.
```bash
php artisan vendor:publish --tag=sso-laravel-web-demo-advance
```

Perintah tersebut akan mengimpor file resources/views/sso-web/advance.blade.php untuk tahap berikutnya.

2. Akses halaman demo dengan `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-demo` di aplikasi. Klik tautan "Advance" dan Anda akan mendapatkan tampilan halaman berikut.

![Image of SSO web demo advance error](/img/sso-web-demo-advance-error.png)

Pada gambar di atas, kita belum mendapatkan nilai dari peran aktif dan daftar permission yang melekat pada peran aktif (lihat pada tanda `???` di gambar). Tugas kita adalah memperbaiki bug tersebut.

3. Kita akan menerapkan [konsep Accessor dan Mutators Laravel](https://laravel.com/docs/8.x/eloquent-mutators#accessors-and-mutators) untuk menangani kondisi ini. Buka file `app/Models/SSO/Web/User.php` dan ikuti isian seperti kode di bawah.

```php
<?php

namespace App\Models\SSO\Web;

use RistekUSDI\SSO\Laravel\Models\Web\User as Model;

class User extends Model
{
    protected $appends = ['role_active', 'role_active_permissions'];

    public function setRoleActiveAttribute($value)
    {
        if (session()->has('role_active')) {
            $this->attributes['role_active'] = session()->get('role_active');
        } else {
            session()->put('role_active', $value);
            session()->save();
            $this->attributes['role_active'] = $value;
        }
    }

    public function getRoleActiveAttribute()
    {
        if (session()->has('role_active')) {
            return $this->attributes['role_active'] = session()->get('role_active');
        } else {
            return $this->attributes['role_active'] = $this->roles['0'];
        }
    }

    public function getRoleActivePermissionsAttribute()
    {
        $role_active = $this->roles['0'];
        if (session()->has('role_active')) {
            $role_active = session()->get('role_active');
        }

        $permissions = [
            'Admin' => [
                'disable-user',
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

        return $this->attributes['role_active_permissions'] = $selected_permissions;
    }
}
```

4. Refresh halaman "Advance" maka nilai `role_active` dan `role_active_permissions` sudah berubah seperti gambar di bawah.

![Image of SSO web demo advance fix part 1](/img/sso-web-demo-advance-1.png)

5. Kita akan mengubah session `role_active`. Tambahkan kode berikut di dalam group middleware `imissu-web` di file `routes/sso-web-demo.php`.

```php
Route::middleware(['imissu-web'])->group(function () {
    //...

    // Laravel 6 - 7
    Route::post('/sso-web-demo/change-role-active', 'App\Http\Controllers\SSO\Web\DemoController@changeRoleActive');

    // Laravel 8 - 9
    Route::post('/sso-web-demo/change-role-active', [App\Http\Controllers\SSO\Web\DemoController::class, 'changeRoleActive']);
});
```

6. Tambahkan kode berikut di `resources/views/sso-web/advance.blade.php`.

```html
<input type="hidden" name="url_change_role_active" value="{{ url('/sso-web-demo/change-role-active') }}">

<script>
    document.getElementById('roles-combo').onchange = function (e) {
        const value = e.target.value;
        const url = document.querySelector('input[name="url_change_role_active"]').value;
        const current_url = document.querySelector('input[name="current_url"]').value;
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        if (value != '0') {
            fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRF-TOKEN': token
                },
                method: 'POST',
                credentials: 'same-origin',
                body: `role_active=${value}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.code == 200) {
                    window.location.href = current_url;
                } else {
                    alert(data.message);
                }
            });
        }
    }
</script>
```

7. Tambahkan kode berikut di `app/Http/Controllers/Web/DemoController.php`.

```php{4}
// ..
public function changeRoleActive(Request $request)
{   
    auth('imissu-web')->user()->changeRoleActive($request->role_active);
    if (auth('imissu-web')->user()->role_active === $request->role_active) {
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
```

8. Tambahkan kode berikut di `app/Model/SSO/Web/User.php`.

```php{2}
// ...
public function changeRoleActive($role_active)
{
    session()->forget('role_active');
    session()->save();
    session()->put('role_active', $role_active);
    session()->save();
}
```

9. Di halaman "Advance" ubah peran Admin menjadi Developer dan hasilnya seperti gambar di bawah.

![Image of SSO web demo advance fix part 2](/img/sso-web-demo-advance-2.png)

Kita telah menambahkan atribut tambahan dari session aplikasi. Bagaimana cara menghapusnya saat pengguna keluar aplikasi? Jika Anda sudah mengikuti langkah 5 sampai 8 mungkin Anda sudah menemukan caranya. Jika belum, kita lanjutkan tutorial ini.

11. Sisipkan baris perintah berikut di method `logout()` di baris pertama di `app/Http/Controllers/SSO/Web/AuthController.php`.

```php{3}
public function logout()
{
    auth('imissu-web')->user()->forgetSession();
    $token = IMISSUWeb::retrieveToken();
    IMISSUWeb::forgetToken();

    $url = IMISSUWeb::getLogoutUrl($token['id_token']);
    return redirect($url);
}
```

Di baris ke-3 yang disoroti tersebut kita menyisipkan perintah `forgetSession()`.

12. Tambahkan kode berikut di `app/Models/SSO/Web/User.php`

```php{2}
// ...
public function forgetSession()
{
    session()->forget(['role_active', 'role_active_permissions']);
    session()->save();
}
```

::: warning PERINGATAN
Jika kita menggunakan perintah `session()->flush()` maka akan menghapus session `access_token` dan `refresh_token` SSO. Sehingga, kita gunakan `session()->forget()` sebagai penggantinya.
:::

Klik tautan "Log out" dan session aplikasi terhapus saat pengguna keluar dari aplikasi.

Tutorial selesai. :tada:

::: tip RANGKUMAN
Pada tutorial Web Guard tingkat lanjut ini kita telah belajar cara:
- Menerapkan Accessor dan Mutator untuk atribut tambahan seperti `role_active` dan `role_active_permissions` di User model.
- Mengubah `role_active` dari langkah 5 sampai 8.
:::

## Tutorial Web Guard - Refactoring

Refactoring adalah proses mengubah struktur kode program tanpa mengubah atau menambah fungsi program yang sudah ada. 

Manfaat dari proses refactoring antara lain memudahkan program dibaca oleh programmer lain karena baris kode dirampingkan dan memudahkan programmer dan programmer lainnya membaca kode program.

Pada tutorial Web Guard tingkat lanjut kita sudah menyisipkan atribut tambahan seperti `role_active` dan `role_active_permissions` dari session aplikasi, mengubah session `role_active`, dan menghapus session aplikasi. Setiap sistem pasti memiliki kebutuhan atribut-atribut tambahan yang beragam dan pasti akan membuat baris kode dalam suatu file akan panjang sehingga sulit dibaca oleh programmer.

Disinilah peran penting dari Refactoring! Kita akan memulai proses refactoring.

1. Jalankan perintah di bawah ini.

```bash
php artisan vendor:publish --tag=sso-laravel-web-session
```

Perintah di atas untuk mengimpor file-file antara lain:

- app/Facades/WebSession.php
- app/Providers/WebSessionProvider.php
- app/Services/WebSession.php
- routes/web-session.php

2. Daftarkan route `web-session.php` ke dalam file `routes/web.php`.

```php
require __DIR__.'/web-session.php';
```

3. Hapus baris kode di file `routes/sso-web-demo.php` dan tambahkan baris kode di file `routes/web-session.php`.

```diff
// routes/sso-web-demo.php
// Laravel 6 - 7
- Route::post('/sso-web-demo/change-role-active', 'App\Http\Controllers\SSO\Web\DemoController@changeRoleActive']);
// Laravel 8 - 9
- Route::post('/sso-web-demo/change-role-active', [App\Http\Controllers\SSO\Web\DemoController::class, 'changeRoleActive']);

// routes/web-session.php
// Laravel 6 - 7
+ Route::post('/web-session/change-role-active', 'App\Http\Controllers\SSO\Web\SessionController@changeRoleActive');
// Laravel 8 - 9
+ Route::post('/web-session/change-role-active', [App\Http\Controllers\SSO\Web\SessionController::class, 'changeRoleActive']);
```

4. Hapus baris kode di `app/Http/Controllers/SSO/Web/DemoController.php`.

```diff
- public function changeRoleActive(Request $request)
- {   
-    auth('imissu-web')->user()->changeRoleActive($request->role_active);
-    if (auth('imissu-web')->user()->role_active === $request->role_active) {
-        return response()->json([
-            'message' => 'Berhasil mengubah peran aktif',
-            'code' => 200
-        ], 200);
-    } else {
-        return response()->json([
-            'message' => 'Gagal mengubah peran aktif',
-            'code' => 403
-        ], 403);
-    }
- }
```

5. Tambahkan baris kode di `app/Http/Controllers/SSO/Web/AuthController.php`.

```diff
+ public function changeRoleActive(Request $request)
+ {   
+    auth('imissu-web')->user()->changeRoleActive($request->role_active);
+    if (auth('imissu-web')->user()->role_active === $request->role_active) {
+        return response()->json([
+            'message' => 'Berhasil mengubah peran aktif',
+            'code' => 200
+        ], 200);
+    } else {
+        return response()->json([
+            'message' => 'Gagal mengubah peran aktif',
+            'code' => 403
+        ], 403);
+    }
+ }
```

6. Daftarkan provider `WebSession` dan class `WebSession` di `config/app.php`.

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

7. Refactor kode program di `app/Models/SSO/Web/User.php`.

```php{5,14,19,24,29,34}
<?php

namespace App\Models\SSO\Web;

use App\Facades\WebSession;
use RistekUSDI\SSO\Laravel\Models\Web\User as Model;

class User extends Model
{
    protected $appends = ['role_active', 'role_active_permissions'];

    public function setRoleActiveAttribute($value)
    {
        $this->attributes['role_active'] = WebSession::setRoleActive($value);
    }

    public function getRoleActiveAttribute()
    {
        return $this->attributes['role_active'] = WebSession::getRoleActive($this->roles['0']);
    }

    public function getRoleActivePermissionsAttribute()
    {
        return $this->attributes['role_active_permissions'] = WebSession::getRoleActivePermissions($this->roles['0']);
    }

    public function changeRoleActive($role_active)
    {
        WebSession::changeRoleActive($role_active);
    }

    public function forgetSession()
    {
        WebSession::forgetSession();
    }
}
```

8. Tambahkan kode program berikut di `app/Services/WebSession.php`.

```php
<?php

namespace App\Services;

class WebSession
{
    public function setRoleActive($value)
    {
        if (session()->has('role_active')) {
            return session()->get('role_active');
        } else {
            session()->put('role_active', $value);
            session()->save();
            return $value;
        }
    }

    public function getRoleActive($role)
    {
        if (session()->has('role_active')) {
            return session()->get('role_active');
        } else {
            return $role;
        }
    }

    public function getRoleActivePermissions($role)
    {
        $role_active = $role;
        if (session()->has('role_active')) {
            $role_active = session()->get('role_active');
        }

        $permissions = [
            'Admin' => [
                'disable-user',
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

    public function changeRoleActive($role_active)
    {
        session()->forget('role_active');
        session()->save();
        session()->put('role_active', $role_active);
        session()->save();
    }

    public function forgetSession()
    {
        session()->forget(['role_active', 'role_active_permissions']);
        session()->save();
    }
}
```

7. Ganti baris kode di `resources/views/sso-web/advance.blade.php`.

```diff
- <input type="hidden" name="url_change_role_active" value="{{ url('/sso-web-demo/change-role-active') }}">
+ <input type="hidden" name="url_change_role_active" value="{{ url('/web-session/change-role-active') }}">
```

8. Cek ulang apakah halaman "Advance" masih tetap berjalan sebelum direfactoring. Jika berhasil maka proses refactoring sudah berhasil. Jika gagal silakan cek kembali langkah-langkah di atas.

## Web Guard - Auth

Berikut perintah-perintah yang digunakan untuk mengakses data pengguna SSO.

```php
# Attributes

// sub adalah id user di Keycloak.
// TIDAK DIREKOMENDASIKAN menggunakan atribut ini utk menyimpan nilai.
auth('imissu-web')->user()->sub;
auth('imissu-web')->user()->preferred_username;
auth('imissu-web')->user()->name;
auth('imissu-web')->user()->email;

// Daftar peran pengguna dalam suatu aplikasi.
auth('imissu-web')->user()->roles;

// id user di Unud.
auth('imissu-web')->user()->unud_identifier_id;

// id sso Unud.
// DIREKOMENDASIKAN untuk menggunakan atribut ini untuk menyimpan nilai.
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

// Mendapatkan daftar peran aplikasi pengguna dalam bentuk array.
// sama dengan auth('imissu-web')->user()->roles
auth('imissu-web')->user()->roles();

// Mengecek apakah pengguna memiliki peran tertentu dalam daftar peran aplikasi. 
// Nilai `$roles` bertipe string atau array.
auth('imissu-web')->user()->hasRole($roles);

// Mengecek apakah pengguna sedang dalam peran aktif tertentu.
auth('imissu-web')->user()->hasRoleActive($roles);

// Mengecek apakah pengguna memiliki permissions yang melekat pada peran aktif pengguna.
// Nilai `$permissions` bertipe string atau array.
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

// Middleware untuk mengecek apakah pengguna memiliki peran Admin dan atau Developer
// Jika peran yang ingin dicek lebih dari satu maka gunakan tanda "|"
Route::middleware('imissu-web.role:Admin|Developer');

// Middleware untuk mengecek apakah pengguna memiliki peran aktif sebagai Admin atau Developer
// Jika peran aktif yang ingin dicek lebih dari satu maka gunakan tanda "|"
Route::middleware('imissu-web.role_active:Admin|Developer');

// Middleware untuk mengecek apakah pengguna memiliki permission user.create dan atau user.view
// Jika permission yang ingin dicek lebih dari satu maka gunakan tanda "|"
Route::middleware('imissu-web.permission:user.create|user.view');
```

## Soal Sering Ditanya

### Bagaimana cara mendapatkan access token dan refresh token?

Ada dua cara untuk mendapatkan access token dan refresh token:

1. Mengimpor facade `IMISSUWeb` dengan perintah `use RistekUSDI\SSO\Laravel\Facades\IMISSUWeb;`, kemudian jalankan perintah `IMISSUWeb::retrieveToken()`.

2. Menggunakan session. Gunakan perintah `session()->get('_sso_token.access_token')` untuk mendapatkan access token dan `session()->get('_sso_token.refresh_token')`.