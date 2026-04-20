import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

// Site-wide view total. Maintained by POST /api/views/[slug] — each
// article POST also increments `site:total` atomically (same KV namespace).
// This endpoint is read-only; no writes here.
export async function GET() {
  const { env } = getCloudflareContext();
  const count = Number((await env.VIEWS.get("site:total")) ?? 0);
  return NextResponse.json(
    { count },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}
