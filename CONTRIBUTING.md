# Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada proyek Buku Tamu Digital! Dokumen ini akan memandu Anda melalui proses kontribusi.

## Cara Berkontribusi

### 1. Persiapan Awal

- Fork repository ini ke akun GitHub Anda
- Clone repository hasil fork ke komputer lokal Anda:
  ```bash
  git clone https://github.com/username-anda/Tamuboard.git
  cd Tamuboard
  ```
- Tambahkan remote upstream:
  ```bash
  git remote add upstream https://github.com/AlpianPPLG/Tamuboard.git
  ```

### 2. Mengatur Lingkungan Pengembangan

1. Pastikan Anda memiliki Node.js versi terbaru (disarankan versi LTS)
2. Install dependensi proyek:
   ```bash
   npm install
   ```
3. Buat file `.env` di root direktori proyek dan salin isi dari `.env.example`

### 3. Alur Kerja

1. Update repository lokal Anda dengan perubahan terbaru:
   ```bash
   git fetch upstream
   git checkout master
   git merge upstream/master
   ```

2. Buat branch baru untuk fitur/perbaikan Anda:
   ```bash
   git checkout -b nama-branch-anda
   ```
   Gunakan format penamaan yang deskriptif, contoh:
   - `feat/tambah-fitur-pencarian`
   - `fix/perbaikan-bug-login`
   - `docs/perbarui-dokumentasi`

3. Lakukan perubahan pada kode

4. Lakukan testing:
   - Lint check:
     ```bash
     npm run lint
     ```
   - Jalankan test:
     ```bash
     npm test
     ```
   - Pastikan build berhasil:
     ```bash
     npm run build
     ```

5. Commit perubahan Anda:
   ```bash
   git add .
   git commit -m "tipe(scope): pesan commit yang deskriptif"
   ```
   Contoh:
   ```
   feat(auth): tambah fitur login dengan Google
   fix(ui): perbaiki tampilan mobile pada halaman dashboard
   docs: perbarui dokumentasi kontribusi
   ```

6. Push perubahan ke repository Anda:
   ```bash
   git push origin nama-branch-anda
   ```

7. Buat Pull Request (PR) ke branch `master` repository utama

## Standar Kode

- Gunakan ESLint dan Prettier yang sudah dikonfigurasi
- Ikuti konvensi penamaan komponen React dengan PascalCase
- Gunakan TypeScript untuk semua kode baru
- Tulis komentar yang jelas dan bermakna
- Pastikan kode Anda terstruktur dengan baik dan mudah dibaca

## Panduan Commit Message

Gunakan format Conventional Commits:

```
tipe(scope): deskripsi singkat

Deskripsi lebih detail jika diperlukan

BREAKING CHANGE: deskripsi perubahan yang bersifat breaking change (jika ada)
```

Contoh:
```
feat(auth): tambah validasi email pada form registrasi

- Menambahkan validasi format email
- Menambahkan pesan error yang informatif
- Memperbarui test case
```

## Melaporkan Bug

1. Pastikan bug belum dilaporkan di [Issues](https://github.com/AlpianPPLG/Tamuboard/issues)
2. Buat issue baru dengan template yang disediakan
3. Sertakan langkah-langkah untuk mereproduksi bug
4. Jelaskan perilaku yang diharapkan vs yang terjadi
5. Sertakan versi browser/sistem operasi

## Meminta Fitur Baru

1. Buat issue baru dengan label `enhancement`
2. Jelaskan fitur yang diinginkan secara detail
3. Jelaskan mengapa fitur ini penting
4. Jika memungkinkan, sertakan contoh kasus penggunaan

## Pertanyaan?

Jika Anda memiliki pertanyaan, silakan buat issue baru atau hubungi maintainer proyek.

Terima kasih telah berkontribusi! 🎉
