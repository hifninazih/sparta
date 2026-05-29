import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await logout();
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303, // Use 303 See Other for redirects after POST
  });
}
