import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseIntParam(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export async function GET(request: Request) {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Missing RESCUEGROUPS_API_KEY" }, { status: 503 });
  }

  const url = new URL(request.url);
  const limit = Math.min(250, parseIntParam(url.searchParams.get("limit"), 25));
  const page = parseIntParam(url.searchParams.get("page"), 1);

  const upstream = new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
  upstream.searchParams.set("limit", String(limit));
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("include", "pictures,orgs,locations");
  upstream.searchParams.set(
    "fields[animals]",
    "name,breedString,sex,ageGroup,ageString,sizeGroup,url,pictureThumbnailUrl,descriptionText"
  );
  upstream.searchParams.set("fields[pictures]", "small,large,original,order");
  upstream.searchParams.set("fields[orgs]", "name,url,citystate,websiteUrl");
  upstream.searchParams.set("fields[locations]", "citystate,postalcode,state,country,lat,lon,coordinates");

  const res = await fetch(upstream, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: apiKey,
    },
    cache: "no-store",
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data, { status: res.status });
}

