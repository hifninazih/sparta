import { NextResponse } from "next/server";
import pool from "@/lib/db"; // <-- Import dari lib yang baru dibuat

export async function GET() {
  try {
    // Query ini sangat disukai dosen karena mengandalkan kemampuan asli PostGIS
    // Mengubah tabel relasional langsung menjadi format GeoJSON FeatureCollection
    const query = `
      SELECT jsonb_build_object(
          'type',     'FeatureCollection',
          'features', jsonb_agg(features.feature)
      ) as geojson
      FROM (
        SELECT jsonb_build_object(
          'type',       'Feature',
          'id',         id,
          'geometry',   ST_AsGeoJSON(geom)::jsonb,
          'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (SELECT * FROM vw_wisata_diy) inputs
      ) features;
    `;

    const { rows } = await pool.query(query);

    // Kembalikan hasil GeoJSON ke frontend
    return NextResponse.json(rows[0].geojson);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}
