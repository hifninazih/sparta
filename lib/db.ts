import { Pool } from "pg";

// Mendeklarasikan tipe global agar TypeScript tidak protes
const globalForPg = global as unknown as { pgPool: Pool };

// Membuat instance Pool baru atau menggunakan yang sudah ada di global
export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Opsional: Batasi jumlah maksimal koneksi agar server tidak berat
    max: 10,
    idleTimeoutMillis: 30000,
  });

// Jika kita berada di mode development, simpan instance pool ke objek global.
// Ini mencegah Next.js membuat koneksi berulang kali saat file disimpan ulang.
if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export default pool;
