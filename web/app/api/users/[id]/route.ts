import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8000";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");
  const body = await request.text();

  const upstream = await fetch(`${BFF_URL}/users/${id}`, {
    method: "PATCH",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");

  const upstream = await fetch(`${BFF_URL}/users/${id}`, {
    method: "DELETE",
    headers: authorization ? { Authorization: authorization } : {},
  });

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
