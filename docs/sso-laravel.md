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
- app/Http/Controllers/SSO/Web/DemoController.php
- app/Models/SSO/Web/User.php
- config/sso.php
- resources/views/sso-web/basic.blade.php
- resources/views/sso-web/demo.blade.php
- routes/sso-web.php
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

4. Tambahkan route `sso-web.php` ke dalam file `routes/web.php`. Ini berfungsi untuk menambahkan route SSO (login, callback, logout).

```php
require __DIR__.'/sso-web.php';
```

5. Ubah nilai `redirect_url` menjadi `'/sso-web-basic'` di `config/sso.php`.

```diff
- 'redirect_url' => '/',
+ 'redirect_url' => '/sso-web-demo',
```

Hal ini bertujuan ketika login dengan SSO maka langsung diarahkan ke halaman `/sso-web-demo`.

6. Tambahkan route `sso-web-demo.php` ke dalam file `routes/web.php` untuk melihat demo SSO web.

```php
require __DIR__.'/sso-web-demo.php';
```

7. Buka halaman `/sso-web-demo` dengan URL `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-basic` dengan bantuan [Laragon](https://laragon.org/docs/pretty-urls.html).

8. Klik tautan "Basic" dan tampilannya seperti gambar di bawah.

![Image of SSO web basic](/img/sso-web-demo-basic.png)

::: tip RANGKUMAN
Pada tutorial Web Guard tingkat dasar ini kita telah belajar cara:
- Instalasi package ristekusdi/sso-laravel.
- Mengimpor aset yang diperlukan untuk tingkat dasar.
- Mendaftarkan guard dan provider imissu-web di config/auth.php.
- Mendaftarkan route SSO web untuk login, callback, dan logout.
- Mengubah nilai redirect_url di config/sso.php.
- Melihat halaman SSO web demo basic sebagai contoh implementasi Web Guard tingkat dasar.
:::

## Tutorial Web Guard Tingkat Lanjut

Kita akan belajar menyisipkan atribut tambahan seperti `role_active` dan `role_active_permission` di objek pengguna IMISSU dan mengubah nilai dari `role_active` dengan `session`.

::: danger PERINGATAN
Anda diwajibkan mengikuti Tutorial Web Guard Tingkat Dasar terlebih dahulu!
:::

1. Jalankan perintah di bawah ini.
```bash
php artisan vendor:publish --tag=tutorial-sso-laravel-web-advance
```

Perintah tersebut akan mengimpor file resources/views/sso-web/advance.blade.php untuk tahap berikutnya.

2. Akses halaman demo dengan `http://localhost:<port>/sso-web-demo` atau `http://yourapp.test/sso-web-demo` di aplikasi. Klik tautan "Advance" dan Anda akan mendapatkan tampilan halaman berikut.

![Image of SSO web demo advance error](/img/sso-web-demo-advance-error.png)

Pada gambar di atas, kita belum mendapatkan nilai dari peran aktif dan daftar permission yang melekat pada peran aktif (lihat pada tanda `???` di gambar). Tugas kita adalah memperbaiki bug tersebut.

3. Kita akan menerapkan konsep Accessor dan Mutators di Laravel untuk menangani kondisi ini. Buka file `app/Models/SSO/Web/User.php` dan ikuti isian seperti kode di bawah.

```php
<?php

namespace App\Models\SSO\Web;

use RistekUSDI\SSO\Models\Web\User as Model;

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

5. Kita akan mengubah session `role_active`. Tambahkan kode berikut di dalam `app/Model/SSO/Web/User.php`.

```php
// ...
public function changeRoleActive($role_active)
{
    session()->forget('role_active');
    session()->save();
    session()->put('role_active', $role_active);
    session()->save();
}
```

6. Di halaman "Advance" ubah peran Admin menjadi Developer dan hasilnya seperti gambar di bawah.

![Image of SSO web demo advance fix part 2](/img/sso-web-demo-advance-2.png)

Tutorial selesai.

::: tip RANGKUMAN
Pada tutorial Web Guard tingkat lanjut ini kita telah belajar cara:
- Mengimpor aset yang diperlukan untuk tingkat lanjut.
- Menerapkan Accessor dan Mutator untuk atribut tambahan seperti `role_active` dan `role_active_permissions` di User model.
- Mengubah `role_active` melalui User model.
:::

## Web Guard Auth

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