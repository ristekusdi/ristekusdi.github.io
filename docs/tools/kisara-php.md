---
title: Kisara
outline: deep
---

# Kisara

Kisara, sebuah pustaka untuk berinteraksi Keycloak Service Account melalui [Keycloak REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html).

## Pengaturan Awal

Instal pustaka ini dengan perintah di bawah ini.

```bash
composer require ristekusdi/kisara-php
```

Berikutnya, buatlah sebuah array bernama `$config`. Array ini menampung data-data yang diperlukan untuk terhubung ke server Keycloak.

```php
$config = [
    'admin_url' => 'KEYCLOAK_ADMIN_URL',
    'base_url' => 'KEYCLOAK_BASE_URL',
    'realm' => 'KEYCLOAK_REALM',
    'client_id' => 'KISARA_CLIENT_ID',
    'client_secret' => 'KISARA_CLIENT_SECRET',
];
```

::: info
Admin URL dan base URL bisa sama atau berbeda di mode production.
:::

## Ouput

Bila setiap perintah di bawah ini disimpan dalam bentuk variable bernama `$response` artinya perintah tersebut mengembalikan dua hasil dalam bentuk satu array antara lain `code` dan `body`. Jika tidak maka perintah tersebut akan mengembalikan hasil data yang diminta oleh programmer.

```php
// Contoh
$response = [
    'code' => 200,
    'body' => 'Response of request'
];
```

## Daftar Perintah

### Connect

Melakukan autentikasi ke server Keycloak untuk memperoleh token dan disimpan di dalam class `Container`. Token ini digunakan untuk mengakses layanan-layanan yang ada di Keycloak seperti User, Clients, dan Groups. 

```php
use RistekUSDI\Kisara\Kisara;

Kisara::connect($config);
```

### Disconnect

Mencabut token dari server Keycloak.

```php
use RistekUSDI\Kisara\Kisara;

Kisara::disconnect();
```

### Client

#### get

Mendapatkan semua client dengan atau tanpa parameter.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

// Menggunakan parameter
Kisara::connect($config);
$clients = KisaraClient::get([
    'clientId' => 'CLIENT_ID_NAME',
    'search' => 'true'
]);

// Tanpa parameter
Kisara::connect($config);
$clients = KisaraClient::get();
```

#### findById

Mendapatkan client berdasarkan id dari client BUKAN dari `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

// Menggunakan parameter
Kisara::connect($config);
$client = KisaraClient::findById($client_id);
```

#### store

Menyimpan sebuah client.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

$data = [
    'enabled' => 'true',
    'protocol' => 'openid-connect',
    'clientId' => $clientId,
    'rootUrl' => $rootUrl,
    // Determine if client type is public or confidential
    // true = public, false = confidential
    'publicClient' => $publicClient,
];

Kisara::connect($config);
$response = KisaraClient::store($data);
```

#### update

Memperbaharui client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

$data = [
    'enabled' => 'true',
    'protocol' => 'openid-connect',
    'clientId' => $clientId,
    'rootUrl' => $rootUrl,
    // Determine if client type is public or confidential
    // true = public, false = confidential
    'publicClient' => $publicClient,
];

Kisara::connect($config);
$response = KisaraClient::update($client_id, $data);
```

#### delete

Menghapus client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

Kisara::connect($config);
$response = KisaraClient::delete($client_id);
```

#### userSessions

Mendapatkan user session dari suatu client.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

Kisara::connect($config);

// Tanpa parameter
$user_sessions = KisaraClient::userSessions($client_id);

$params = [
    'first' => '0',
    'max' => '10',
];

// Menggunakan parameter
$user_sessions = KisaraClient::userSessions($client_id, $params);
```

#### getClientSecret

Mendapatkan client secret dari sebuah client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

Kisara::connect($config);

$client_secret = KisaraClient::getClientSecret($client_id);
```

#### updateClientSecret

Memperbaharui nilai dari client secret menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

Kisara::connect($config);

$client_secret = KisaraClient::updateClientSecret($client_id);
```

### ClientRole

#### get

Mendapatkan daftar peran dari suatu client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\ClientRole as KisaraClientRole;

$params = [
    'first' => '0',
    'max' => '10',
    'search' => 'role name of client',
];

Kisara::connect($config);

// Menggunakan parameter
$client_roles = KisaraClientRole::get($client_id, $params);

// Tanpa parameter
$client_roles = KisaraClientRole::get($client_id);
```

