# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

**Authorship note:** this SIS was carried out by the Claude Code agent (Anthropic, model `claude-opus-5-5`) at the student's request, with separate read-only Claude Code subagents used as "the assistant" for the analysis exchanges. The student's personal review is still pending; see `AI_USAGE.md`.

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude Code (desktop app), read-only Plan/Explore subagents for analysis; main Claude Code session for edits |
| Assistant model | claude-opus-5-5 |
| Starting point | week-08 |
| Baseline commit | c2f9e71 |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | my computer (Windows 11, Node v24.14.1), run by the Claude Code agent |

### 1.1 Baseline run

Run in `sis-04/app/` right after the baseline commit, before any change (only the absolute path is shortened to `.../`).

```text
RUN  v3.2.4 .../se-practice/sis-04/app

 ✓ src/booking.test.ts (22 tests) 16ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  18:16:45
   Duration  1.69s (transform 226ms, setup 0ms, collect 243ms, tests 16ms, environment 0ms, prepare 624ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
sis-04/app/
├── src/booking.ts       canBook({ start, end, now, blocked, bookings }): the AC1–AC5 rule, minutes after midnight
├── src/booking.test.ts  22 Vitest tests of canBook (T01–T14, X1–X2, AC5, PAST, REPEAT, REJECTED, BUG-A, BUG-B)
├── src/App.tsx          the page: ROOMS (2 rooms) and the Room type, form state, toMinutes()/fmt(),
│                        check() (validates the form, calls canBook) and all rendering
├── src/main.tsx         React entry point
├── src/index.css        layout, max-width: 480px media query for phones
└── package.json         scripts: dev, build (tsc && vite build), preview, test (vitest run)
```

### 2.2 The context message as sent

Sent on 2026-11-22 to a fresh read-only Claude Code subagent (Plan mode, cannot edit). A first line with the absolute project path was added in front of it so the subagent could find the files.

```text
You are reviewing a small React + TypeScript (Vite, Vitest 3.2.4) project: the Smart Campus Room Availability Checker. Project folder: sis-04/app. Do not write code yet and do not edit any file.

Repository map:
- src/booking.ts — canBook({ start, end, now, blocked, bookings }): the AC1–AC5 rule, minutes after midnight
- src/booking.test.ts — 22 Vitest tests of canBook (T01–T14, X1–X2, AC5, PAST, REPEAT, REJECTED, BUG-A, BUG-B)
- src/App.tsx — the page: holds the room data (ROOMS, 2 rooms, type Room declared here), the form state, toMinutes()/fmt() time helpers, check() which validates the form and calls canBook, and all rendering
- src/main.tsx — React entry point
- src/index.css — layout, including a max-width: 480px media query
- package.json — scripts dev, build (tsc && vite build), preview, test (vitest run)

Acceptance criteria to preserve:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New requirements (a catalog of at least four fictional rooms; each room has id, name, capacity, equipment list, blocked status and its own bookings; show only rooms that satisfy the selected requirements; the availability check must use the chosen room's bookings):
F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

Fixed target layout: src/rooms.ts (Room type + ROOMS), src/filter.ts (filterRooms(rooms, { attendees, equipment })), src/booking.ts (canBook unchanged + checkRoom(rooms, roomId, { start, end, now }) that calls canBook with that room's own blocked and bookings), the UI imports the rules and holds no room data or rule of its own.

Constraints: no login, payments, live APIs or database; fictional data only; no new runtime dependencies unless justified.

Please give me: (1) at least three maintainability risks in the CURRENT code, each with the file/function reference and what in the code shows it; (2) a numbered plan of small, safe steps (smallest first), each step keeping the 22 existing tests green, and saying which test to write first for each new rule. I want a plan, not a full rewrite, and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

Each row was checked in the baseline code (`git show c2f9e71:sis-04/app/src/App.tsx`, `.../booking.ts`).

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The room's own `blocked` field is never read; a global "Room blocked" checkbox decides, so F3 cannot hold per room | `src/App.tsx`, `App()` / `check()` | `const [blocked, setBlocked] = useState(false)`; `check()` calls `canBook({ ..., blocked, bookings: room.bookings })`; `room.blocked` appears nowhere | High |
| 2 | Room data, the `Room` type and the time helpers live inside the UI file, so no test can import them without React | `src/App.tsx`, `ROOMS`, `toMinutes()`, `fmt()` | `type Room` and `const ROOMS: Room[]` are declared in App.tsx; `booking.ts` repeats the interval shape inline as `{ start: number; end: number }[]` | High |
| 3 | `check()` sets the "end must be after start" error but does not return, so the page shows the error and "Unavailable" together (AC6) | `src/App.tsx`, `check()` | the `if (!(s < e)) { setError(...) } else { setError('') }` block falls through to `canBook(...)` and `setResult(ok)` | Medium |
| 4 | The result is only cleared inside `check()`; a room change leaves the old verdict on screen (F5), and `ROOMS.find(...)!` will crash once a filter can remove the selected room (F4) | `src/App.tsx`, `App()` | `setResult(null)` only in `check()`; `const room = ROOMS.find(r => r.id === roomId)!;` | Medium |
| 5 | A stale comment invites an AC5 regression | `src/booking.ts`, `canBook()` | the line `// keep the room's list current with the slot that was just found free` sits right before `return true` | Low |

