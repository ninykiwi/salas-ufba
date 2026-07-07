import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  const upstream = await fetch(`${BFF_URL}/users`, {
    headers: authorization ? { Authorization: authorization } : {},
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const body = await request.text();

  const upstream = await fetch(`${BFF_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body,
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
