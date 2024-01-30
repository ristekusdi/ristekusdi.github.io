# SSO Laravel

Petunjuk penggunaan pustaka SSO Laravel Universitas Udayana.

## Prasyarat

- PHP versi minimal 7.4.
- Laravel versi 6 sampai 10.

> Catatan saat pengujian tutorial dilakukan pada Laravel versi 8. Bila Anda mengalami kendala silakan buat [isu di ristekusdi/sso-laravel](https://github.com/ristekusdi/sso-laravel/issues).

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

// Laravel 8 ke atas
php artisan vendor:publish --tag=sso-laravel-web-route-v2
```

Perintah ini akan menghasilkan file `sso-web.php` di folder `routes`. Isi dari file tersebut adalah route dengan method `login`, `callback`, `logout`.

5. Tambahkan route `sso-web.php` ke dalam file `routes/web.php`.

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

8. Buka halaman `/sso-web-demo` dengan URL `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-demo` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

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

Kita akan belajar menyisipkan atribut tambahan seperti `roles`, `role` di objek pengguna IMISSU. Lalu, kita akan mengubah nilai dari atribut `role` dengan perintah `session`.

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
    protected $appends = ['roles', 'role'];

    public function getRolesAttribute()
    {
        if (session()->has('roles')) {
            return $this->attributes['roles'] = session()->get('roles');
        } else {
            $client_roles = $this->getAttribute('client_roles');
            $permissions = [
                'Admin USDI' => [
                    'user:view',
                    'user:edit',
                    'user:delete'
                ],
                'Developer USDI' => [
                    'user:view',
                    'user:create',
                    'user:edit',
                    'user:delete'
                ],
                'Pegawai' => [
                    'profile:view',
                    'profile:edit'
                ],
            ];
            
            $roles = [];
            foreach ($client_roles as $client_role) {
                array_push($roles, ['name' => $client_role]);
            }

            foreach ($roles as $key => $role) {
                foreach ($permissions as $_key => $perm) {
                    if ($role['name'] === $_key) {
                        $roles[$key]['permissions'] = $permissions[$_key];
                    }
                }
            }

            $roles = json_decode(json_encode($roles));
            session()->put('roles', $roles);
            return $this->attributes['roles'] = session()->get('roles');
        }
    }

    public function getRoleAttribute()
    {
        if (session()->has('role')) {
            return $this->attributes['role'] = session()->get('role');
        } else {
            return $this->attributes['role'] = $this->getAttribute('roles')['0'];
        }
    }
}
```

4. Refresh halaman "Advance" maka nilai dari field `Peran Aktif` sudah berubah seperti gambar di bawah.

![Image of SSO web demo advance fix part 1](/img/sso-web-demo-advance-1.png)

5. Kita akan mengubah session `role`. Tambahkan kode berikut di dalam group middleware `imissu-web` di file `routes/sso-web-demo.php`.

```php
Route::middleware(['imissu-web'])->group(function () {
    //...

    // Laravel 6 - 7
    Route::post('/sso-web-demo/change-current-role', 'App\Http\Controllers\SSO\Web\DemoController@changeCurrentRole');

    // Laravel 8 ke atas
    Route::post('/sso-web-demo/change-current-role', [App\Http\Controllers\SSO\Web\DemoController::class, 'changeCurrentRole']);
});
```

6. Tambahkan kode berikut di `resources/views/sso-web/advance.blade.php` sebelum tag `</body>`.

```html
<input type="hidden" name="url_change_current_role" value="{{ url('/sso-web-demo/change-current-role') }}">

<script>
    document.getElementById('roles').onchange = function (e) {
        const value = e.target.value;
        const url = document.querySelector('input[name="url_change_current_role"]').value;
        const current_url = document.querySelector('input[name="current_url"]').value;
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        if (value != '0') {
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify({ role: value })
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
public function changeCurrentRole(Request $request)
{   
    $role = json_decode($request->role);
    auth('imissu-web')->user()->changeCurrentRole($role);
    if (auth('imissu-web')->user()->role === $role) {
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
public function changeCurrentRole($role)
{
    session()->forget('role');
    session()->put('role', $role);
}
```

9. Di halaman "Advance" ubah peran Pegawai menjadi Developer dan hasilnya seperti gambar di bawah.

![Image of SSO web demo advance fix part 2](/img/sso-web-demo-advance-2.png)

Kita telah menambahkan atribut tambahan dari session aplikasi. Bagaimana cara menghapusnya saat pengguna keluar aplikasi? Jika Anda sudah mengikuti langkah 5 sampai 8 mungkin Anda sudah menemukan caranya. Jika belum, kita lanjutkan tutorial ini.

10. Sisipkan baris perintah `session()->flush()` untuk menghapus semua session di method `logout()` di `app/Http/Controllers/SSO/Web/AuthController.php`.

```php{3}
public function logout()
{
    session()->flush();
    $url = IMISSUWeb::getLogoutUrl();
    return redirect($url);
}
```

Klik tautan "Log out" dan session aplikasi terhapus saat pengguna keluar dari aplikasi.

Tutorial selesai. :tada:

::: tip RANGKUMAN
Pada tutorial Web Guard tingkat lanjut ini kita telah belajar cara:
- Menerapkan Accessor dan Mutator untuk atribut tambahan seperti `roles` dan `role` di User model.
- Mengubah `role` dari langkah 5 sampai 8.
:::

## Tutorial Web Guard - Refactoring

Pada tutorial Web Guard tingkat lanjut kita sudah menyisipkan atribut tambahan seperti `roles`, `roles` dari session aplikasi, mengubah session `role`, dan menghapus session aplikasi. Setiap sistem pasti memiliki kebutuhan atribut-atribut tambahan yang beragam dan pasti akan membuat baris kode dalam suatu file akan panjang sehingga sulit dibaca oleh programmer. Maka dari itu dibutuhkan proses refactoring. Refactoring adalah proses mengubah struktur kode program tanpa mengubah perilaku dari kode program. Salah satu manfaat dari proses refactoring adalah memudahkan kode program dibaca dan dipahami oleh programmer lain saat berkolaborasi membuat program perangkat lunak.

1. Jalankan perintah di bawah ini.

```bash
php artisan vendor:publish --tag=sso-laravel-web-session
```

Perintah di atas untuk mengimpor file-file antara lain:

- app/Http/Controllers/SSO/Web/SessionController.php
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
- Route::post('/sso-web-demo/change-current-role', 'App\Http\Controllers\SSO\Web\DemoController@changeCurrentRole']);
// Laravel 8 ke atas
- Route::post('/sso-web-demo/change-current-role', [App\Http\Controllers\SSO\Web\DemoController::class, 'changeCurrentRole']);