### 3.2 Improvement plan — before editing

1. Move `Room`/`Interval` and the catalog out of App.tsx into `src/rooms.ts` and grow it to four fictional rooms with id, name, capacity, equipment, blocked and bookings (risk 2). The 22 tests stay green; `tsc` forces every field.
2. Add `checkRoom(rooms, roomId, { start, end, now })` to `src/booking.ts`, calling the unchanged `canBook` with the chosen room's own `blocked` and `bookings`; write the F3, F5 and unknown-id tests first (risk 1).
3. Add `filterRooms(rooms, { attendees, equipment })` in `src/filter.ts`, tests first: F1 with the B5/B6 capacity boundaries, then F2 (ALL items), then the empty result behind F4.
4. Rewire the page: remove the global blocked checkbox, build the room list from `filterRooms`, show an empty state, derive the verdict from `checkRoom` for the selected room so a room change refreshes it (risks 1, 3, 4, F4, F5).
5. Move `toMinutes()`/`fmt()` into a small `src/time.ts`, return early on the reversed-interval error, delete the stale comment (risks 3, 5); add the INT test (`filterRooms` then `checkRoom`) and add B1–B4 to the titles of the existing boundary tests.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| "If you want automated F4/F5 UI tests, add `jsdom` and `@testing-library/react` as devDependencies" and "Clear `result` (and `error`) whenever roomId, a filter or a time input changes" | Modified | No new dependencies (constraints in §5 of the README, `package.json`): F4 is proved on `filterRooms` (empty array) and F5 on `checkRoom` with two rooms, both pure. Instead of clearing the result on a room change I derive it from `checkRoom` for the currently selected room after the first check, so F5 "refresh" shows the new room's verdict (screenshots `switch-a.png`/`switch-b.png`) instead of an empty result. |
## 4. Feature extension (Task 2)

### 4.1 What I added

- **Catalog** (`src/rooms.ts`): four fictional rooms. Room A-101 (12 seats; projector, whiteboard; booked 10:00–11:00), Room B-204 (30; projector, whiteboard, video-call; free), Lab C-310 (20; computers, projector; booked 11:00–13:00) and Seminar D-012 (8; whiteboard; **blocked**). The equipment vocabulary is `EQUIPMENT = projector, whiteboard, computers, video-call`.
- **Filter on the page**: an "Attendees" number field and one checkbox per equipment item, in a "What do you need?" box. The room select lists only `filterRooms(ROOMS, …)` and shows "N of 4 rooms match." Blocked rooms stay listed with "· blocked" in their name.
- **Empty state (F4)**: when nothing matches, the room form is replaced by "No room fits 50 attendees with projector. Lower the number of attendees or remove an equipment item."
- **Room change (F5)**: after the first "Check availability", the verdict is derived from `checkRoom(ROOMS, room.id, …)` on every render. Switching rooms therefore shows the new room's own result at once ("Room B-204: Available"). If a filter removes the selected room, the selection falls back to the first match, so no old room or stale result can stay on screen.
- The global "Room blocked" checkbox is gone. A room's own `blocked` flag decides (F3), and the result reads "Unavailable (room is blocked)".

