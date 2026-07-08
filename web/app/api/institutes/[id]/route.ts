import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.BFF_INTERNAL_URL ?? "http://bff:8000";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const upstream = await fetch(`${BFF_URL}/institutes/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
    },
  });

  if (upstream.status === 204) {
    const nextResponse = new NextResponse(null, { status: 204 });
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) nextResponse.headers.set("set-cookie", setCookie);
    return nextResponse;
  }

  const data = await upstream.text();
  const nextResponse = new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });

  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) nextResponse.headers.set("set-cookie", setCookie);

  return nextResponse;
}
