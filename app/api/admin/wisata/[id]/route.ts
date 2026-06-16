import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { 
      name, category, price, rating, reviews, address, phone, link, maps_link, lng, lat 
    } = await request.json();

    const client = await pool.connect();
    try {
      const query = `
        UPDATE wisata 
        SET name = $1, category_id = (SELECT id FROM categories WHERE name = $2), price = $3, rating = $4, reviews = $5, address = $6, phone = $7, link = $8, maps_link = $9, geom = ST_SetSRID(ST_MakePoint($11::float8, $10::float8), 4326)
        WHERE gid = $12
        RETURNING gid, name, (SELECT name FROM categories WHERE id = category_id) as category, price, rating, reviews, address, phone, link, maps_link, ST_X(geom) as lng, ST_Y(geom) as lat
      `;
      const result = await client.query(query, [
        name, category, price, rating, reviews, address, phone, link, maps_link, lat, lng, id
      ]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Wisata not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update Wisata Error:", error);
    return NextResponse.json({ message: "Error updating wisata" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("DELETE FROM wisata WHERE gid = $1", [id]);
      return NextResponse.json({ message: "Wisata deleted successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete Wisata Error:", error);
    return NextResponse.json({ message: "Error deleting wisata" }, { status: 500 });
  }
}
