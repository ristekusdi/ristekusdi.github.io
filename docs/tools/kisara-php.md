---
title: Kisara
outline: deep
---

# Kisara

Kisara, sebuah pustaka untuk berinteraksi Keycloak Service Account melalui [Keycloak REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html).

## Pengaturan Awal

```bash
composer require ristekusdi/kisara-php
```

In each class, you need to set a config (array value) to get data you need. Here's the available options:

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
KisaraClient::userSessions($client_id);

$params = [
    'first' => '0',
    'max' => '10',
];

// Menggunakan parameter
$user_sessions = KisaraClient::userSessions($client_id, $params);
```

### ClientSecret

#### get

Mendapatkan client secret dari sebuah client menggunakan `id` dari client BUKAN `clientId`.

```php
use RistekUSDI\Kisara\Kisara;
use RistekUSDI\Kisara\Client as KisaraClient;

Kisara::connect($config);

$client_secret = KisaraClient::getClientSecret($client_id);
```

#### update

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

Get groups with or without parameters.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

// With parameters.
$params = [
    'first' => '0',
    'max' => '10',
    'search' => 'name of group',
];

(new KisaraGroup($config))->get($params);

// Without parameters.
(new KisaraGroup($config))->get();
```

#### findById

Get a single group by id of group.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

(new KisaraGroup($config))->findById($group_id);
```

#### store

Store a group.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

(new KisaraGroup($config))->store(array(
    'name' => 'name of group'
));
```

#### delete

Delete a group by id of group.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

(new KisaraGroup($config))->delete($group_id);
```

#### members

Get members of group by id of group. Parameters are optional.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

// With parameters.
$params = [
    'first' => '0',
    'max' => '10',
];
(new KisaraGroup($config))->members($group_id, $params);

// Without parameters.
(new KisaraGroup($config))->members($group_id);
```

#### getRoleMappings

Get group role mappings by group id.

```php
use RistekUSDI\Kisara\Group as KisaraGroup;

// Without parameters.
(new KisaraGroup($config))->getRoleMappings($group_id);
```

#### addMember

TBA

#### removeMember

### Role

#### findById

Find a role by id of role.

```php
use RistekUSDI\Kisara\Role as KisaraRole;

(new KisaraRole($config))->findById($role_id);
```

#### update

Update a role by id of role.

```php
use RistekUSDI\Kisara\Role as KisaraRole;

$data = [
    'name' => 'role name'
]

(new KisaraRole($config))->update($role_id, $data);
```

#### delete

Delete a role by id of role.

```php
use RistekUSDI\Kisara\Role as KisaraRole;

(new KisaraRole($config))->delete($role_id);
```

### Session

#### delete

Delete session logged in user by session id.

```php
use RistekUSDI\Kisara\Session as KisaraSession;

(new KisaraSession($config))->delete($session_id);
```

### User

#### get

Get users with or without parameters.

```php
use RistekUSDI\Kisara\User as KisaraUser;

// With parameters
$params = [
    // Option 1
    'username' => 'username',
    'exact' => true,

    // Option 2
    'email' => 'mail of user',
    'username' => 'username',
];

(new KisaraUser($config))->get($params);

// Without parameters
(new KisaraUser($config))->get();
```

#### findById

Find user by id of user.

```php
use RistekUSDI\Kisara\User as KisaraUser;

(new KisaraUser($config))->findById($user_id);
```

#### store

Store a user.

```php
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

(new KisaraUser($config))->store($data);
```

#### update

Update a user.

```php
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

(new KisaraUser($config))->update($user_id, $data);
```

#### groups

Get groups belong to user with id of user.

```php
use RistekUSDI\Kisara\User as KisaraUser;

(new KisaraUser($config))->groups($user_id);
```

#### resetCredentials

Reset user credentials.

```php
use RistekUSDI\Kisara\User as KisaraUser;

$data = array(
    'type' => 'password',
    'value' => 'value of password',
    'temporary' => true,
);

(new KisaraUser($config))->resetCredentials($user_id, $data);
```