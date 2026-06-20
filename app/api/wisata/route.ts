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

    let whereClause = `
      WHERE c.is_active = true 
      AND (sk.is_active = true OR w.sub_kategori_id IS NULL)`;
    const values: (string | number | string[])[] = [];
    let paramIndex = 1;

    // --- FILTER KEYWORD ---
    if (search) {
      whereClause += ` AND w.nama_destinasi ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // --- FILTER KATEGORI (multi-value dengan ANY) ---
    if (kategoriList.length > 0) {
      whereClause += ` AND c.nama = ANY($${paramIndex})`;
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
        w.nama_destinasi as name, 
        c.nama as category, 
        sk.nama as sub_kategori,
        w.harga as price, 
        w.rating_gmaps as rating, 
        w.jumlah_ulasan as reviews,
        w.alamat as address,
        w.web as link,
        w.link_gmaps as maps_link,
        ST_X(w.geom) as lng, 
        ST_Y(w.geom) as lat,
        w.kalurahan_kelurahan as desa,
        w.kapanewon_kemantren as kecamatan,
        w.kabupaten_kota as kabupaten,
        w.username_instagram,
        w.daya_tarik_utama,
        w.daya_tarik_pendukung
      FROM destinasi w
      LEFT JOIN kategori c ON w.kategori_id = c.id
      LEFT JOIN sub_kategori sk ON w.sub_kategori_id = sk.id
      ${whereClause}
      ORDER BY w.rating_gmaps DESC NULLS LAST 
      LIMIT 20
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM destinasi w 
      LEFT JOIN kategori c ON w.kategori_id = c.id 
      LEFT JOIN sub_kategori sk ON w.sub_kategori_id = sk.id
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
