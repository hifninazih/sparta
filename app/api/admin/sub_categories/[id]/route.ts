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
    const { name, is_active } = await request.json();

    const client = await pool.connect();
    try {
      const query = `
        UPDATE sub_kategori 
        SET nama = $1, is_active = $2
        WHERE id = $3
        RETURNING id, nama as name, is_active
      `;
      const result = await client.query(query, [name, is_active, id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Sub Category not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update Sub Category Error:", error);
    return NextResponse.json({ message: "Error updating sub category" }, { status: 500 });
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
      await client.query("DELETE FROM sub_kategori WHERE id = $1", [id]);
      return NextResponse.json({ message: "Sub Category deleted successfully" });
    } catch (err: any) {
      if (err.code === '23503') {
        return NextResponse.json({ message: "Sub Kategori tidak bisa dihapus karena masih digunakan oleh data wisata." }, { status: 400 });
      }
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete Sub Category Error:", error);
    return NextResponse.json({ message: "Error deleting sub category" }, { status: 500 });
  }
}
