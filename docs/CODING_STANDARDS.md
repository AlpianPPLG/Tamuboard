# Coding Standards

Berikut adalah standar penulisan kode yang digunakan pada projek ini:

## 1. Nama Variabel

* Nama variabel harus menggunakan camelCase dan diawali dengan huruf kecil.
* Jika nama variabel terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf kecil dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama variabel mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
const firstName = "John";
const lastName = "Doe";
const email = "john.doe@example.com";
```

## 2. Nama Fungsi

* Nama fungsi harus menggunakan camelCase dan diawali dengan huruf besar.
* Jika nama fungsi terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama fungsi mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
function getUserById(id: string): User {
  return users.find(user => user.id === id);
}
```

## 3. Nama Klass

* Nama kelas harus menggunakan PascalCase dan diawali dengan huruf besar.
* Jika nama kelas terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama kelas mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
class User {
  id: string;
  name: string;
  email: string;
}
```

## 4. Nama Enum

* Nama enum harus menggunakan PascalCase dan diawali dengan huruf besar.
* Jika nama enum terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama enum mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
```

## 5. Nama Interface

* Nama interface harus menggunakan PascalCase dan diawali dengan huruf besar.
* Jika nama interface terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama interface mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
``` 

## 6. Nama Konstanta

* Nama konstanta harus menggunakan PascalCase dan diawali dengan huruf besar.
* Jika nama konstanta terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama konstanta mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
const MAX_USERS = 100;
```

## 7. Nama Type

* Nama type harus menggunakan PascalCase dan diawali dengan huruf besar.
* Jika nama type terdiri dari beberapa kata, maka kata pertama harus diawali dengan huruf besar dan kata-kata berikutnya harus diawali dengan huruf besar.
* Jika nama type mengandung akronim, maka akronim tersebut harus ditulis dalam huruf besar.

Contoh:

```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```