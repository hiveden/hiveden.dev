import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

const key = (slug: string) => `views:${slug}`;

// Whitelist: slug must match known document/article structure to avoid
// unlimited key creation via random /api/views/<junk> hits.
const VALID_SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!VALID_SLUG.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  const { env } = getCloudflareContext();
  const count = Number((await env.VIEWS.get(key(slug))) ?? 0);
  return NextResponse.json(
    { slug, count },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!VALID_SLUG.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  const { env } = getCloudflareContext();
  const [currentRaw, siteRaw] = await Promise.all([
    env.VIEWS.get(key(slug)),
    env.VIEWS.get("site:total"),
  ]);
  const next = Number(currentRaw ?? 0) + 1;
  const siteNext = Number(siteRaw ?? 0) + 1;
  await Promise.all([
    env.VIEWS.put(key(slug), String(next)),
    env.VIEWS.put("site:total", String(siteNext)),
  ]);
  return NextResponse.json({ slug, count: next, siteTotal: siteNext });
}
