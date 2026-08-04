# Studio (Sanity)

## Entry Point (Route)

- Studio is mounted at `GET /studio` via:
  - `src/app/studio/[[...tool]]/page.tsx`
  - This route renders `NextStudio` from `next-sanity/studio`.

## Configuration

- Studio config: `sanity.config.ts`
  - `basePath: "/studio"`
  - Uses `projectId` and `dataset` from `src/sanity/env.ts`
  - Uses schema from `src/sanity/schemaTypes/*`
  - Enables `structureTool()` from `sanity/structure`

## Schemas

- Schema index: `src/sanity/schemaTypes/index.ts`
- Post schema: `src/sanity/schemaTypes/post.ts`
- Category schema: `src/sanity/schemaTypes/category.ts`

## Notes

- The Studio route exports `metadata` and `viewport` from `next-sanity/studio`.
- The Studio route sets `export const dynamic = "force-static"`.
