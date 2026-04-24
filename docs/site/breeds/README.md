# Breeds

## Routes

- Breeds list: `GET /breeds` → `src/app/(site)/breeds/page.tsx`
- Breed details: `GET /breeds/[name]` → `src/app/(site)/breeds/[name]/page.tsx`

## Data Sources

- Breed dataset and filters come from `src/lib/api.ts`:
  - `getBreeds(...)` is used by both the list page and the details page.
  - `getAdditionalBreedDetails(...)` is called on the details page.
- Adoptable matches (breed page) are fetched from RescueGroups:
  - `findAdoptableDogsForBreed(...)` inside `src/app/(site)/breeds/[name]/page.tsx`

## Breeds List (`/breeds`)

- Reads multiple filter query params from `searchParams` and forwards them to `getBreeds`.
- Pagination is implemented via `offset` + `limit`:
  - `limit` is fixed at 20.
  - `offset` is encoded as the `offset` query param.
- Sorting:
  - UI control: `src/components/BreedSorter.tsx`
  - `sort` param is forwarded to `getBreeds`.

## Breed Details (`/breeds/[name]`)

- Resolves the breed by name using `getBreeds({ name })`.
- Fetches additional details in parallel via `getAdditionalBreedDetails(name)`.
- Fetches adoptable dogs of this breed from RescueGroups (limited scan):
  - Up to 8 pages (`maxPagesToScan`)
  - Up to 6 matches (`desired`)
- “Find a Puppy” CTA:
  - If adoptable matches exist, links to `/shelters?breed=<breed>`
  - Otherwise links to `/shelters`
