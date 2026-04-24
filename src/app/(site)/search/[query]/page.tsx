import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { getBreeds } from "@/lib/api";
import SearchResultsClient from "./SearchResultsClient";

type SanityPost = {
  title?: string;
  slug?: string;
};

export const revalidate = 0;

function parsePage(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = typeof raw === "string" ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export default async function SearchResultsPage({
  params,
  searchParams,
}: {
  params: { query: string };
  searchParams?: { b?: string | string[]; p?: string | string[] };
}) {
  const raw = decodeURIComponent(params.query || "");
  const query = raw.trim().slice(0, 80);
  const breedsPage = parsePage(searchParams?.b);
  const postsPage = parsePage(searchParams?.p);

  if (query.length < 2) {
    return (
      <>
        <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
          <div className="container">
            <div className="hero-content py-5 my-3">
              <h2 className="display-1 mt-3 mb-0">Search</h2>
              <nav className="breadcrumb">
                <Link className="breadcrumb-item nav-link" href="/">
                  Home
                </Link>
                <span className="breadcrumb-item active" aria-current="page">
                  Search
                </span>
              </nav>
            </div>
          </div>
        </section>

        <section className="py-5 my-5">
          <div className="container">
            <div className="bg-white border rounded-4 p-4">
              <h1 className="h4 mb-2">Type at least 2 characters</h1>
              <div className="text-muted">Use the search bar in the header to search for breeds and articles.</div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const [breedResult, postItems] = await Promise.all([
    getBreeds({ name: query, limit: 30 }),
    (async () => {
      try {
        const pattern = `*${query}*`;
        const groq = `*[_type == "post" && coalesce(publishedAt, _createdAt) <= now() && (title match $pattern || excerpt match $pattern)] | order(coalesce(publishedAt, _createdAt) desc)[0...30] {
          title,
          "slug": slug.current
        }`;
        const posts = await client.fetch<SanityPost[]>(groq, { pattern }, { next: { revalidate: 30 } });
        return (posts || [])
          .filter((p) => typeof p.title === "string" && p.title.trim() && typeof p.slug === "string" && p.slug.trim())
          .map((p) => ({
            title: p.title as string,
            slug: p.slug as string,
          }));
      } catch {
        return [] as Array<{ title: string; slug: string }>;
      }
    })(),
  ]);

  const breedNames = Array.from(new Set((breedResult?.breeds || []).map((b) => b.name))).slice(0, 30);

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Search</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Search
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-5 my-5">
        <div className="container">
          <div className="mb-4">
            <h1 className="h3 mb-1">Results for “{query}”</h1>
          </div>

          <SearchResultsClient
            query={query}
            breedNames={breedNames}
            posts={postItems}
            initialBreedsPage={breedsPage}
            initialPostsPage={postsPage}
          />
        </div>
      </section>
    </>
  );
}