### 4.2 Demonstration

All five were taken in the Claude desktop app's built-in browser (1280 × 800 desktop, 375 × 812 phone). They are JPEG files named as the brief asks.

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.jpg` | Attendees 15 and projector ticked: "2 of 4 rooms match.", and the select offers only Room B-204 (30 seats) and Lab C-310 (20 seats). A-101 (12) and D-012 (8, no projector) are gone |
| `evidence/filter-empty.jpg` | Attendees 50 and projector: the F4 empty state "No room fits 50 attendees with projector. Lower the number of attendees or remove an equipment item." and no room form |
| `evidence/switch-a.jpg` | No filter, Room A-101 selected, now 09:00, 10:30–11:30, after Check: "Room A-101: Unavailable" (its booking 10:00–11:00 overlaps) |
| `evidence/switch-b.jpg` | The same times, Room B-204 selected: "Room B-204: Available" (no bookings). The result changed with the room, without pressing Check again (F5) |
| `evidence/narrow.jpg` | 375 × 812 portrait: Seminar D-012 selected, the fields stacked, "Seminar D-012: Unavailable (room is blocked)" (F3, AC6), no horizontal scroll |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | data only: the `Interval` and `Room` types, `EQUIPMENT` and the four fictional `ROOMS`; no logic |
| `src/booking.ts` | the availability rules: `canBook` (AC1–AC5, unchanged from week-08) and `checkRoom(rooms, roomId, request)`, which finds the room and calls `canBook` with that room's own `blocked` and `bookings` |
| `src/filter.ts` | the filter rule: `filterRooms(rooms, { attendees, equipment })`, with capacity ≥ attendees (F1) and every selected item present (F2); returns a new array |
| `src/time.ts` | form helpers for the page: `toMinutes`, `fmt` and `readTimes`, which turns the four inputs into minutes or into one of the two input messages |
| `src/App.tsx` | the UI: form state, the filter box, the room select, the empty state, the verdict and the booking list. It imports every rule and holds no data or rule of its own |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a "· blocked" label, and `checkRoom` reports them Unavailable | hide blocked rooms inside `filterRooms` | F1/F2 define the filter as capacity and equipment only. Hiding would mix a third rule into `filterRooms`, and the user would not see why a big room is missing. F3 is still guaranteed by `checkRoom` (tests `F3 AC3` and `INT F3`) |
| The verdict is derived from `checkRoom` for the currently selected room on every render after the first check | keep `result` in state and clear it whenever the room or a filter changes (the assistant's step 9) | F5 asks for the result to be refreshed. Clearing would leave an empty result; deriving shows the right one and can never be stale (screenshots `switch-a`/`switch-b`). It also removes the `setResult`/`setError` bookkeeping that caused risk 3 |
| `checkRoom` returns `false` for an unknown room id | throw an error | it keeps the same boolean contract as `canBook`, and the page can never pass an id outside the filtered list. Test "an unknown room id is not available" |
| No new dependencies; F4 and F5 are proved on the pure functions | add `jsdom` and `@testing-library/react` for UI tests (assistant step 11) | the constraint asks for no new dependencies unless justified; the rule behind each requirement is pure and tested, and the UI was checked by hand (§4.2) |

### 5.3 Duplication removed

I searched every file under `app/src` for repeated time parsing, rule checks, room data and list rendering, comparing `git show c2f9e71:sis-04/app/src/App.tsx` with the final files.

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx`: two sources for "is this room blocked": the `blocked` field in `ROOMS` and the separate `blocked` checkbox state, which was the one passed to `canBook` | one source, `room.blocked` in `src/rooms.ts`, read only by `checkRoom` in `src/booking.ts`; the checkbox state is deleted |

## 6. Automated tests (Task 4)

