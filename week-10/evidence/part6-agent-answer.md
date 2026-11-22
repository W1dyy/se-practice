## Review: AGENTS.md against your constraints (no files changed)

**Scope:** The only documentation inside `app/` (with `node_modules` and `dist` left out) is `AGENTS.md`. I also read `package.json` to check the commands it lists. I did not read any source or test files. Other docs sit outside the app root (`week-10/README.md`, `lab-report.md`, `AI_USAGE.md`, `submission.yml`, `provided/`), and I did not review them.

File: `<project>\se-practice\week-10\app\AGENTS.md`

### Rules that conflict with your constraints
1. **One fictional room.** The Project section says: "For realism, use real room names and the real timetable from the KBTU portal." That points agents at real data and an outside website.
2. **No login/database.** The "You may" section says: "If bookings need to persist, add a small Supabase table and a login page." That allows both a database and a login, and Supabase also brings in API keys.
3. **No external deployments.** The "Before you finish" section says: "When the build passes, publish a preview with `npx netlify deploy --prod`". That is a production deploy to an outside service.
4. **Scope is too open.** "Edit any file in the project" and "Add packages when a task needs them" have no limits. They make items 2 and 3 easier and allow edits to the tests.
5. **AC4 may have been changed.** AGENTS.md says "A request that touches a booking at an endpoint also counts as an overlap." I can't check this against the official AC list without reading the tests or the files in `provided/`. Please confirm that sentence is the real AC4 before the patch keeps it. The patch below leaves the wording as it is.

### Rules that are missing
6. **AC6.** Only AC1–AC5 are listed. I don't know AC6's wording, so the patch leaves a placeholder for you to fill in.
7. **Never weaken the ACs.** Nothing says agents must not change or drop the ACs, or edit tests to make them pass.
8. **No secrets.** There is no rule against committing `.env` files, keys or tokens. Supabase and Netlify would both bring them in.
9. **Run tests before proposing acceptance.** "Before you finish" only says to make sure the page loads.
10. **The test command is wrong.** AGENTS.md says `npm run test:unit`, but `package.json` only has `"test": "vitest run"`. As written, the test command fails.

### Draft patch (not applied, waiting for your approval)
```diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@ ## Project
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: exactly one fictional room with made-up, in-memory sample bookings. Do not use real
+room names, real timetables, or data fetched from any portal or external service.
 
 ## Acceptance contract
 
+AC1–AC6 are fixed. Do not remove, reword, or weaken them, and do not edit tests to make them pass.
+
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
 - AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 <TODO: insert official AC6 text>
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
-## You may
+## You may / must not
 
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit files under `src/` as the task needs. Ask before adding packages.
+- Do not add login, authentication, a database, or any backend (no Supabase or similar).
+- Never add or commit secrets (API keys, tokens, `.env` files, credentials).
+- Never deploy or publish anywhere (no Netlify, Vercel, `--prod`, or similar).
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`. Both must pass before you propose acceptance; report the results.
+- Make sure the page still loads locally (`npm run dev`).
```

Open decisions for you: approve the patch, give me the AC6 text, and confirm whether the AC4 endpoint-touching wording is official. Once you approve, I'll apply only this diff.
