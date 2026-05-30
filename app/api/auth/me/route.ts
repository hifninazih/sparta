import { NextRequest, NextResponse } from "next/server";
import { getSession, login } from "@/lib/auth";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json(session.user);
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { username, full_name, password, currentPassword } = await request.json();
    const userId = session.user.id;

    if (!currentPassword) {
      return NextResponse.json({ message: "Password saat ini diperlukan" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // 1. Verifikasi password saat ini
      const userRes = await client.query("SELECT password FROM users WHERE id = $1", [userId]);
      const user = userRes.rows[0];

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Password saat ini salah" }, { status: 401 });
      }

      // 2. Cek ketersediaan username jika ingin diubah
      if (username !== session.user.username) {
        const checkRes = await client.query("SELECT id FROM users WHERE username = $1 AND id != $2", [username, userId]);
        if (checkRes.rows.length > 0) {
          return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 });
        }
      }

      // 3. Siapkan query update
      let query = "UPDATE users SET username = $1, full_name = $2";
      let params = [username, full_name];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ", password = $3 WHERE id = $4";
        params.push(hashedPassword, userId);
      } else {
        query += " WHERE id = $3";
        params.push(userId);
      }

      const result = await client.query(query + " RETURNING id, username, full_name, role", params);
      const updatedUser = result.rows[0];

      // 4. Perbarui sesi
      await login(updatedUser);

      return NextResponse.json(updatedUser);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui data" }, { status: 500 });
  }
}
