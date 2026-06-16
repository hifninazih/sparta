import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 1. Tangkap parameter standar (Keyword)
    const search = searchParams.get("s");

    // 2. Tangkap parameter kategori — bisa multi-value: ?c=Alam&c=Budaya
    const kategoriList = searchParams.getAll("c");

    // 3. Tangkap parameter Bounding Box
    const minLng = searchParams.get("minLng");
    const minLat = searchParams.get("minLat");
    const maxLng = searchParams.get("maxLng");
    const maxLat = searchParams.get("maxLat");

    let whereClause = `WHERE 1=1`;
    const values: (string | number | string[])[] = [];
    let paramIndex = 1;

    // --- FILTER KEYWORD ---
    if (search) {
      whereClause += ` AND w.name ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // --- FILTER KATEGORI (multi-value dengan ANY) ---
    if (kategoriList.length > 0) {
      whereClause += ` AND c.name = ANY($${paramIndex})`;
      values.push(kategoriList);
      paramIndex++;
    }

    // --- FILTER SPASIAL (BOUNDING BOX) ---
    if (minLng && minLat && maxLng && maxLat) {
      whereClause += ` 
        AND ST_Contains(
          ST_MakeEnvelope($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, 4326), 
          w.geom
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

    // 4. Query Utama
    const dataQuery = `
      SELECT 
        w.gid::text, 
        w.name, 
        c.name as category, 
        w.price, 
        w.rating, 
        w.reviews,
        w.address,
        w.phone,
        w.link,
        w.maps_link,
        ST_X(w.geom) as lng, 
        ST_Y(w.geom) as lat,
        (SELECT namobj FROM public.administrasi_desa d WHERE ST_Intersects(d.geom, w.geom) LIMIT 1) as desa,
        (SELECT wadmkc FROM public.administrasi_desa d WHERE ST_Intersects(d.geom, w.geom) LIMIT 1) as kecamatan,
        (SELECT wadmkk FROM public.administrasi_desa d WHERE ST_Intersects(d.geom, w.geom) LIMIT 1) as kabupaten
      FROM wisata w
      LEFT JOIN categories c ON w.category_id = c.id
      ${whereClause}
      ORDER BY w.rating DESC 
      LIMIT 20
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM wisata w 
      LEFT JOIN categories c ON w.category_id = c.id 
      ${whereClause}
    `;

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