### 6.1 Test plan

All catalog tests use a fixed four-room catalog inside the test file (`r-small` 6 seats with whiteboard, booked 600–660; `r-mid` 10 seats with projector and whiteboard, free; `r-lab` 20 seats with projector and computers, booked 630–690; `r-closed` 40 seats with all three items, blocked), never the page's `ROOMS`. Now is 540 (09:00).

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1: a request that starts before now is rejected through checkRoom` | r-mid, 500–560, now 540 → `false` (also T02–T05, X1, X2, PAST in booking.test.ts) |
| AC2 | `AC2 B1: exactly 120 minutes in a free room is available through checkRoom` | r-mid 720–840 → `true`; `AC2 B2` 720–841 → `false` |
| AC3 | `F3 AC3: a blocked room with no bookings is never available` | r-closed 900–960 → `false` (also T13) |
| AC4 | `B4 AC4: overlapping the chosen room's booking by one minute is rejected` | r-lab 689–750 → `false`; touching cases in B3 → `true` |
| AC5 | `AC5: checkRoom leaves the catalog and every room's bookings unchanged` | two checks, then the catalog `toEqual` its `structuredClone` |
| F1 | `F1: only rooms with capacity >= 15 attendees remain` | attendees 15, no equipment → `['r-lab', 'r-closed']` |
| F2 | `F2: a room must have ALL selected items; projector + whiteboard leaves only rooms with both` | → `['r-mid', 'r-closed']`; projector + computers → `['r-lab', 'r-closed']`; video-call → `[]` |
| F3 | `F3 AC3: a blocked room with no bookings is never available` | r-closed, a time free in every room → `false` |
| F4 | `F4: a filter no room satisfies returns an empty list (the page shows the empty state)` | attendees 50 → `[]` |
| F5 | `F5: the same times give different results for two rooms, from each room's own bookings` | 600–660: r-small → `false`, r-mid → `true` |
| B1 | `AC2 B1: exactly 120 minutes in a free room is available through checkRoom` | 720–840 → `true` |
| B2 | `AC2 B2: 121 minutes in a free room is rejected through checkRoom` | 720–841 → `false` |
| B3 | `B3 AC4: touching the chosen room's booking at its end is available` | r-lab 690–750 → `true`; also 570–630 → `true` |
| B4 | `B4 AC4: overlapping the chosen room's booking by one minute is rejected` | r-lab 689–750 → `false` |
| B5 | `B5 F1: capacity exactly equal to attendees (10) includes the room` | attendees 10 → `['r-mid', 'r-lab', 'r-closed']` |
| B6 | `B6 F1: capacity one below attendees (11 vs 10) excludes the room` | attendees 11 → `['r-lab', 'r-closed']` |
| INT | `INT F3: filterRooms then checkRoom on each match - the blocked match is never available` | attendees 8 + projector → `['r-mid', 'r-lab', 'r-closed']`; 600–660 on each → `[true, false, false]` |

### 6.2 Commands

```text
cd sis-04/app
npm install
npx vitest run
npx tsc --noEmit
npm run build
npm run dev
```

### 6.3 Final run

The real output of the full run on the final code (only the absolute path shortened to `.../`):

