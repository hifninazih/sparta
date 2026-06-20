import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          k.id, k.nama as name, k.warna as color, k.ikon as icon, k.is_active, k.created_at,
          COALESCE(
            json_agg(
              json_build_object('id', sk.id, 'name', sk.nama, 'is_active', sk.is_active)
            ) FILTER (WHERE sk.id IS NOT NULL), '[]'
          ) as sub_categories
        FROM kategori k
        LEFT JOIN sub_kategori sk ON k.id = sk.kategori_id
        WHERE k.nama ILIKE $1
        GROUP BY k.id
        ORDER BY k.id DESC
      `;
      const result = await client.query(query, [`%${search}%`]);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, color, icon, is_active } = await request.json();
    
    if (!name) {
      return NextResponse.json({ message: "Nama kategori tidak boleh kosong" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Periksa apakah nama kategori sudah ada
      const checkQuery = `SELECT id FROM kategori WHERE nama = $1`;
      const checkResult = await client.query(checkQuery, [name]);
      if (checkResult.rows.length > 0) {
        return NextResponse.json({ message: "Kategori dengan nama ini sudah ada" }, { status: 400 });
      }

      const query = `
        INSERT INTO kategori (nama, warna, ikon, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nama as name, warna as color, ikon as icon, is_active, created_at
      `;
      const result = await client.query(query, [name, color || "#000000", icon || "MapPin", is_active ?? true]);
      const newCat = result.rows[0];
      newCat.sub_categories = []; // Initialize empty array for newly created category
      return NextResponse.json(newCat);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Add Category Error:", error);
    return NextResponse.json({ message: "Error adding category" }, { status: 500 });
  }
}
