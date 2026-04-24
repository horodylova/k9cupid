# Account

## Route

- `GET /account` → `src/app/(site)/account/page.tsx`

## Purpose

The account page shows a saved quiz summary and saved results when they exist on the current device.

## Data Sources

- Reads quiz session and final results from local storage via `src/lib/quizStorage.ts`:
  - `loadQuizSession`
  - `loadQuizFinalResults`
- Generates analysis text via `src/lib/quizAnalysis.ts` (`getResultAnalysis`).
- (Re)computes final matches using:
  - `getQuizInterimBreeds` server action (`src/app/actions.ts`)
  - `calculateFinalBreeds` (`src/lib/quizScoring.ts`)

## Notes

- The page is a client component (`"use client"`), so everything runs in the browser and depends on local storage availability.