```text
RUN  v3.2.4 .../se-practice/sis-04/app

 ✓ src/catalog.test.ts (10 tests) 4ms
 ✓ src/booking.test.ts (22 tests) 8ms
 ✓ src/filter.test.ts (9 tests) 5ms

 Test Files  3 passed (3)
      Tests  41 passed (41)
   Start at  18:26:54
   Duration  790ms (transform 82ms, setup 0ms, collect 152ms, tests 17ms, environment 1ms, prepare 907ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 22/22 | 41/41 | the `Tests` line of the runs in §1.1 and §6.3 (`npx vitest run` in `app/`) |
| Duplicated logic locations removed | 0 | 1 | counted in §5.3 (the two sources for `blocked`), by comparing `git show c2f9e71:sis-04/app/src/App.tsx` with the final `src/` |
| Code structure: modules and their responsibilities | 2 logic files: `App.tsx` (data + time parsing + validation + UI), `booking.ts` (`canBook`) | 5: `rooms.ts` (data), `booking.ts` (`canBook`, `checkRoom`), `filter.ts` (`filterRooms`), `time.ts` (form helpers), `App.tsx` (UI only) | `git ls-files app/src` at `c2f9e71` and at the final commit, read against §5.1 |
| Remaining limitation | no test reached the page at all | F4 (the empty-state message) and F5 (the refresh on room change) are tested only through the pure functions; no test renders `App.tsx`, as the AI test review in §8.3 pointed out | §8.3 review and the list of test files (`booking`, `catalog`, `filter`; none renders) |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Claude Code, read-only Plan subagent, claude-opus-5-5
**Date:** 2026-11-22
**Purpose:** codebase analysis (Task 1): maintainability risks in the starting code

**Prompt:**

```text
The context message of §2.2, exactly as sent (one message; its answer is used in 8.1 and 8.2).
```

**Output used:**

```text
**R1. The room's own `blocked` field is ignored; a global UI checkbox decides instead.** […]
- `check()` line 49 passes `blocked` (that UI state) to `canBook`, not `room.blocked`. […]
**R2. Room data, types and time rules all live inside the UI file.** […]
**R3. `check()` reports a validation error and still runs the rule.** […]
**R4. The result goes stale on input or room change, and a forced room lookup can crash.** […]
- Line 32: `ROOMS.find(r => r.id === roomId)!` uses a non-null assertion. Once filtering can remove
  the selected room from the list (or the list is empty, F4), `room` becomes `undefined`. […]
**R5. Comments invite a regression of AC5.** […]
```

**Problems found:** its line numbers were approximate, and some of its points (R6, array-index keys) were not maintainability risks of the starting code. It counted the 1440/120 "magic numbers" as part of R2, but those sit inside `canBook`, which must stay unchanged.
**Changes made:** kept five risks for §3.1, each re-checked in `git show c2f9e71:sis-04/app/src/App.tsx` and `booking.ts`; dropped the magic-number point because `canBook` stays as it is.
**Verified by:** reading the baseline files at commit `c2f9e71`; risk 3 also by the page (an error and a verdict were never shown together after the change, `switch-a.jpg`); risk 1 by the test `F3 AC3`.

### 8.2 Exchange 2

**Tool and model:** Claude Code, read-only Plan subagent, claude-opus-5-5
**Date:** 2026-11-22
**Purpose:** the improvement plan (second half of the same answer as 8.1)

**Prompt:**

```text
The same context message of §2.2; the part that asks for the plan:
"(2) a numbered plan of small, safe steps (smallest first), each step keeping the 22 existing tests
green, and saying which test to write first for each new rule. I want a plan, not a full rewrite,
and no code yet."
```

**Output used:**

```text
**Step 2. Move the data out of the UI unchanged (R2).** […]
**Step 4. Add `checkRoom(rooms, roomId, { start, end, now })` to `src/booking.ts`.** […]
- Write first: "checkRoom uses the chosen room's own bookings". […]
**Step 7. Add `filterRooms` to `src/filter.ts`, capacity first (F1).** […]
- Write first: "F1 a room whose capacity equals attendees is included". […]
**Step 8. Equipment filter (F2).** […] I recommend keeping blocked rooms listed (marked "blocked")
and letting checkRoom reject them (F3). […]
**Step 9.** […] Clear `result` (and `error`) whenever roomId, a filter or a time input changes […]
**Step 11 (optional, needs justification).** If you want automated F4/F5 UI tests, add `jsdom` and
`@testing-library/react` as devDependencies only […]
```

**Problems found:** step 9's "clear the result on a room change" would leave F5 with no result instead of a refreshed one. Step 11 adds two dependencies. Its step 2 extra `rooms.test.ts` for data invariants was more than the brief needs.
**Changes made:** used steps 2, 4, 7 and 8 in that order, merged into five commits; replaced step 9 with a derived verdict (§5.2); rejected step 11 (§3.3); skipped the data-invariant test.
**Verified by:** the red runs before each rule (`evidence/red-checkRoom.txt`: 9 failed; `evidence/red-filter.txt`: cannot find `./filter`), then green runs after each commit; F5 by `switch-a.jpg` and `switch-b.jpg`.

### 8.3 Exchange 3

**Tool and model:** Claude Code, read-only Explore subagent, claude-opus-5-5
**Date:** 2026-11-22
**Purpose:** test review (Task 4): are the expected values derived from F1–F5 and B1–B6, and would the tests catch typical mistakes?

**Prompt:**

```text
Project folder: <project>\sis04\sis-04\app (ignore node_modules and dist). Do not edit any file.

