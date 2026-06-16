import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Menggunakan ST_Union untuk melakukan dissolve semua batas desa menjadi 1 poligon provinsi.
      // Kita tambahkan ST_Simplify untuk mengurangi ukuran data agar lebih cepat dimuat di frontend.
      const query = `
        WITH diy AS (
          SELECT ST_Simplify(ST_Union(geom), 0.0005) AS geom
          FROM administrasi_desa
        )
        SELECT jsonb_build_object(
          'type', 'FeatureCollection',
          'features', jsonb_build_array(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(diy.geom)::jsonb,
              'properties', jsonb_build_object('type', 'outline')
            ),
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Difference(ST_MakeEnvelope(-180, -90, 180, 90, 4326), diy.geom))::jsonb,
              'properties', jsonb_build_object('type', 'mask')
            )
          )
        ) as geojson
        FROM diy;
      `;
      const result = await client.query(query);
      return NextResponse.json(result.rows[0].geojson);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching province boundary:", error);
    return NextResponse.json(
      { message: "Failed to fetch province boundary" },
      { status: 500 }
    );
  }
}
