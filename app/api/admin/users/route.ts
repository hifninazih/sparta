import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
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
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      const result = await client.query(
        "INSERT INTO users (username, full_name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, role",
        [username, full_name, hashedPassword, role]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
