import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, name, color, icon, is_active, created_at 
        FROM categories 
        WHERE is_active = true
        ORDER BY name ASC
      `);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ success: false, message: "Error fetching categories" }, { status: 500 });
  }
}
