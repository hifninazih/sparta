import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { kategori_id, name, is_active } = await request.json();
    
    if (!kategori_id || !name) {
      return NextResponse.json({ message: "Kategori ID dan nama sub kategori tidak boleh kosong" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Check if sub category name already exists in this category
      const checkQuery = `SELECT id FROM sub_kategori WHERE kategori_id = $1 AND nama = $2`;
      const checkResult = await client.query(checkQuery, [kategori_id, name]);
      if (checkResult.rows.length > 0) {
        return NextResponse.json({ message: "Sub kategori dengan nama ini sudah ada di kategori tersebut" }, { status: 400 });
      }

      const query = `
        INSERT INTO sub_kategori (kategori_id, nama, is_active)
        VALUES ($1, $2, $3)
        RETURNING id, nama as name, is_active
      `;
      const result = await client.query(query, [kategori_id, name, is_active ?? true]);
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Add Sub Category Error:", error);
    return NextResponse.json({ message: "Error adding sub category" }, { status: 500 });
  }
}
