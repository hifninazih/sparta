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
    const { name, category, price, rating, all_facility, lng, lat } = await request.json();

    // Parse comma-separated string into a JSON array
    const facilityArray = typeof all_facility === 'string' 
      ? all_facility.split(",").map((f: string) => f.trim()).filter(Boolean) 
      : (Array.isArray(all_facility) ? all_facility : []);

    const client = await pool.connect();
    try {
      const query = `
        UPDATE wisata_diy 
        SET name = $1, category = $2, price = $3, rating = $4, all_facility = $5, geom = ST_SetSRID(ST_MakePoint($6, $7), 4326)
        WHERE id = $8
        RETURNING id, name, category, price, rating, all_facility, ST_X(geom) as lng, ST_Y(geom) as lat
      `;
      const result = await client.query(query, [
        name, category, price, rating, JSON.stringify(facilityArray), lng, lat, id
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
      await client.query("DELETE FROM wisata_diy WHERE id = $1", [id]);
      return NextResponse.json({ message: "Wisata deleted successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete Wisata Error:", error);
    return NextResponse.json({ message: "Error deleting wisata" }, { status: 500 });
  }
}