// routes/web-session.php
// Laravel 6 - 7
+ Route::post('/web-session/change-current-role', 'App\Http\Controllers\SSO\Web\SessionController@changeCurrentRole');
// Laravel 8 ke atas
+ Route::post('/web-session/change-current-role', [App\Http\Controllers\SSO\Web\SessionController::class, 'changeCurrentRole']);
```

4. Pindahkan method `changeCurrentRole()` dari file `app/Http/Controllers/SSO/Web/DemoController.php` ke file `app/Http/Controllers/SSO/Web/SessionController.php`.

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
    protected $appends = ['roles', 'role'];

    public function getRolesAttribute()
    {
        return $this->attributes['roles'] = WebSession::getRoles($this->getAttribute('client_roles'));
    }

    public function getRoleAttribute()
    {
        return $this->attributes['role'] = WebSession::getRole($this->getAttribute('roles')['0']);
    }

    public function changeCurrentRole($role)
    {
        WebSession::changeCurrentRole($role);
    }
}
```

8. Tambahkan kode program berikut di `app/Services/WebSession.php`.

```php
<?php

namespace App\Services;

class WebSession
{
    public function getRoles($client_roles)
    {
        if (session()->has('roles')) {
            return session()->get('roles');
        } else {
            $permissions = [
                'Super Admin' => [
                    'user:view',
                    'user:create',
                    'user:edit',
                    'user:delete'
                ],
                'Admin' => [
                    'user:view',
                    'user:edit',
                ],
                'Pegawai' => [
                    'profile:view',
                    'profile:edit'
                ],
            ];

            $roles = [];
            foreach ($client_roles as $client_role) {
                array_push($roles, ['name' => $client_role]);
            }

            foreach ($roles as $key => $role) {
                foreach ($permissions as $_key => $perm) {
                    if ($role['name'] === $_key) {
                        $roles[$key]['permissions'] = $permissions[$_key];
                    }
                }
            }

            $roles = json_decode(json_encode($roles));
            session()->put('roles', $roles);
            return session()->get('roles');
        }   
    }

    public function getRole($role)
    {
        if (session()->has('role')) {
            return session()->get('role');
        } else {
            return $role;
        }
    }

    public function changeCurrentRole($role)
    {
        session()->forget('role');
        session()->put('role', $role);
    }
}
```

7. Ganti baris kode di `resources/views/sso-web/advance.blade.php`.

```diff
- <input type="hidden" name="url_change_current_role" value="{{ url('/sso-web-demo/change-current-role') }}">
+ <input type="hidden" name="url_change_current_role" value="{{ url('/web-session/change-current-role') }}">
```

8. Cek ulang apakah halaman "Advance" masih tetap berjalan sebelum direfactoring. Jika berhasil maka proses refactoring sudah berhasil. Jika gagal silakan cek kembali langkah-langkah di atas.

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

Ada dua cara untuk mendapatkan access token dan refresh token:

1. Mengimpor facade `IMISSUWeb` dengan perintah `use RistekUSDI\SSO\Laravel\Facades\IMISSUWeb;`, kemudian jalankan perintah `IMISSUWeb::retrieveToken()`.

2. Menggunakan session. Gunakan perintah `session()->get('_sso_token.access_token')` untuk mendapatkan access token dan `session()->get('_sso_token.refresh_token')`.