#### store

Menyimpan peran ke suatu client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\ClientRole as KisaraClientRole;

$data = [
    'name' => 'role name of client',
];

Kisara::connect($config);

$response = KisaraClientRole::store($client_id, $data);
```

#### getUsers

Mendapatkan daftar pengguna yang terhubung dengan peran yang ada di client.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\ClientRole as KisaraClientRole;

$params = [
    'first' => '0',
    'max' => '10'
];

Kisara::connect($config);

// $client_id adalah id dari client BUKAN clientId
// $role_name adalah nama dari role.
$users = KisaraClientRole::getUsers($client_id, $role_name, $params);
```

#### getGroups

Mendapatkan daftar kelompok yang terhubung dengan peran yang ada di client.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\ClientRole as KisaraClientRole;

$params = [
    'first' => '0',
    'max' => '10'
];

Kisara::connect($config);

// $client_id adalah id dari client BUKAN clientId
// $role_name adalah nama dari role.
$groups = KisaraClientRole::getGroups($client_id, $role_name, $params);
```

### DeviceActivity

#### get

Mendapatkan daftar perangkat yang digunakan pengguna untuk login ke server Keycloak.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\DeviceActivity as KisaraDeviceActivity;

$config = [
    'base_url' => 'BASE_KEYCLOAK_URL',
    'realm' => 'KEYCLOAK_REALM',
    'access_token' => 'ACCESS_TOKEN_FROM_USER',
];

Kisara::connect($config);

$device_activities = KisaraDeviceActivity::get();
```

#### endAllSession

Mengakhiri semua sesi login dari sebuah perangkat.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\DeviceActivity as KisaraDeviceActivity;

$config = [
    'base_url' => 'BASE_KEYCLOAK_URL',
    'realm' => 'KEYCLOAK_REALM',
    'access_token' => 'ACCESS_TOKEN_FROM_USER',
];

Kisara::connect($config);

$response = KisaraDeviceActivity::endAllSession();
```

#### endSession

Mengakhiri sesi login dari sebuah perangkat menggunakan session id.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\DeviceActivity as KisaraDeviceActivity;

$config = [
    'base_url' => 'BASE_KEYCLOAK_URL',
    'realm' => 'KEYCLOAK_REALM',
    'access_token' => 'ACCESS_TOKEN_FROM_USER',
];

Kisara::connect($config);

$response = KisaraDeviceActivity::endSession($session_id);
```

### Group

#### get

Mendapatkan daftar kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

// With parameters.
$params = [
    'first' => '0',
    'max' => '10',
    'search' => 'name of group',
];

Kisara::connect($config);

// Menggunakan parameter
$groups = KisaraGroup::get($params);

// Tanpa parameter
$groups = KisaraGroup::get();
```

#### findById

Mendapatkan data suatu kelompok dari id kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$group = KisaraGroup::findById($group_id);
```

#### store

Menyimpan sebuah kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);
$response = KisaraGroup::store(array(
    'name' => 'name of group'
));
```

#### delete

Menghapus sebuah kelompok menggunakan id dari kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);
$response = KisaraGroup::delete($group_id);
```

#### members

Mendapatkan daftar anggota yang ada di dalam suatu kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

// Menggunakan parameter
$params = [
    'first' => '0',
    'max' => '10',
];
$members = KisaraGroup::members($group_id, $params);

// Tanpa parameter
$members = KisaraGroup::members($group_id);
```

#### getRoleMappings

Mendapatkan daftar peran yang melekat di suatu kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$roles = KisaraGroup::getRoleMappings($group_id);
```

#### getAvailableRoles

Mendapatkan daftar peran dari suatu client yang belum terhubung ke kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$available_roles = KisaraGroup::getAvailableRoles($group_id, $client_id);
```

#### assignRole

Menghubungkan peran dari suatu client yang belum terhubung ke kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$available_roles = KisaraGroup::getAvailableRoles($group_id, $client_id);

$roles = $available_roles;
$response = KisaraGroup::assignRole($group_id, $client_id, $roles);
```

