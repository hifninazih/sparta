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
          id, name, color, icon, is_active, created_at
        FROM categories
        WHERE name ILIKE $1
        ORDER BY id DESC
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
      const checkQuery = `SELECT id FROM categories WHERE name = $1`;
      const checkResult = await client.query(checkQuery, [name]);
      if (checkResult.rows.length > 0) {
        return NextResponse.json({ message: "Kategori dengan nama ini sudah ada" }, { status: 400 });
      }

      const query = `
        INSERT INTO categories (name, color, icon, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, color, icon, is_active, created_at
      `;
      const result = await client.query(query, [name, color || "#000000", icon || "MapPin", is_active ?? true]);
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Add Category Error:", error);
    return NextResponse.json({ message: "Error adding category" }, { status: 500 });
  }
}
