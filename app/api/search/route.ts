import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Format Data Standar agar Frontend tidak bingung
export interface UnifiedSearchResult {
  gid: string;
  name: string;
  type: "wisata" | "osm"; // Untuk membedakan sumber data
  category?: string; // Hanya ada di wisata
  lng: number;
  lat: number;
  address?: string; // Nama alamat lengkap (untuk OSM/lokal)
  price?: number;
  rating?: number;
  reviews?: number;
  phone?: string;
  link?: string;
  maps_link?: string;
}

// Tipe respons dari Nominatim OSM API
interface NominatimResult {
  place_id: number;
  name: string;
  display_name: string;
  lon: string;
  lat: string;
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ data: [] });
    }

    const keyword = query.trim();

    // 1. QUERY LOKAL: Cari di Database (PostgreSQL)
    const localQuery = `
      SELECT 
        w.gid::text, w.name, c.name as category, 
        w.price, w.rating, w.reviews, w.address, w.phone, w.link, w.maps_link,
        ST_X(w.geom) as lng, ST_Y(w.geom) as lat 
      FROM wisata w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE w.name ILIKE $1 AND c.is_active = true
      LIMIT 5
    `;
    const localDbPromise = pool.query(localQuery, [`%${keyword}%`]);

    // 2. QUERY EKSTERNAL: Cari di Nominatim OSM
    // Tambahkan viewbox dan bounded=1 untuk MENGUNCI pencarian HANYA di D.I. Yogyakarta
    const jogjaViewbox = "110.00,-7.50,110.90,-8.20";

    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=jsonv2&countrycodes=id&limit=5&viewbox=${jogjaViewbox}&bounded=1`;

    const osmPromise = fetch(osmUrl, {
      headers: { "User-Agent": "SPARTA-WebGIS-App/1.0" },
    }).then((res) => res.json());

    // 3. Eksekusi Keduanya Secara Bersamaan
    const [localResult, osmResult] = await Promise.all([
      localDbPromise,
      osmPromise,
    ]);

    // 4. Standarisasi Format Data
    const formattedLocal: UnifiedSearchResult[] = localResult.rows.map(
      (row) => ({
        gid: `local-${row.gid}`,
        name: row.name,
        type: "wisata",
        category: row.category,
        lng: row.lng,
        lat: row.lat,
        price: row.price,
        rating: row.rating,
        reviews: row.reviews,
        address: row.address,
        phone: row.phone,
        link: row.link,
        maps_link: row.maps_link,
      }),
    );

    const formattedOsm: UnifiedSearchResult[] = osmResult.map((item: NominatimResult) => ({
      gid: `osm-${item.place_id}`,
      name: item.name || item.display_name.split(",")[0], // Ambil nama utamanya saja
      type: "osm",
      lng: parseFloat(item.lon),
      lat: parseFloat(item.lat),
      address: item.display_name, // Alamat lengkapnya simpan di sini
    }));

    // 5. Gabungkan hasil (Prioritaskan DB Lokal di atas OSM)
    const combinedResults = [...formattedLocal, ...formattedOsm];

    return NextResponse.json({ success: true, data: combinedResults });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
