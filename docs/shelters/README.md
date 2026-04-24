# Shelters

## Entry Points (Routes)

- Shelters listing: `GET /shelters` → `src/app/(site)/shelters/page.tsx`
- Dog details: `GET /shelters/dogs/[id]` → `src/app/(site)/shelters/dogs/[id]/page.tsx`
- Loading UI (route-level): `src/app/(site)/shelters/loading.tsx` (renders `Preloader`)

## Data Source

- Primary upstream is RescueGroups v5 public API:
  - `https://api.rescuegroups.org/v5/public/animals/search/available/dogs/`
  - Auth header uses `RESCUEGROUPS_API_KEY`

## Query Parameters (UI Filters)

The listing page reads these query params (all optional):

- `state` (two-letter code)
- `city` (string)
- `shelter` (RescueGroups org id)
- `shelterName` (display name)
- `breed` (string)
- `age` (`baby | young | adult | senior`)
- `size` (string, compared against `animals.sizeGroup`)
- `sort` (`newest | added | updated` from the UI)
- `page` (pagination)

## Filtering Model

The page combines:

- Upstream filtering (best-effort)
  - Always applies an upstream sort for scanning (`-animals.availableDate` by default; `-animals.createdDate` or `-animals.updatedDate` when selected).
  - For some filters, attempts `POST` filters to RescueGroups. If the API rejects the filter set, the request falls back to an age-only filter (`animals.ageGroup`) and then to plain `GET`.
- In-app filtering
  - Normalizes/derives `age` via `animals.ageGroup` and `animals.ageString` (`deriveAgeBucket`).
  - Filters by `breed` substring match against `animals.breedString`.
  - Filters by `size` substring match against `animals.sizeGroup`.
  - Filters by `state/city` using included `locations` first, then org fallback.

## Sorting (UI)

- UI control: `src/components/SheltersSorter.tsx`
  - Writes `sort` into query params and resets `page`.
  - Shows a route-transition overlay loader using `Preloader`.
- Sorting options map to RescueGroups sort fields:
  - `newest` → `-animals.availableDate`
  - `added` → `-animals.createdDate`
  - `updated` → `-animals.updatedDate`

## Exclusions & De-dupe

- Excluded RescueGroups animal IDs are defined in `src/lib/rescuegroupsExclusions.ts` and skipped in list/detail queries.
- “Info entries” (non-animal rows) are skipped using name pattern matching via `isRescuegroupsInfoEntryName`.
- The listing page also maintains an in-memory `seenDogIds` set while scanning to avoid duplicates.

## Images

- Listing cards use `animals.pictureThumbnailUrl` (no `include=pictures` needed for list).
- The listing page may upgrade RescueGroups CDN thumbnails by adding a `width` query param when the host is `cdn.rescuegroups.org`.

## Wishlist

- Listing card heart button: `src/components/ShelterDogWishlistHeartButton.tsx`
- Storage: `src/lib/shelterDogWishlistStorage.ts` (client-side persistence)