#### getAssignedRoles

Mendapatkan daftar peran dari suatu client yang sudah terhubung ke kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$assigned_roles = KisaraGroup::getAssignedRoles($group_id, $client_id);
```

#### addMember

Menambahkan pengguna sebagai anggota dari suatu kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$response = KisaraGroup::addMember($group_id, $user_id);
```

#### removeMember

Menghapus pengguna sebagai anggota dari suatu kelompok.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Group as KisaraGroup;

Kisara::connect($config);

$response = KisaraGroup::removeMember($group_id, $user_id);
```

### Role

#### findById

Mendapatkan data peran menggunakan id dari peran.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Role as KisaraRole;

Kisara::connect($config);
$role = KisaraRole::findById($role_id);
```

#### update

Memperbaharui data peran menggunakan id dari peran.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Role as KisaraRole;

$data = [
    'name' => 'role name'
]

Kisara::connect($config);
$response = KisaraRole::update($role_id, $data);
```

#### delete

Menghapus data peran menggunakan id dari peran.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Role as KisaraRole;

Kisara::connect($config);
$response = KisaraRole::delete($role_id);
```

### Session

#### delete

Menghapus sesi pengguna yang telah login menggunakan session id.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Session as KisaraSession;

Kisara::connect($config);
$response = KisaraSession::delete($session_id);
```

### User

#### get

Mendapatkan data daftar pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);

// Menggunakan parameter
// Opsi 1
$params1 = [
    'username' => 'username',
    'exact' => true,
    // Opsi 2
    'email' => 'mail of user',
    'username' => 'username',
];
$users = KisaraUser::get($params1);

// Opsi 2
$params2 = [
    'email' => 'mail of user',
    'username' => 'username',
];
$users = KisaraUser::get($params2);

// Tanpa parameters
$users = (new KisaraUser($config))->get();
```

#### findById

Mendapatkan data pengguna menggunakan id dari pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);
$user = KisaraUser::findById($user_id);
```

#### store

Menyimpan data pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

$data = [
    'firstName' => 'first name of user',
    'lastName' => 'last name of user',
    'email' => 'email of user',
    'username' => 'username',
    'enabled' => true,
    'credentials' => [
        [
            'temporary' => true,
            'type' => 'password',
            'value' => 'value of password.'
        ]
    ],
];

Kisara::connect($config);
$response = KisaraUser::store($data);
```

#### update

Memperbaharui data pengguna menggunakan id dari pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

$data = [
    'firstName' => 'first name of user',
    'lastName' => 'last name of user',
    'email' => 'email of user',
    'username' => 'username',
    'enabled' => true,
    'credentials' => [
        [
            'temporary' => true,
            'type' => 'password',
            'value' => 'value of password.'
        ]
    ],
];

Kisara::connect($config);
$response = KisaraUser::update($user_id, $data);
```

#### groups

Mendapatkan data daftar kelompok yang terhubung dengan pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);
$groups = KisaraUser::groups($user_id);
```

#### resetCredentials

Melakukan pengaturan ulang kredensial pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

$data = array(
    'type' => 'password',
    'value' => 'value of password',
    'temporary' => true,
);

Kisara::connect($config);
$response = KisaraUser::resetCredentials($user_id, $data);
```

#### getRoleMappings

Mendapatkan daftar peran yang melekat di suatu pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);

$roles = KisaraUser::getRoleMappings($group_id);
```

#### getAvailableRoles

Mendapatkan daftar peran dari suatu client yang belum terhubung ke pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);

$available_roles = KisaraUser::getAvailableRoles($user_id, $client_id);
```

#### assignRole

Menghubungkan peran dari suatu client yang belum terhubung ke pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);

$available_roles = KisaraUser::getAvailableRoles($user_id, $client_id);

$roles = $available_roles;
$response = KisaraUser::assignRole($user_id, $client_id, $roles);
```

#### getAssignedRoles

Mendapatkan daftar peran dari suatu client yang sudah terhubung ke pengguna.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\User as KisaraUser;

Kisara::connect($config);

$assigned_roles = KisaraUser::getAssignedRoles($user_id, $client_id);
```