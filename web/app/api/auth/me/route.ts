import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  const upstream = await fetch(`${BFF_URL}/auth/me`, {
    headers: authorization ? { Authorization: authorization } : {},
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
