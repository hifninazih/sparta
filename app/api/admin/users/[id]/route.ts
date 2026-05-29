import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, full_name, password, role } = await request.json();
    const bcrypt = require('bcryptjs');

    const client = await pool.connect();
    try {
      let query = "UPDATE users SET username = $1, full_name = $2, role = $3";
      let values = [username, full_name, role, id];

      if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ", password = $5 WHERE id = $4";
        values.push(hashedPassword);
      } else {
        query += " WHERE id = $4";
      }

      const result = await client.query(query + " RETURNING id, username, full_name, role", values);
      
      if (result.rowCount === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Prevent superadmin from deleting themselves if they are the only one (optional but safe)
  if (id === session.user.id) {
    return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("DELETE FROM users WHERE id = $1", [id]);
      return NextResponse.json({ message: "User deleted successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}
