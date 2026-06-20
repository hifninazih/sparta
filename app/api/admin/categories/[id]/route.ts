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
    const { name, color, icon, is_active } = await request.json();

    const client = await pool.connect();
    try {
      // Periksa apakah nama kategori sudah dipakai oleh ID lain
      const checkQuery = `SELECT id FROM kategori WHERE nama = $1 AND id != $2`;
      const checkResult = await client.query(checkQuery, [name, id]);
      if (checkResult.rows.length > 0) {
        return NextResponse.json({ message: "Kategori dengan nama ini sudah ada" }, { status: 400 });
      }

      const query = `
        UPDATE kategori 
        SET nama = $1, warna = $2, ikon = $3, is_active = $4
        WHERE id = $5
        RETURNING id, nama as name, warna as color, ikon as icon, is_active, created_at
      `;
      const result = await client.query(query, [name, color, icon, is_active, id]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }

      const updatedCat = result.rows[0];
      
      // Fetch sub categories to include in response
      const subCatResult = await client.query(`SELECT id, nama as name, is_active FROM sub_kategori WHERE kategori_id = $1`, [id]);
      updatedCat.sub_categories = subCatResult.rows;

      return NextResponse.json(updatedCat);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
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
      await client.query("DELETE FROM kategori WHERE id = $1", [id]);
      return NextResponse.json({ message: "Category deleted successfully" });
    } catch (err: any) {
      if (err.code === '23503') {
        return NextResponse.json({ message: "Kategori tidak bisa dihapus karena masih digunakan oleh data wisata atau sub kategori." }, { status: 400 });
      }
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}
