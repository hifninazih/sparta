import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const username = request.nextUrl.searchParams.get("username");
  
  if (!username) {
    return NextResponse.json({ exists: false });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );
      
      return NextResponse.json({ exists: result.rows.length > 0 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ message: "Error checking username" }, { status: 500 });
  }
}
