# [OPEN] Debug Session: search-vendor-chunk-error

## Symptom
- Search page fails in dev with `Cannot find module './vendor-chunks/bootstrap.js'`.

## Hypotheses
1. The `.next` build cache is stale/corrupted, so the server bundle references a chunk file that no longer exists.
2. A recent change in `src/app/(site)/search/[query]/page.tsx` altered the server bundle shape and exposed an existing dev build inconsistency rather than a code logic error.
3. The error is caused by a partial or interrupted Next.js dev/build output, leaving `.next/server/vendor-chunks` incomplete.
4. A dependency/runtime mismatch in Next.js 14.2.12 dev mode is surfacing only for the search route when it is compiled on demand.
5. The search route is indirectly importing something server-incompatible, and the missing `bootstrap.js` message is a secondary symptom from failed chunk generation.

## Plan
- Inspect `.next/server` output and search route dependencies.
- Reproduce via clean rebuild if needed.
- Only apply the minimal fix after evidence confirms root cause.

## Evidence
- `.next/server/vendor-chunks` did not contain `bootstrap.js`, while the compiled search bundle referenced `vendor-chunks/bootstrap` via `BootstrapClient`.
- `npm ls bootstrap` confirmed `bootstrap@5.3.8` is installed correctly.
- After `rm -rf .next && npm run build`, the project compiled normally up to the pre-existing prerender errors unrelated to search.
- After a clean `npm run dev`, requesting `/search/test` returned `HTTP/1.1 200 OK`.

## Conclusion
- Confirmed: stale/corrupted `.next` dev output caused the missing vendor chunk error.
- Rejected: Phase 1 search code change did not break route logic or module resolution.
- Minimal fix: clear `.next` and restart the dev server.
