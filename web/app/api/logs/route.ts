import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.BFF_INTERNAL_URL ?? "http://bff:8000";

export async function GET(request: NextRequest) {
  const { search } = new URL(request.url);
  const upstream = await fetch(`${BFF_URL}/logs${search}`, {
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
    },
  });

  const data = await upstream.text();
  const nextResponse = new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });

  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) nextResponse.headers.set("set-cookie", setCookie);

  return nextResponse;
}
