# SSO PHP

Petunjuk penggunaan pustaka SSO PHP Universitas Udayana.

## Prasyarat

- PHP versi minimal 7.2.5

> Pengujian tutorial dilakukan pada CodeIgniter versi 3.x. Bila Anda mengalami kendala silakan buat [isu di ristekusdi/sso-php](https://github.com/ristekusdi/sso-php/issues).

## Instalasi

Gunakan perintah di bawah ini untuk menginstal package ristekusdi/sso-php

```bash
composer require ristekusdi/sso-php
```

Setelah diinstal, silakan ambil nilai environment SSO di website IMISSU2 dev atau IMISSU2 dan taruh di file `.env`.

**Catatan:**

1. Nilai dari `KEYCLOAK_CALLBACK` disesuaikan.
2. Nilai dari `KEYCLOAK_REDIRECT_URL` adalah path dari halaman utama aplikasi Anda terlepas diproteksi oleh SSO atau tidak.

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

- `Webauth.php` di folder `application/controllers`.
- `Webguard.php` di folder `application/libraries`.

2. Hubungkan controller `Webauth.php` ke dalam routing di file `application/config/routes.php`.

```php
/** Otentikasi */
$route['sso/login'] = 'webauth/login';
$route['sso/logout'] = 'webauth/logout';
$route['sso/callback'] = 'webauth/callback';
/** Mengganti session */
$route['web-session/change_role_active'] = 'webauth/change_role_active';
$route['web-session/change_kv_active'] = 'webauth/change_kv_active';
```

3. Tambahkan `webguard` sebagai autoload library di direktori `application/config/autoload.php`

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

5. Masukkan sintaks berikut untuk mengambil nilai dari file `.env` dengan perintah `$_ENV['nama_key']` atau `$_SERVER['nama_key']` di file `application/config/hooks.php`.

```php
$hook['pre_system'] = function () {
    $dotenv = Dotenv\Dotenv::createImmutable(FCPATH);
    $dotenv->load();
};
```

6. Agar halaman tertentu di dalam suatu proyek dilindungi oleh autentikasi, tambahkan perintah `$this->webguard->authenticated()` ke dalam `constructor` di suatu controller. Sehingga jika pengguna mengakses halaman tertentu belum terautentikasi maka di arahkan ke halaman login SSO.

## Daftar Perintah Auth

Daftar perintah auth terbagi menjadi dua bagian yakni [PHP](#auth-php) dan [CodeIgniter 3.x](#auth-codeigniter-3-x).

### Auth PHP

Pustaka ini mengimplementasikan `Illuminate\Contracts\Auth\Guard` dari Laravel sehingga seolah-olah Anda seperti menggunakan Laravel.

Caranya adalah dengan mengimpor class `WebGuard` dengan perintah `use RistekUSDI\SSO\PHP\Auth\Guard\WebGuard;` maka Anda akan memiliki beberapa fungsi berikut.

Berikut perintah-perintah yang digunakan untuk mengakses data pengguna SSO.

```php
# Methods

// Mengecek apakah pengguna sudah terotentikasi atau login.
(new WebGuard())->check();

// Mengecek apakah pengguna adalah "tamu" (belum login atau terotentikasi).
(new WebGuard())->guest();

// Objek pengguna
(new WebGuard())->user();

# Attributes

// sub adalah id user di Keycloak.
// TIDAK DIREKOMENDASIKAN menggunakan atribut ini utk menyimpan nilai.
(new WebGuard())->user()->sub;

// NIP/NIM - Nama Pengguna
(new WebGuard())->user()->full_identity;
(new WebGuard())->user()->name;

// Username
(new WebGuard())->user()->preferred_username;
(new WebGuard())->user()->username;

// NIP atau NIM
(new WebGuard())->user()->identifier;

// Email
(new WebGuard())->user()->email;

// Daftar peran pengguna dalam suatu aplikasi.
(new WebGuard())->user()->client_roles;

// id user di Unud.
(new WebGuard())->user()->unud_identifier_id;

// id tipe pengguna di Unud.
(new WebGuard())->user()->unud_user_type_id;

// id sso Unud.
// DIREKOMENDASIKAN untuk menggunakan atribut ini untuk menyimpan nilai.
(new WebGuard())->user()->unud_sso_id;
```

### Auth CodeIgniter 3.x

Berikut daftar perintah auth pada CodeIgniter 3.x

```php

# Methods

// Mengecek apakah ada pengguna telah login via SSO atau tidak.
$this->webguard->check();

// Mengembalikan pengguna ke halaman login SSO jika belum login.
$this->webguard->authenticated();

// Objek pengguna
$this->webguard->user()->get();
# Attributes

// sub adalah id user di Keycloak.
// TIDAK DIREKOMENDASIKAN menggunakan atribut ini utk menyimpan nilai.
$this->webguard->user()->get()->sub;

// NIP/NIM - Nama Pengguna
$this->webguard->user()->get()->full_identity;
$this->webguard->user()->get()->name;

// Username
$this->webguard->user()->get()->preferred_username;
$this->webguard->user()->get()->username;

// NIP atau NIM
$this->webguard->user()->get()->identifier;

// Email
$this->webguard->user()->get()->email;

// Daftar peran pengguna dalam suatu aplikasi.
$this->webguard->user()->get()->client_roles;

// id user di Unud.
$this->webguard->user()->get()->unud_identifier_id;

// id tipe pengguna di Unud.
$this->webguard->user()->get()->unud_user_type_id;

// id sso Unud.
// DIREKOMENDASIKAN untuk menggunakan atribut ini untuk menyimpan nilai.
$this->webguard->user()->get()->unud_sso_id;

// Mengecek apakah pengguna memiliki role tertentu atau tidak (role bisa lebih dari 1 dengan format array) dan mengembalikan nilai bertipe boolean.
$this->webguard->user()->hasRole($role);

// Mengecek apakah pengguna memiliki permission tertentu atau tidak (permission bisa lebih dari 1 dengan format array) dan mengembalikan nilai booelan.
$this->webguard->user()->hasPermission($permission);
```

## Soal Sering Ditanya

##### Bagaimana cara mendapatkan access token dan refresh token?

Impor class `SSOService` dengan perintah `use RistekUSDI\SSO\PHP\Services\SSOService;`.

Gunakan perintah `(new SSOService())->retrieveToken()` untuk mendapatkan access token dan refresh token.
