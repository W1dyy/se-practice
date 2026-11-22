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

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
