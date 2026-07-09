import { NextRequest } from "next/server";

const BFF_URL = process.env.BFF_INTERNAL_URL ?? "http://bff:8000";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const upstream = await fetch(`${BFF_URL}/notifications/stream`, {
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
    },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
