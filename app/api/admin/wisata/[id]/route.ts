import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await params;

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

    const client = await pool.connect();
    try {
      const query = `
        UPDATE destinasi 
        SET nama_destinasi = $1, kategori_id = $2, sub_kategori_id = $3, harga = $4, rating_gmaps = $5, jumlah_ulasan = $6, alamat = $7, web = $8, link_gmaps = $9, username_instagram = $10, daya_tarik_utama = $11, daya_tarik_pendukung = $12, geom = ST_SetSRID(ST_MakePoint($14::float8, $13::float8), 4326)
        WHERE gid = $15
        RETURNING gid, nama_destinasi as name, (SELECT nama FROM kategori WHERE id = $2) as category, (SELECT nama FROM sub_kategori WHERE id = $3) as sub_kategori, kategori_id, sub_kategori_id, harga as price, rating_gmaps as rating, jumlah_ulasan as reviews, alamat as address, web as link, link_gmaps as maps_link, username_instagram, daya_tarik_utama, daya_tarik_pendukung, ST_X(geom) as lng, ST_Y(geom) as lat
      `;
      const result = await client.query(query, [
        name,
        kategori_id,
        sub_kategori_id || null,
        price,
        rating,
        reviews,
        address,
        link,
        maps_link,
        username_instagram,
        daya_tarik_utama,
        daya_tarik_pendukung,
        lat,
        lng,
        id,
      ]);

      if (result.rowCount === 0) {
        return NextResponse.json(
          { message: "Wisata not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update Wisata Error:", error);
    return NextResponse.json(
      { message: "Error updating wisata" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("DELETE FROM destinasi WHERE gid = $1", [id]);
      return NextResponse.json({ message: "Wisata deleted successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete Wisata Error:", error);
    return NextResponse.json(
      { message: "Error deleting wisata" },
      { status: 500 },
    );
  }
}
