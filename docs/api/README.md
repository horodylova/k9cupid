# API Routes

All API routes live under `src/app/api/*` and are implemented as Next.js route handlers.

## Newsletter

- Subscribe: `POST /api/newsletter/subscribe` → `src/app/api/newsletter/subscribe/route.ts`
  - Requires `DATABASE_URL`
  - Optionally sends a welcome email using helpers in `src/lib/newsletter.ts`
- Unsubscribe: `GET /api/newsletter/unsubscribe?token=...` → `src/app/api/newsletter/unsubscribe/route.ts`
  - Requires `DATABASE_URL`
  - Returns an HTML page response
- Send newsletter: `POST /api/send-newsletter` → `src/app/api/send-newsletter/route.ts`
  - Requires `DATABASE_URL` and `NEWSLETTER_CRON_SECRET`
  - Authorizes via `x-cron-secret` header

## RescueGroups Proxy / Helpers

- Animals search proxy: `src/app/api/rescuegroups/animals/route.ts`
  - Calls `https://api.rescuegroups.org/v5/public/animals/search/available/dogs/`
  - Requires `RESCUEGROUPS_API_KEY`
- Orgs index builder: `src/app/api/rescuegroups/orgs-index/route.ts`
  - Scans available dogs pages and aggregates included `orgs`
  - Caches results in-memory for 30 minutes
- Orgs search: `src/app/api/rescuegroups/orgs-search/route.ts`
  - Proxies `GET https://api.rescuegroups.org/v5/public/orgs/search`

## Search

- Unified search endpoint: `src/app/api/search/route.ts`
  - Returns breeds (via `getBreeds` from `src/lib/api.ts`)
  - Returns posts (via Sanity GROQ query using `next-sanity` client)
- Breeds-only search endpoint: `src/app/api/search-breeds/route.ts`

## Health

- Sanity health check: `src/app/api/sanity-health/route.ts`
