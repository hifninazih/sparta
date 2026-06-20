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
          w.gid, w.nama_destinasi as name, c.nama as category, sk.nama as sub_kategori, w.kategori_id, w.sub_kategori_id, COALESCE(w.harga, 0) as price, COALESCE(w.rating_gmaps, 0) as rating, COALESCE(w.jumlah_ulasan, 0) as reviews, w.alamat as address, w.web as link, w.link_gmaps as maps_link,
          w.username_instagram, w.daya_tarik_utama, w.daya_tarik_pendukung,
          ST_X(w.geom) as lng, ST_Y(w.geom) as lat
        FROM destinasi w
        LEFT JOIN kategori c ON w.kategori_id = c.id
        LEFT JOIN sub_kategori sk ON w.sub_kategori_id = sk.id
        WHERE w.nama_destinasi ILIKE $1 OR c.nama ILIKE $1
        ORDER BY w.nama_destinasi ASC
      `;
      const result = await client.query(query, [`%${search}%`]);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch Wisata Error:", error);
    return NextResponse.json(
      { message: "Error fetching wisata data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      name,
      kategori_id,
      sub_kategori_id,
      price,
      rating,
      reviews,
      address,
      link,
      maps_link,
      username_instagram,
      daya_tarik_utama,
      daya_tarik_pendukung,
      lng,
      lat,
    } = await request.json();

    if (!name || !kategori_id || lng === undefined || lat === undefined) {
      return NextResponse.json(
        {
          message: "Field wajib (nama, kategori, koordinat) tidak boleh kosong",
        },
        { status: 400 },
      );
    }

    const newId = generateId();

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO destinasi (
          id, nama_destinasi, kategori_id, sub_kategori_id, harga, rating_gmaps, jumlah_ulasan, alamat, web, link_gmaps, username_instagram, daya_tarik_utama, daya_tarik_pendukung, geom
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, ST_SetSRID(ST_MakePoint($15, $14), 4326)
        )
        RETURNING gid, nama_destinasi as name, (SELECT nama FROM kategori WHERE id = $3) as category, (SELECT nama FROM sub_kategori WHERE id = $4) as sub_kategori, kategori_id, sub_kategori_id, harga as price, rating_gmaps as rating, jumlah_ulasan as reviews, alamat as address, web as link, link_gmaps as maps_link, username_instagram, daya_tarik_utama, daya_tarik_pendukung, ST_X(geom) as lng, ST_Y(geom) as lat
      `;
      const result = await client.query(query, [
        newId,
        name,
        kategori_id,
        sub_kategori_id || null,
        price || 0,
        rating || 0,
        reviews || 0,
        address,
        link,
        maps_link,
        username_instagram,
        daya_tarik_utama,
        daya_tarik_pendukung,
        lat,
        lng,
      ]);
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("CREATE WISATA ERROR:", error);
    if (error.code === "22P02") {
      return NextResponse.json(
        {
          message:
            "Database Error: Kolom ID masih bertipe Integer atau syntax JSON salah.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Error creating wisata: " + error.message },
      { status: 500 },
    );
  }
}