Review the tests in src/catalog.test.ts and src/filter.test.ts against these rules, and the code in
src/filter.ts and src/booking.ts (checkRoom):
F1 … F5, AC4, AC2, AC5 (as in §5 of the README) and the boundaries B1–B6.
For each test: is the expected value derived from the rule (not from the code's output)? Would it
fail if filterRooms used equipment.some() instead of every(), or capacity > instead of >=, or if
checkRoom used the first room's bookings instead of the chosen room's? List any missing case or weak
assertion, and say what you are unsure about. Do not claim you ran the tests.
```

**Output used:**

```text
**B6** only checks `not.toContain('r-mid')`. It would pass if `filterRooms` returned `[]` […]
It should assert the full list, `['r-lab', 'r-closed']`.
**B5** only checks `toContain`. […] It should assert `['r-mid', 'r-lab', 'r-closed']`.
**F3 test:** the request 600–660 overlaps r-small's booking. […] The test should use a time that is
free in every room, such as 900–960.
**Unknown-id test:** […] should use a time when r-small is free, such as 900–960.
**B3** only checks touching at the end of a booking. Touching at the start is never tested through
`checkRoom`, for example r-lab 570–630, which should be true. […]
**F2 extras:** no test […] with an item no room has, such as video-call in this catalog.
**F4** only checks that the pure function returns `[]`. No test renders `App.tsx` […]
```

**Problems found:** none of its claims were wrong when I checked them against the files. It could not run the tests, so its "would fail / would pass" table was reasoning, not a result.
**Changes made:** B5 and B6 now assert the full lists, F3 and the unknown-id test use 900–960, and I added a touching-at-the-start B3 case and an F2 "video-call → []" case (commit "tighten B5/B6/F3 assertions…"). The F4/F5 UI-test gap is kept as the remaining limitation in §7.
**Verified by:** the final run in §6.3 (41 passed); each new expected value was worked out from F1/F2 and the fixed catalog before running.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| none | the last run of `python tests/check_sis.py` was made in a clean checkout of the branch (without the local `node_modules/`) |

## 10. AI reflection (Task 6)

*Draft written by the Claude Code agent from what happened in this session. The brief asks for the student's own words, so the student must review and rewrite it before grading.*

The assistant received one context message: a six-line repository map, AC1–AC6, F1–F5, the fixed target layout and the constraints, with an explicit request for risks and a step plan and no code. The most useful output was the observation that `App.tsx` passed the checkbox state `blocked` to `canBook` and never read `room.blocked`. That single line made F3 impossible per room and decided the shape of `checkRoom`. Its plan was useful in order (data first, then `checkRoom`, then `filterRooms`), but two suggestions were not taken. Clearing the result on every room change would have satisfied "no stale result" while failing the F5 wording "refresh", so the verdict is derived from `checkRoom` instead. Adding jsdom and testing-library would have broken the no-new-dependencies constraint. Each risk was re-read at the baseline commit, each rule got a test that was seen failing first (9 failures before `checkRoom`, a missing module before `filterRooms`), and the five screenshots were taken from the running page. Tests changed decisions twice. The F5 test with two rooms and the same times forced `checkRoom` to take the catalog and an id rather than a room object. The test review then showed that B5 and B6 used `toContain`, which an empty result could pass, so they now assert the full expected lists derived from F1. Next I would add one rendered test for the empty state and the room switch, because F4 and F5 are still proven only on the pure functions.
