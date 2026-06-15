# Sparta 🏛️🌍

**Sparta** adalah Sistem Informasi Geografis (WebGIS) modern berbasis web untuk mengelola dan memvisualisasikan data persebaran wisata dan statistik wilayah administrasi. Aplikasi ini dibangun dengan standar teknologi mutakhir dan mengusung antarmuka yang tegas, interaktif, serta elegan bergaya **Neo-Brutalism**.

---

## 🚀 Fitur Utama

- **Dashboard Interaktif**: Menampilkan statistik data spasial menggunakan grafik *Pie Chart* interaktif (berbasis SVG murni) dan peringkat wilayah secara dinamis (Top Wisata & Top Kecamatan).
- **Manajemen Pengguna Tingkat Lanjut**: Dilengkapi dengan *Role-Based Access Control* (Super Admin & Admin). Mendukung validasi formulir asinkron secara *real-time* (pengecekan username instan), fitur visibilitas *password* yang sinkron, serta keamanan sesi cerdas untuk mencegah penghapusan akun mandiri secara tak sengaja.
- **Kecerdasan Spasial (GIS)**: Terintegrasi langsung dengan PostGIS untuk melakukan kueri spasial tingkat lanjut (seperti `ST_Intersects`), mencocokkan titik-titik kordinat wisata dengan poligon batas administrasi kabupaten/kecamatan secara presisi.
- **Autentikasi & Keamanan Solid**: Menggunakan *stateless session* berbasis **JWT** (`jose`) di dalam *HTTP-only cookies*, enkripsi *password* menggunakan `bcryptjs`, dan perlindungan *route* di sisi server menggunakan Next.js Middleware.
- **Desain UI/UX Premium**: Dibangun di atas Tailwind CSS dengan sistem desain kustom yang menonjolkan batas garis tegas, palet warna vibran, bayangan pekat (*hard drop-shadows*), serta *micro-animations* yang responsif.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Bahasa Utama**: TypeScript, React
- **Styling**: Tailwind CSS & Vanilla CSS
- **Database**: PostgreSQL dengan ekstensi **PostGIS** (`pg`)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Ikonografi**: [Lucide React](https://lucide.dev/)

## ⚙️ Persiapan & Instalasi Lokal

1. **Clone Repositori**
   ```bash
   git clone https://github.com/hifninazih/sparta.git
   cd sparta
   ```

2. **Instalasi Dependensi**
   Pastikan Anda telah menginstal Node.js versi terbaru.
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file bernama `.env` di *root* direktori proyek, lalu isi dengan konfigurasi database PostgreSQL lokal Anda:
   ```env
   DB_USER=postgres
   DB_PASSWORD=password_db_anda
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nama_database_sparta
   JWT_SECRET=rahasia_jwt_acak_dan_panjang
   ```

4. **Jalankan Server**
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**
   Aplikasi siap diakses melalui [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Catatan Struktur Database

Agar semua fitur perhitungan spasial dan statistik wilayah berfungsi dengan baik, pastikan:
- Ekstensi PostGIS telah diaktifkan di database Anda: `CREATE EXTENSION postgis;`.
- Terdapat tabel spasial (seperti `wisata` untuk titik lokasi dan `administrasi_desa` untuk poligon wilayah) yang memiliki kolom `geom` dengan sistem koordinat yang valid.

---

*Dibangun dengan ❤️ untuk pemetaan cerdas berbasis web.*
