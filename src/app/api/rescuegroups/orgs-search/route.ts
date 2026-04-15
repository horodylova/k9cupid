import { NextRequest, NextResponse } from "next/server";

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
  data?: RescueOrg[];
};

function parseIntParam(value: string | null, fallback: number, min: number, max: number) {
  const n = value ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export async function GET(req: NextRequest) {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json({ meta: { count: 0, pages: 0, pageReturned: 1 }, data: [] }, { status: 200 });
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  const page = parseIntParam(req.nextUrl.searchParams.get("page"), 1, 1, 9999);
  const limit = parseIntParam(req.nextUrl.searchParams.get("limit"), 30, 1, 100);

  const upstream = new URL("https://api.rescuegroups.org/v5/public/orgs/search");
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("limit", String(limit));
  upstream.searchParams.set("sort", "orgs.name");
  upstream.searchParams.set("fields[orgs]", "name,city,state,citystate");
  if (q) {
    upstream.searchParams.set("search", q);
  }

  const res = await fetch(upstream, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ meta: { count: 0, pages: 0, pageReturned: page }, data: [] }, { status: 200 });
  }

  const json = (await res.json()) as RescueOrgSearchResponse;
  const rows = (json.data || []).map((o) => {
    const attrs = o.attributes || {};
    const name = attrs.name || "";
    const city = attrs.city || "";
    const state = attrs.state || "";
    const citystate = attrs.citystate || [city, state].filter(Boolean).join(", ");
    return { id: o.id, name, citystate };
  });

  return NextResponse.json(
    {
      meta: {
        count: json.meta?.count || 0,
        pages: json.meta?.pages || 0,
        pageReturned: json.meta?.pageReturned || page,
      },
      data: rows,
    },
    { status: 200 }
  );
}
