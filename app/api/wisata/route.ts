import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bobot, userLocation } = body;

    // Default ke Tugu Jogja jika user belum set lokasi
    const lng = userLocation ? userLocation[0] : 110.367;
    const lat = userLocation ? userLocation[1] : -7.7829;

    // 1. QUERY GABUNGAN: POSTGIS LIMITER + PGROUTING DIJKSTRA
    const dbQuery = `
      WITH start_node AS (
        -- Cari simpul jalan terdekat dari lokasi user
        SELECT source AS id 
        FROM roads_java_2po_4pgr 
        ORDER BY geom_way <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) 
        LIMIT 1
      ),
      destinations AS (
        -- Filter 50 wisata terdekat (jarak lurus) & cari simpul tujuannya
        SELECT 
          w.id as wisata_id, w.name, w.rating, w.price, w.jumlah_fasilitas, w.geom,
          ST_AsGeoJSON(w.geom)::jsonb as geometry,
          (
            SELECT target AS id 
            FROM roads_java_2po_4pgr 
            ORDER BY geom_way <-> w.geom 
            LIMIT 1
          ) as target_node
        FROM vw_wisata_diy w
        ORDER BY w.geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
        LIMIT 50
      ),
      routing AS (
        -- Hitung rute jarak nyata ke 50 destinasi sekaligus
        SELECT end_vid, agg_cost as jarak_nyata_km
        FROM pgr_dijkstra(
          'SELECT id, source, target, km AS cost, km AS reverse_cost FROM roads_java_2po_4pgr',
          (SELECT id FROM start_node),
          (SELECT array_agg(target_node) FROM destinations),
          false 
        )
        WHERE node = end_vid
      )
      -- Gabungkan hasil & ubah KM ke Meter
      SELECT 
        d.wisata_id as id, d.name, d.rating, d.price, d.jumlah_fasilitas, 
        d.geometry, COALESCE(r.jarak_nyata_km * 1000, 999999) as jarak_nyata
      FROM destinations d
      LEFT JOIN routing r ON d.target_node = r.end_vid;
    `;

    const { rows } = await pool.query(dbQuery, [lng, lat]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data wisata di sekitar lokasi." },
        { status: 404 },
      );
    }

    // 2. TAHAP SAW: MENCARI NILAI MAX (BENEFIT) & MIN (COST)
    const maxRating = Math.max(...rows.map((r) => Number(r.rating) || 0));
    const maxFasilitas = Math.max(
      ...rows.map((r) => Number(r.jumlah_fasilitas) || 0),
    );

    // Untuk Cost (Harga & Jarak), abaikan nilai 0 agar tidak merusak perhitungan
    const validPrices = rows.map((r) => Number(r.price)).filter((p) => p > 0);
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

    const validDistances = rows
      .map((r) => Number(r.jarak_nyata))
      .filter((j) => j > 0);
    const minJarak =
      validDistances.length > 0 ? Math.min(...validDistances) : 1;

    // 3. TAHAP SAW: NORMALISASI MATRIKS & KALKULASI SKOR
    const results = rows.map((row) => {
      const cRating = Number(row.rating) || 0;
      const cFasilitas = Number(row.jumlah_fasilitas) || 0;
      const cPrice = Number(row.price) || 0;
      const cJarak = Number(row.jarak_nyata);

      // Normalisasi
      const normRating = maxRating === 0 ? 0 : cRating / maxRating; // Benefit
      const normFasilitas = maxFasilitas === 0 ? 0 : cFasilitas / maxFasilitas; // Benefit
      const normPrice = cPrice === 0 ? 1 : minPrice / cPrice; // Cost
      const normJarak = cJarak === 0 ? 1 : minJarak / cJarak; // Cost

      // Konversi bobot persen ke desimal (contoh: 30% jadi 0.3)
      const wRating = bobot.rating / 100;
      const wFasilitas = bobot.fasilitas / 100;
      const wPrice = bobot.harga / 100;
      const wJarak = bobot.jarak / 100;

      // Skor Akhir SAW
      const finalScore =
        normRating * wRating +
        normFasilitas * wFasilitas +
        normPrice * wPrice +
        normJarak * wJarak;

      return {
        type: "Feature",
        geometry: row.geometry,
        properties: {
          id: row.id,
          nama: row.nama,
          rating: cRating,
          jarak_nyata_meter: Math.round(cJarak),
          skor_saw: finalScore.toFixed(4),
          rank: 0,
        },
      };
    });

    // 4. URUTKAN BERDASARKAN SKOR TERTINGGI
    results.sort(
      (a, b) => Number(b.properties.skor_saw) - Number(a.properties.skor_saw),
    );

    // 5. INJEKSI RANKING (Untuk pewarnaan di Peta & Leaderboard)
    results.forEach((fitur, index) => {
      fitur.properties.rank = index + 1;
    });

    // Kembalikan dalam format GeoJSON FeatureCollection
    return NextResponse.json({
      type: "FeatureCollection",
      features: results,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan kalkulasi SPK." },
      { status: 500 },
    );
  }
}
