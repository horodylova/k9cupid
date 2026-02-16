import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || null;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-21";

  let canFetch = false;
  let sampleCount = 0;
  let error: string | null = null;

  if (projectId && dataset) {
    try {
      const client = createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        perspective: "published",
      });
      const posts = await client.fetch("*[_type == \"post\"][0...1]{_id}");
      canFetch = Array.isArray(posts);
      sampleCount = Array.isArray(posts) ? posts.length : 0;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  } else {
    error = "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET";
  }

  const status = projectId && dataset && canFetch ? "ok" : "fail";

  return NextResponse.json({
    status,
    projectId,
    dataset,
    apiVersion,
    canFetch,
    sampleCount,
    error,
  });
}
