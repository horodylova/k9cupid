# Search

## Routes

- Search results page: `GET /search/[query]` → `src/app/(site)/search/[query]/page.tsx`
- Header search UI: `src/components/GlobalSearchBar.tsx` (entry point for navigation to `/search/...`)

## Data Sources

- Breeds search uses `getBreeds` from `src/lib/api.ts`.
- Blog posts search uses Sanity GROQ via `client` from `src/sanity/lib/client.ts`.

## Query Model

- The route param `[query]` is decoded (`decodeURIComponent`) and truncated to 80 chars.
- If query length is `< 2`, the page renders an instructional message and does not fetch results.
- Pagination:
  - Breeds page uses `b` query param (`searchParams.b`)
  - Posts page uses `p` query param (`searchParams.p`)
  - Pagination and rendering are delegated to `SearchResultsClient.tsx`.

## Revalidation

- The search page exports `revalidate = 0` (no caching).
