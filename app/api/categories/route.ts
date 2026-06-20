import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          k.id, k.nama as name, k.warna as color, k.ikon as icon, k.is_active, k.created_at,
          COALESCE(
            json_agg(
              json_build_object('id', sk.id, 'name', sk.nama, 'is_active', sk.is_active)
            ) FILTER (WHERE sk.id IS NOT NULL), '[]'
          ) as sub_categories
        FROM kategori k
        LEFT JOIN sub_kategori sk ON k.id = sk.kategori_id AND sk.is_active = true
        WHERE k.is_active = true
        GROUP BY k.id
        ORDER BY k.nama ASC
      `);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ success: false, message: "Error fetching categories" }, { status: 500 });
  }
}
