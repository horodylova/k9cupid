import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { getBreeds } from "@/lib/api";

type SearchItem = {
  type: "breed" | "post";
  title: string;
  href: string;
};

function buildSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
  if (!projectId || !dataset) return null;

  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-21";

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryRaw = (searchParams.get("query") || "").trim();
  const query = queryRaw.slice(0, 80);

  if (!query || query.length < 2) {
    return NextResponse.json({ breeds: [], posts: [] } satisfies { breeds: SearchItem[]; posts: SearchItem[] });
  }

  const sanity = buildSanityClient();

  const [breedItems, postItems] = await Promise.all([
    (async () => {
      try {
        const result = await getBreeds({ name: query });
        const uniqueNames = Array.from(new Set(result.breeds.map((b) => b.name))).slice(0, 6);
        return uniqueNames.map(
          (name) =>
            ({
              type: "breed",
              title: name,
              href: `/breeds/${encodeURIComponent(name)}`,
            }) satisfies SearchItem
        );
      } catch {
        return [] as SearchItem[];
      }
    })(),
    (async () => {
      if (!sanity) return [] as SearchItem[];
      try {
        const pattern = `*${query}*`;
        const groq = `*[_type == "post" && (title match $pattern || excerpt match $pattern)] | order(coalesce(publishedAt, _createdAt) desc)[0...6] {
          title,
          "slug": slug.current
        }`;
        const posts = await sanity.fetch<Array<{ title?: string; slug?: string }>>(groq, { pattern });
        return (posts || [])
          .filter((p) => typeof p.title === "string" && p.title.trim() && typeof p.slug === "string" && p.slug.trim())
          .map(
            (p) =>
              ({
                type: "post",
                title: p.title as string,
                href: `/blog/${encodeURIComponent(p.slug as string)}`,
              }) satisfies SearchItem
          );
      } catch {
        return [] as SearchItem[];
      }
    })(),
  ]);

  return NextResponse.json({ breeds: breedItems, posts: postItems } satisfies { breeds: SearchItem[]; posts: SearchItem[] });
}
