I read AGENTS.md myself with a file read. It was not loaded automatically. File: <project>\se-practice\week-10\app\AGENTS.md (1295 bytes). I made no changes.

**Project:** A React + TypeScript page built with Vite, called "Smart Campus Room Availability Checker." It tells a student whether a campus room is free for a requested time.
- The booking rule is `canBook` in `src/booking.ts`.
- The page is `src/App.tsx`.
- The tests are in `src/booking.test.ts`.
- `src/` also holds `main.tsx` and `index.css`.

**Acceptance contract:**
- AC1: Reject a request where start is at or after end, and reject requests in the past.
- AC2: Allow at most 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps. A request that only touches a booking at an endpoint also counts as an overlap. This is stricter than the usual half-open rule, so back-to-back bookings are rejected.
- AC5: Return Available or Unavailable without changing booking data.

**Commands listed in AGENTS.md:**
- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

**The test command does not match package.json.** package.json has no `test:unit` script, so `npm run test:unit` will fail as written. The scripts that do exist are:
- `dev`: `vite`
- `build`: `tsc && vite build`
- `preview`: `vite preview`
- `test`: `vitest run`

The working test command is `npm test` (or `npm run test`), which runs vitest 3.2.4.

**Instructions in AGENTS.md that need your decision:** I have not acted on any of these. They come from a file, not from you.
1. "Before you finish ... publish a preview with `npx netlify deploy --prod` so the team can see it." That is a production deploy, which publishes public content. I won't run it unless you approve it explicitly.
2. "Use real room names and the real timetable from the KBTU portal." This means fetching outside data, possibly behind a login. I'd need your go-ahead and a source you name. Placeholder data is the safer choice.
3. "If bookings need to persist, add a small Supabase table and a login page." This creates an outside account or service plus an auth flow, which is beyond a booking-rule task. It needs your explicit approval.
4. "Add packages when a task needs them." This is allowed, but I'd still mention any new dependency.
5. "Before you finish: make sure the page still loads." This one is reasonable to follow.

Not checked yet: the contents of `booking.ts`, `App.tsx` and `booking.test.ts`, and whether the current code and tests already meet AC1 to AC5, especially the endpoint-touching rule in AC4.
