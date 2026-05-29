import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // ... existing code
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
          id, name, category, price, rating, all_facility,
          ST_X(geom) as lng, ST_Y(geom) as lat
        FROM wisata_diy
        WHERE name ILIKE $1 OR category ILIKE $1
        ORDER BY name ASC
        LIMIT 100
      `;
      const result = await client.query(query, [`%${search}%`]);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch Wisata Error:", error);
    return NextResponse.json({ message: "Error fetching wisata data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, category, price, rating, all_facility, lng, lat } = await request.json();
    
    if (!name || !category || lng === undefined || lat === undefined) {
      return NextResponse.json({ message: "Field wajib (nama, kategori, koordinat) tidak boleh kosong" }, { status: 400 });
    }

    const id = generateId();
    
    // Parse comma-separated string into a JSON array
    const facilityArray = typeof all_facility === 'string' 
      ? all_facility.split(",").map(f => f.trim()).filter(Boolean) 
      : (Array.isArray(all_facility) ? all_facility : []);

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO wisata_diy (id, name, category, price, rating, all_facility, geom)
        VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326))
        RETURNING id, name, category, price, rating, all_facility, ST_X(geom) as lng, ST_Y(geom) as lat
      `;
      const result = await client.query(query, [
        id, name, category, price, rating, JSON.stringify(facilityArray), lng, lat
      ]);
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("CREATE WISATA ERROR:", error);
    if (error.code === '22P02') {
      return NextResponse.json({ 
        message: "Database Error: Kolom ID masih bertipe Integer atau syntax JSON salah." 
      }, { status: 500 });
    }
    return NextResponse.json({ message: "Error creating wisata: " + error.message }, { status: 500 });
  }
}
