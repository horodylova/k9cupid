# Wishlist

## Route

- `GET /wishlist` → `src/app/(site)/wishlist/page.tsx`

## What It Stores

The wishlist page renders two independent lists:

- Breed wishlist items (links to `/breeds/...`)
- Shelter dog wishlist items (links to `/shelters/dogs/...`)

## Storage

- Breed wishlist storage: `src/lib/wishlistStorage.ts`
- Shelter dog wishlist storage: `src/lib/shelterDogWishlistStorage.ts`

## Update Model

- On mount, the page loads both lists and subscribes to changes using:
  - `subscribeWishlist`
  - `subscribeShelterDogWishlist`
- Remove actions call:
  - `removeWishlistItem`
  - `removeShelterDogWishlistItem`
