# Blog

## Routes

- Blog index: `GET /blog` → `src/app/(site)/blog/page.tsx`
- Blog post: `GET /blog/[id]` → `src/app/(site)/blog/[id]/page.tsx`

## Data Source

- Blog posts are fetched from Sanity using `client`:
  - `src/sanity/lib/client.ts`
  - Queries use GROQ (`*[_type == "post"] ...`)
- Images are built using `urlFor`:
  - `src/sanity/lib/image.ts`

## Blog Index Behavior

- Fetches up to all posts and then paginates in the UI:
  - Uses `page` query param (`searchParams.page`)
  - Page size: 6 posts per page (`POSTS_PER_PAGE`)
- Featured post selection:
  - Picks the most recently updated post among those marked `featured`
  - If none are featured, falls back to the first post in the list
- Newsletter subscribe card:
  - On page 1, injects an inline subscribe card into the grid (`NewsletterSubscribeForm`)

## Fallback Content (Dev Only)

- If Sanity fetch fails and the app is not running in production, it falls back to a hardcoded set of posts (`fallbackBlogPosts`).

## Revalidation

- The page exports `revalidate = 60` (route-level) and also uses `client.fetch(..., { next: { revalidate: 30 } })` for the Sanity request.
