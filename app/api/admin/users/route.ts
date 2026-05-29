import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  // ... existing code
  const session = await getSession();
  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at DESC"
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, full_name, password, role } = await request.json();
    
    if (!username || !password || !full_name || !role) {
      return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
    }

    const id = generateId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      const result = await client.query(
        "INSERT INTO users (id, username, full_name, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, full_name, role",
        [id, username, full_name, hashedPassword, role]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);
    if (error.code === '23505') {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }
    // Jika error karena tipe data id (masih integer di DB)
    if (error.code === '22P02') {
      return NextResponse.json({ 
        message: "Database Error: Kolom ID masih bertipe Integer. Silakan jalankan migrasi SQL yang saya berikan sebelumnya." 
      }, { status: 500 });
    }
    return NextResponse.json({ message: "Error creating user: " + error.message }, { status: 500 });
  }
}
