import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const searchParams = request.nextUrl.searchParams;

    // 1. Tangkap parameter standar (Keyword & Kategori)
    const search = searchParams.get("s");
    const kategori = searchParams.get("c");

    // 2. Tangkap parameter Bounding Box (BBOX) dari batas layar peta
    const minLng = searchParams.get("minLng");
    const minLat = searchParams.get("minLat");
    const maxLng = searchParams.get("maxLng");
    const maxLat = searchParams.get("maxLat");

    let whereClause = `WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    // --- FILTER PENCARIAN & KATEGORI ---
    if (search) {
      whereClause += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (kategori && kategori !== "Semua") {
      whereClause += ` AND category = $${paramIndex}`;
      values.push(kategori);
      paramIndex++;
    }

    // --- FILTER SPASIAL (BOUNDING BOX) ---
    // Pastikan keempat titik sudut tersedia sebelum menjalankan query spasial
    if (minLng && minLat && maxLng && maxLat) {
      whereClause += ` 
        AND ST_Contains(
          ST_MakeEnvelope($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, 4326), 
          geom
        )
      `;
      values.push(
        parseFloat(minLng),
        parseFloat(minLat),
        parseFloat(maxLng),
        parseFloat(maxLat),
      );
      paramIndex += 4;
    }

    // 3. Susun Query Utama
    const dataQuery = `
      SELECT 
        id, 
        name, 
        category, 
        price, 
        rating, 
        reviews,
        all_facility,
        ST_X(geom) as lng, 
        ST_Y(geom) as lat 
      FROM wisata_diy 
      ${whereClause}
      ORDER BY rating DESC 
      LIMIT 20 -- Batasi agar browser tidak hang jika menyeleksi area yang terlalu luas
    `;

    const countQuery = `SELECT COUNT(*) FROM wisata_diy ${whereClause}`;

    const client = await pool.connect();
    try {
      const [dataResult, countResult] = await Promise.all([
        client.query(dataQuery, values),
        client.query(countQuery, values),
      ]);

      return NextResponse.json(dataResult.rows, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Total-Count": countResult.rows[0].count,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
