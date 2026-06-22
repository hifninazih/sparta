// src/lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
  // Neon membutuhkan SSL — wajib ada agar API routes Next.js bisa konek
  ssl: {
    rejectUnauthorized: false,
  },
});
