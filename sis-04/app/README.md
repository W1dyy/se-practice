# Smart Campus Room Availability Checker (SIS #04)

A React + TypeScript page (Vite) that filters a small fictional room catalog by capacity and
equipment and tells you whether the chosen room is free for a requested time.

## Setup

```text
npm install
```

## Run

```text
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Test

```text
npx vitest run
```

(`npm test` runs the same command.) `npm run build` type-checks with `tsc` and builds into `dist/`.

## Modules

| File | Responsibility |
| --- | --- |
| `src/rooms.ts` | data only: the `Room` type, `EQUIPMENT` and the fictional `ROOMS` catalog |
| `src/booking.ts` | rules: `canBook` (AC1–AC5) and `checkRoom` (the chosen room's own data) |
| `src/filter.ts` | rule: `filterRooms` (F1 capacity, F2 all equipment) |
| `src/time.ts` | form helpers: `HH:MM` ↔ minutes, the form's two input messages |
| `src/App.tsx` | the page: form state and rendering, imports the rules |
| `src/*.test.ts` | Vitest suites with fixed test catalogs |
