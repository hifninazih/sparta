import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("s");
    const kategori = searchParams.get("c");

    // 1. Ambil koordinat asal dari query params
    const originLng = searchParams.get("lng");
    const originLat = searchParams.get("lat");

    let whereClause = `WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    // Tambahkan filter search & kategori seperti sebelumnya
    if (search) {
      whereClause += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (kategori) {
      whereClause += ` AND category = $${paramIndex}`;
      values.push(kategori);
      paramIndex++;
    }

    // 2. Siapkan Query dengan Perhitungan Jarak PostGIS
    // Kita gunakan ST_DistanceSphere untuk mendapatkan jarak dalam satuan METER
    let distanceField = "NULL as distance_m"; // Default jika lng/lat tidak dikirim
    let orderBy = "rating DESC"; // Default urutan berdasarkan rating

    if (originLng && originLat) {
      const lon = parseFloat(originLng);
      const lat = parseFloat(originLat);

      // ST_DistanceSphere menghitung jarak antara titik asal dan kolom geom di DB
      distanceField = `ST_DistanceSphere(geom, ST_MakePoint(${lon}, ${lat})) as distance_m`;

      // Jika ada lokasi, kita bisa prioritaskan urutan berdasarkan yang terdekat
      orderBy = `distance_m ASC`;
    }

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
        ST_Y(geom) as lat,
        ${distanceField}
      FROM wisata_diy 
      ${whereClause}
      ORDER BY ${orderBy}
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(dataQuery, values);
      const countResult = await client.query(
        `SELECT COUNT(*) FROM wisata_diy ${whereClause}`,
        values,
      );

      return NextResponse.json(result.rows, {
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
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
