import { NextResponse } from "next/server";

type RescueOrg = {
  type: "orgs";
  id: string;
  attributes?: {
    name?: string;
    city?: string;
    state?: string;
    citystate?: string;
  };
};

type RescueOrgSearchResponse = {
  meta?: {
    count?: number;
    pages?: number;
    pageReturned?: number;
  };
  data?: Array<{ type: string; id: string }>;
  included?: RescueOrg[];
};

let cachedAt = 0;
let cached: Array<{ id: string; name: string; citystate: string }> | null = null;

export async function GET() {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  const now = Date.now();
  if (cached && now - cachedAt < 30 * 60 * 1000) {
    return NextResponse.json({ data: cached }, { status: 200 });
  }

  const byId = new Map<string, { id: string; name: string; citystate: string }>();
  const limit = 250;
  let page = 1;
  let pages = 1;

  while (page <= pages && page <= 1000) {
    const upstream = new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
    upstream.searchParams.set("page", String(page));
    upstream.searchParams.set("limit", String(limit));
    upstream.searchParams.set("include", "orgs");
    upstream.searchParams.set("fields[animals]", "name");
    upstream.searchParams.set("fields[orgs]", "name,city,state,citystate");

    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: apiKey,
      },
      cache: "no-store",
    });

    if (!res.ok) break;
    const json = (await res.json()) as RescueOrgSearchResponse;
    pages = Math.max(1, json.meta?.pages || 1);
    const rows = Array.isArray(json.included) ? json.included : [];
    for (const o of rows) {
      if (o.type !== "orgs") continue;
      const attrs = o.attributes || {};
      const name = (attrs.name || "").trim();
      if (!name) continue;
      const citystate = (attrs.citystate || "").trim() || [attrs.city || "", attrs.state || ""].filter(Boolean).join(", ");
      byId.set(o.id, { id: o.id, name, citystate });
    }

    page += 1;
  }

  const all = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));

  cachedAt = now;
  cached = all;

  return NextResponse.json({ data: all }, { status: 200 });
}
