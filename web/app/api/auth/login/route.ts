import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const upstream = await fetch(`${BFF_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
