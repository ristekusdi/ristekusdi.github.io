---
title: Membuat Pustaka
outline: deep
---

# Membuat Pustaka

Berikut ini adalah aturan-aturan rekomendasikan untuk membuat pustaka yang digunakan di aplikasi internal Universitas Udayana. Tujuan dari aturan ini adalah agar semua programmer di USDI seragam dalam membuat pustaka dan tidak membuat aturan sendiri-sendiri. Jika ada aturan di bawah ini yang tidak sesuai maka bisa didiskusikan di internal programmer USDI dan akan diperbaharui lagi bila ada.

## Namespace

```php
// GOOD!
use RistekUSDI\NameofYourPackage\NameofYourClass;

// BAD!
use RistekUsdi\NameofYourPackage\NameofYourClass;
```

## Persiapan

Gunakan [Composer](https://getcomposer.org/doc/03-cli.md#init) sebagai alat untuk mengembangkan pustaka bahasa pemrograman PHP. Contoh, untuk mengembangkan pustaka bernama `kisara-php` maka perintah yang digunakan sebagai berikut.

```bash
composer init --no-interaction \
--name="ristekusdi/kisara-php" \
--description="Keycloak Service Account library using PHP" \
--type="library" \
--author="Riset dan Teknologi USDI <usdi@unud.ac.id>" \
--stability="stable"
```

Perintah di atas menghasilkan file `composer.json` tanpa mode interaksi command line (`--no-interaction`) dengan opsi-opsi berikut:

- `name`: Nama package atau pustaka PHP. Format: <vendor/package-name>. Pada contoh di atas, nama package adalah `ristekusdi/kisara-php`.
- `description`: Deskripsi package.
- `type`: Tipe package atau pustaka PHP. Opsi yang tersedia: `library`, `project`.
- `author`: Nama organisasi atau personal serta email dari organisasi atau personal. Format: `Organization name <your-organization-email@mail.com>`
- `stability`: Gunakan nilai `stable` untuk memastikan bahwa package ini stabil.

::: warning REKOMENDASI
- Untuk `vendor` gunakan nilai `ristekusdi`
- Untuk `author` gunakan nilai `Riset dan Teknologi USDI <usdi@unud.ac.id>`
:::

## .gitignore

Saat mengembangkan pustaka PHP menggunakan composer dan terhubung dengan Git, ada beberapa file atau directory yang harus diabaikan agar tidak terdeteksi oleh Git. Buat file bernama `.gitignore` di root directory project dan isi dari `.gitignore` seperti di bawah ini.

```.git
vendor
.DS_Store
.env
composer.lock
example.php
```

## Instalasi Composer Package di Aplikasi Internal

### Development Mode

Sebagai ilustrasi, kita akan menginstal pustaka `kisara-php` di `web-app`, aplikasi internal milik Universitas Udayana.

```
.
└── Projects/
    ├── web-app
    └── kisara-php
```

Berikutnya, edit file `composer.json` di `web-app`. Kita tambahkan lokasi pustaka `kisara-php` ke key `repositories`.

```json
{
    "repositories": [
        {
            "type": "path",
            "url": "../kisara-php",
            "options": {
                "symlink": true
            }
        }
    ]
}
```

Berikutnya, tambahkan `kisara-php` di key `require`.

```json
{
    "require": {
        "ristekusdi/kisara-php": "@dev"
    }
}
```

Nilai `@dev` merupakan sebuah penanda untuk mengunduh pustaka `kisara-php` di directory `kisara-php` yang telah didefinisikan di key `repositories`.

::: warning PERINGATAN!
Pastikan nama package yang diisi pada key `require` sama dengan nama package yang kita definisikan di package `kisara-php`.
:::

Terakhir jalankan perintah `composer update` untuk mengunduh package `ristekusdi/kisara-php`.

**Referensi**

[Installing a local Composer package in your PHP project](https://aschmelyun.com/blog/installing-a-local-composer-package-in-your-php-project/).

### Production Mode

Ketika fitur-fitur yang diperlukan oleh sebuah pustaka sudah cukup maka pustaka siap digunakan di mode production. Ada dua cara untuk menginstal pustaka `ristekusdi/kisara-php` di mode production.

#### VCS

Kita bisa memanfaatkan GitHub atau GitLab, platform hosting Version Control System (VCS) atau Git untuk menampung hasil pekerjaan pustaka yang kita buat. Berikut gambaran singkat cara menginstal pustaka `ristekusdi/kisara-php` dari VCS.

Berikutnya, edit file `composer.json` di `web-app`. Kita ubah lokasi pustaka `kisara-php` ke key `repositories`.

```json
{
    "repositories": [
        {
            "type": "path", // [!code --]
            "type": "vcs", // [!code ++]
            "url": "../kisara-php", // [!code --]
            "url": "https://github.com/ristekusdi/kisara-php.git" // [!code ++]
            "options": {   // [!code --]
                "symlink": true // [!code --]
            } // [!code --]
        }
    ]
}
```

Berikutnya, ubah nilai dari `ristekusdi/kisara-php` di key `require` dari `@dev` menjadi `dev-main`. Nilai `dev-main` artinya Composer akan mengunduh package `ristekusdi/kisara-php` di branch `main`.

```json
{
    "require": {
        "ristekusdi/kisara-php": "@dev" // [!code --]
        "ristekusdi/kisara-php": "dev-main" // [!code ++]
    }
}
```

Selanjutnya, jalankan perintah `composer update`.

**Referensi**

[Loading a package from a VCS repository](https://getcomposer.org/doc/05-repositories.md#vcs)

#### Packagist

Packagist merupakan repository central untuk menampung pustaka PHP yang dibuat menggunakan Composer. Cara instalasi pustaka `ristekusdi/kisara-php` dari Packagist lebih mudah dibandingkan cara instalasi dari VCS. Syaratnya adalah package `ristekusdi/kisara-php` sudah diunggah di Packagist. Silakan [simak di bagian **Publishing Packages** di situs Packagist](https://packagist.org/). Setelah berhasil diunggah, jalankan perintah `composer require ristekusdi/kisara-php`.