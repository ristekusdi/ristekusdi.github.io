# SSO PHP

Petunjuk penggunaan pustaka SSO PHP Universitas Udayana.

## Memasang Nilai Environment

Anda akan mendapatkan isian konfigurasi berikut setelah membuat client app dan menyalin environment client app di IMISSU2.

```bash
SSO_ADMIN_URL=https://your-sso-domain.com
SSO_BASE_URL=https://your-sso-domain.com
SSO_REALM=master
SSO_REALM_PUBLIC_KEY=xxxxxxxxxx
SSO_CLIENT_ID=xxxxxxx
SSO_CLIENT_SECRET=xxxxxx
SSO_CALLBACK=http://yourapp.test/sso/callback
```

Isian konfigurasi tersebut dipasang pada file `.env`.

- `SSO_ADMIN_URL` adalah URL server admin SSO.
- `SSO_BASE_URL` adalah URL server SSO.
- `SSO_REALM` adalah "realm" tempat client app Anda berada yang didapatkan dari IMISSU Dashboard.
- `SSO_REALM_PUBLIC_KEY` adalah realm public key server SSO yang didapatkan dari IMISSU Dashboard.
- `SSO_CLIENT_ID` adalah client id yang didapatkan dari IMISSU Dashboard.
- `SSO_CLIENT_SECRET` adalah client secret yang didapatkan dari IMISSU Dashboard.
- `SSO_CALLBACK` adalah callback URL yang berfungsi ketika proses login berhasil dari SSO.

## Instalasi

Gunakan perintah di bawah ini untuk menginstal package ristekusdi/sso-php

```bash
composer require ristekusdi/sso-php
```

## Pengaturan

Pengaturan dibagi menjadi dua bagian yakni [PHP](#php) dan [CodeIgniter 3.x](#codeigniter-3-x).

### PHP

Jalankan perintah berikut untuk menyalin file SSO yang ada di `ristekusdi/sso-php`.

```
./vendor/bin/sso copy:file --type=php
```

Atau bila Anda menggunakan terminal bawaan Laragon (CMDER) gunakan perintah di bawah.

```
.\vendor\bin\sso copy:file --type=php
```

File SSO yang disalin akan ditaruh di dalam folder `sso` di direktori root proyek Anda.

### CodeIgniter 3.x

1. Jalankan perintah berikut untuk menyalin file SSO yang ada di `ristekusdi/sso-php`.

```
./vendor/bin/sso copy:file --type=ci3
```

Atau bila Anda menggunakan terminal bawaan Laragon (CMDER) gunakan perintah di bawah.

```
.\vendor\bin\sso copy:file --type=ci3
```

File-file SSO yang disalin antara lain:

- `Netauth.php` di folder `application/controllers`.
- `Webauth.php` di folder `application/libraries`.

2. Hubungkan controller `Webauth.php` ke dalam routing di file `application/config/routes.php`.

```php
$route['sso/login'] = 'webauth/login';
$route['sso/logout'] = 'webauth/logout';
$route['sso/callback'] = 'webauth/callback';
$route['sso/change_role_active'] = 'webauth/change_role_active';
$route['sso/change_kv_active'] = 'webauth/change_kv_active';
```

3. Tambahkan `webauth` sebagai autoload library di direktori `application/config/autoload.php`

```php
// ... artinya autoload library yang sudah pernah Anda tambahkan sebelumnya
$autoload['libraries'] = array('...','webguard');
```

4. Lakukan perubahan nilai pada `base_url`, `composer_autoload` dan `enable_hooks` di file `application/config/config.php`.

```php
<?php

// Auto detection base_url
$config['base_url'] = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "https" : "http");
$config['base_url'] .= "://".$_SERVER['HTTP_HOST'];
$config['base_url'] .= str_replace(basename($_SERVER['SCRIPT_NAME']),"",$_SERVER['SCRIPT_NAME']);

// Ubah lokasi autoload composer di direktori `vendor` pada root project.
$config['composer_autoload'] = "./vendor/autoload.php";

// Aktifkan hooks pada file `application/config/hooks.php`.
$config['enable_hooks'] = TRUE;
```

5. Untuk mengambil nilai dari file `.env` dengan perintah `$_ENV['nama_key']`, masukkan sintaks berikut di dalam file `application/config/hooks.php`.

```php
$hook['pre_system'] = function () {
    $dotenv = Dotenv\Dotenv::createImmutable(FCPATH);
    $dotenv->load();
};
```

6. Agar halaman tertentu di dalam suatu proyek dilindungi oleh autentikasi, tambahkan perintah `$this->webauth->authenticated()` ke dalam `constructor` di suatu controller. Sehingga jika pengguna mengakses halaman tertentu belum terautentikasi maka di arahkan ke halaman login SSO.

## Daftar Perintah Auth

Daftar perintah auth terbagi menjadi dua bagian yakni [PHP](#auth-php) dan [CodeIgniter 3.x](#auth-codeigniter-3-x).

### Auth PHP

Pustaka ini mengimplementasikan `Illuminate\Contracts\Auth\Guard` dari Laravel sehingga seolah-olah Anda seperti menggunakan Laravel.

Caranya adalah dengan mengimpor class `WebGuard` dengan perintah `use RistekUSDI\SSO\PHP\Auth\Guard\WebGuard;` maka Anda akan memiliki beberapa fungsi berikut.

##### `(new WebGuard())->check()`

Mengecek apakah pengguna sudah terotentikasi atau login.

##### `(new WebGuard())->guest()`

Mengecek apakah pengguna adalah "tamu" (belum login atau terotentikasi).

##### `(new WebGuard())->user()`

Mendapatkan data pengguna yang terotentikasi.

Atribut pengguna yang tersedia antara lain:

- `sub`
- `full_identity` dalam bentuk NIP - Nama Pengguna
- `username`
- `identifier` adalah NIP atau NIM.
- `name`
- `email`
- `roles`
- `unud_identifier_id`
- `unud_type_id`

Cara mengakses atribut tersebut dengan perintah `(new WebGuard())->user()-><nama_atribut>`. Seperti `(new WebGuard())->user()->name`.

### Auth CodeIgniter 3.x

Berikut daftar perintah auth pada CodeIgniter 3.x

##### `$this->webguard->check()` 

Mengecek apakah ada pengguna yang login atau tidak.

##### `$this->webguard->authenticated()`

Mengembalikan pengguna ke halaman login SSO jika belum login.

##### `$this->webguard->user()->get()`

Mendapatkan data pengguna, `role_active`, `role_permissions` (permissions dari role active), `arr_menu` dan data-data lainnya yang diambil dari `$_SESSION`.

##### `$this->webguard->user()->roles()` 

Mendapatkan data roles yang melekat pada pengguna.

##### `$this->webguard->user()->hasRole($role)`

Mengecek apakah pengguna memiliki role tertentu atau tidak (role bisa lebih dari 1 dengan format array) dan mengembalikan nilai bertipe boolean.

##### `$this->webguard->user()->hasPermission($permission)`
 
Mengecek apakah pengguna memiliki permission tertentu atau tidak (permission bisa lebih dari 1 dengan format array) dan mengembalikan nilai booelan.

## Soal Sering Ditanya

##### Bagaimana cara mendapatkan access token dan refresh token?

Impor class `SSOService` dengan perintah `use RistekUSDI\SSO\PHP\Services\SSOService;`.

Gunakan perintah `(new SSOService())->retrieveToken()` untuk mendapatkan access token dan refresh token.
