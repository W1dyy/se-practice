# Week 08 — Lab report

**Name:** Bakhytzhan Amir
**Group:** MON 16:00-19:00
**Date:** 2026-11-08

**Authorship:** Prepared by Codex. Student manual skill typing, personal review and independent conclusion remain pending.

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Codex desktop; two independent subagents with no parent chat history |
| Exact model | not displayed; both agents inherited the same parent model without an override |
| Where the skill was installed | prompt-only simulation; procedure supplied to the skill agent, no installed skill claimed |
| Where I ran the tests | Local Windows computer via Codex terminal; Node 24.14.1 |
| Vitest version | 3.2.4 |
| Language of my booking module | ts |

Week 07 source: branch week-07, commit 5530143068cadaf4587f3ba86d972a497757be9d, app/ copied without changes. Week 07 itself was completed during this session from the documented starter fallback. Actual test invocations used `node <repo>/node_modules/vitest/vitest.mjs run --reporter=verbose` from app/, equivalent to `npx vitest run --reporter=verbose`. Targeted runs additionally use `-t BUG-A` or `-t BUG-B`; their skipped counts result from filtering, not skipped tests in the source.


## 2. Task 1 — baseline, buggy code, failing tests



### 2.1 My Week 07 suite on my own code


```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 2ms
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 ✓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 0ms
 ✓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one. 0ms
 ✓ src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time. 0ms
 ✓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660. 0ms
 ✓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking. 0ms
 ✓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval. 0ms
 ✓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration. 0ms
 ✓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 0ms
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 1ms
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 ✓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 0ms
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  22:29:18
   Duration  1.50s (transform 172ms, setup 0ms, collect 172ms, tests 9ms, environment 0ms, prepare 578ms)
```


### 2.2 The same suite on the provided canBook


```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 × src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 14ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 ✓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 0ms
 ✓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one. 0ms
 × src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time. 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660. 0ms
 ✓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking. 0ms
 ✓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval. 0ms
 ✓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration. 0ms
 ✓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 0ms
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 × src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 × src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 4ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:7:59
      5| 
      6| test('T01 AC4: The existing interval ends at 660, so no occupied minut…
      7|   expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
       |                                                           ^
      8| });
      9| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:35:59
     33| 
     34| test('T08 AC4: The request ends where the existing booking starts, sha…
     35|   expect(canBook({ ...fixture(), start: 570, end: 600 })).toBe(true);
       |                                                           ^
     36| });
     37| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > AC5: an Available decision leaves booking data unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:73:64
     71|   const { bookings, ...rest } = fixture();
     72|   const before = structuredClone(bookings);
     73|   expect(canBook({ ...rest, start: 660, end: 720, bookings })).toBe(tr…
       |                                                                ^
     74|   expect(bookings).toEqual(before);
     75| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:86:20
     84|   const request = { ...rest, start: 720, end: 780, bookings };
     85|   expect(canBook(request)).toBe(true);
     86|   expect(bookings).toEqual(before);
       |                    ^
     87|   expect(canBook(request)).toBe(true);
     88|   expect(bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 16 passed (20)
   Start at  22:29:25
   Duration  1.26s (transform 84ms, setup 0ms, collect 104ms, tests 24ms, environment 0ms, prepare 474ms)
```


### 2.3 One failing test per bug


```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 × src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 14ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 ✓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 0ms
 ✓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one. 0ms
 × src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time. 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660. 0ms
 ✓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking. 0ms
 ✓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval. 0ms
 ✓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration. 0ms
 ✓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 0ms
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 × src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 × src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 4ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 1ms
 × src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides 1ms
   → expected false to be true // Object.is equality
 × src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings 1ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:7:59
      5| 
      6| test('T01 AC4: The existing interval ends at 660, so no occupied minut…
      7|   expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
       |                                                           ^
      8| });
      9| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:35:59
     33| 
     34| test('T08 AC4: The request ends where the existing booking starts, sha…
     35|   expect(canBook({ ...fixture(), start: 570, end: 600 })).toBe(true);
       |                                                           ^
     36| });
     37| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  src/booking.test.ts > AC5: an Available decision leaves booking data unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:73:64
     71|   const { bookings, ...rest } = fixture();
     72|   const before = structuredClone(bookings);
     73|   expect(canBook({ ...rest, start: 660, end: 720, bookings })).toBe(tr…
       |                                                                ^
     74|   expect(bookings).toEqual(before);
     75| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:86:20
     84|   const request = { ...rest, start: 720, end: 780, bookings };
     85|   expect(canBook(request)).toBe(true);
     86|   expect(bookings).toEqual(before);
       |                    ^
     87|   expect(canBook(request)).toBe(true);
     88|   expect(bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:100:81
     98| test('BUG-A AC4: a free gap may touch bookings on both sides', () => {
     99|   const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }…
    100|   expect(canBook({ start: 660, end: 720, now: 540, blocked: false, boo…
       |                                                                                 ^
    101| });
    102| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:107:20
    105|   const before = structuredClone(bookings);
    106|   expect(canBook({ start: 720, end: 780, now: 540, blocked: false, boo…
    107|   expect(bookings).toEqual(before);
       |                    ^
    108| });
    109| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed | 16 passed (22)
   Start at  22:30:03
   Duration  1.34s (transform 75ms, setup 0ms, collect 86ms, tests 26ms, environment 0ms, prepare 448ms)
```


## 3. Defect log

Hypotheses were recorded by Codex in evidence/pre-diagnosis.md before either independent agent was asked. They are not represented as the student's unaided hypotheses. Line numbers refer to app/src/booking.ts before fixes.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01, T08, BUG-A | 660-720 with 600-660; BUG-A adds a second booking 720-780; now 540, unblocked | true | false | Line 13 uses inclusive <= and >=, treating equal endpoints as occupied intersections, contrary to AC4 |
| BUG-B | REPEAT, BUG-B | 720-780 with bookings [{start:600,end:660}], now 540, unblocked | true and original array unchanged | true but {start:720,end:780} appended | Line 16 bookings.push mutates the caller's array on success, contrary to AC5 |

The original AC5 test used 660-720 and failed at toBe(true), before comparing data. REPEAT and BUG-B touch nothing, so they reach the mutation independently. After fixing BUG-A, AC5 still fails but now at data comparison: its failure reason changes.


## 4. Tasks 2–3 — the skill

| Check | yes / no |
| --- | --- |
| Plain UTF-8, named exactly SKILL.md, not SKILL.md.txt | yes |
| Opening and closing YAML delimiters are exactly --- | yes |
| Name is lowercase with hyphens and description says WHEN | yes |
| Whole file reviewed by Codex: no passwords, API keys or private student data | yes |

The file was copied by Codex from the supplied deck text, NOT typed by the student. This is an explicitly disclosed incomplete manual requirement.

ZIP listing (actual contents):

```text
bug-detector/SKILL.md
```
Installation: prompt-only simulation. No ChatGPT/Claude installation interface was available to this agent. A fresh subagent read the complete skill text before the skill prompt and explicitly acknowledged applying it. The plain arm read only its question and shared case input. Neither could inspect other project files or execute code. This is not an installed skill or a skill-trigger badge. There is no genuine screenshot of an installation or simulation UI, so E1 is declared ERROR rather than supplying a reconstructed image. The actual skill response and prompt are committed as text evidence.

The generic skill-creator quick_validate script could not start because PyYAML was absent; installing it failed while building a wheel in the local environment. The course's independent K1-K7 checks validate the actual skill and ZIP. No generic-validator success is claimed.


## 5. Task 4 — without the skill

Fresh independent agent /root/plain_diagnosis, no inherited conversation and no bug-detector procedure. The wrapper restricted reading to plain-prompt.txt and prohibited edits, execution or consulting other agents. Exact task and case input read by the agent:

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Scenario: Smart Campus room availability. Continue the Smart Campus project from Practice #06 and the tests from Practice #07.
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.
Use one room, fictional bookings, fixed time, and a Boolean availability decision. No login or database.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Default fixture for the supplied failure: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]. T01 request: 660-720.

Observed failure (unedited excerpt from buggy-run.txt):
 FAIL  src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:7:59
      5| 
      6| test('T01 AC4: The existing interval ends at 660, so no occupied minut…
      7|   expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
       |                                                           ^
      8| });
      9| 


Provided code:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```
Assistant final answer, unedited (also evidence/plain-answer.md). Four-backtick fencing preserves the response's own code fences:

````text
The failed T01 is caused by inclusive overlap comparisons:

```ts
if (start <= b.end && end >= b.start) return false;
```

For request `660–720` and booking `600–660`, both comparisons are true, so the function rejects two intervals that only touch. All earlier guards pass. AC4 requires endpoint touching to be allowed.

The minimal fix for T01 is to use strict comparisons, treating intervals as half-open `[start, end)`:

```ts
if (start < b.end && end > b.start) return false;
```

The supplied code also contains two separate acceptance-criteria defects:

- `start > now` rejects a request beginning exactly now, although AC1 rejects requests **in the past**. Use `start >= now`.
- `bookings.push(...)` changes booking data when availability succeeds, violating AC5. Remove it.

The proposed patch addressing all three defects is:

```diff
-  if (!(start > now)) return false;
+  if (!(start >= now)) return false;
...
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
...
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
```

Keep the existing T01 as the direct regression test. Add the opposite touching boundary and genuine overlaps to ensure the fix does not permit occupied time:

```ts
test.each([
  [660, 720, true],  // touches existing booking's end: T01
  [570, 600, true],  // touches existing booking's start
  [659, 720, false], // overlaps by one minute
  [570, 601, false], // overlaps by one minute
  [600, 660, false], // identical interval
])('AC4: %i–%i returns %s', (start, end, expected) => {
  expect(canBook({ ...fixture(), start, end })).toBe(expected);
});

test('AC1: allows starting now and rejects starting in the past', () => {
  expect(canBook({ ...fixture(), start: 540, end: 570 })).toBe(true);
  expect(canBook({ ...fixture(), start: 539, end: 570 })).toBe(false);
});

test('AC5: an available request does not change booking data', () => {
  const input = { ...fixture(), start: 720, end: 780 };
  const before = input.bookings.map(b => ({ ...b }));

  expect(canBook(input)).toBe(true);
  expect(input.bookings).toEqual(before);
  expect(canBook(input)).toBe(true);
});
```

These tests assume `fixture()` supplies the stated default fixture with fresh booking data. AC6 cannot be assessed from the supplied function and failure excerpt.

No code was edited and no tests were run; this diagnosis is based only on the supplied evidence.
````


## 6. Task 5 — with the skill

Fresh independent agent /root/skill_diagnosis, no inherited conversation. Its first instruction declared prompt-only simulation and supplied skills/bug-detector/SKILL.md as the procedure; then it read skill-prompt.txt. The same restrictions on other files, execution, edits and agents applied. Exact task and case input:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Scenario: Smart Campus room availability. Continue the Smart Campus project from Practice #06 and the tests from Practice #07.
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.
Use one room, fictional bookings, fixed time, and a Boolean availability decision. No login or database.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Default fixture for the supplied failure: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]. T01 request: 660-720.

Observed failure (unedited excerpt from buggy-run.txt):
 FAIL  src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:7:59
      5| 
      6| test('T01 AC4: The existing interval ends at 660, so no occupied minut…
      7|   expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
       |                                                           ^
      8| });
      9| 


Provided code:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```
Assistant final answer, unedited (also evidence/skill-answer.md):

```text
I applied **bug-detector as a prompt-only simulation**, using only the supplied procedure and evidence. I did not run code or tests or edit files.

The supplied failure confirms that endpoint-touching bookings are incorrectly rejected.

| Defect | Evidence | Root cause | Minimal fix | Regression test and expected result |
|---|---|---|---|---|
| **Confirmed: AC4 endpoint handling** | T01 expects `true` for request `660–720` with existing booking `600–660`, but receives `false`. | `start <= b.end && end >= b.start` treats shared endpoints as overlap. | Use `start < b.end && end > b.start`. | With `now=540`, an unblocked room, and booking `600–660`: `660–720` → `true`; `540–600` with `now=500` → `true`; `650–700` → `false`. |
| **Confirmed by inspection: AC5 mutation** | The successful path executes `bookings.push({ start, end })`. | Checking availability also creates a booking. | Remove the `push`. | Request `700–760` with the default fixture → `true`; bookings must remain deeply equal to their original value. Repeating the check must still return `true`. |
| **AC1 mismatch under its stated wording** | `if (!(start > now)) return false` rejects `start === now`, although AC1 rejects requests *in the past*. | Strict comparison also excludes the present. | Use `if (start < now) return false`, unless an additional requirement explicitly prohibits starting now. | With `now=540`, unblocked room, and no bookings: `540–600` → `true`; `539–599` → `false`. |

For the smallest deterministic reproduction of T01, use the supplied fixture unchanged. The request passes the time, duration, and blocked-room guards. At the overlap condition, `660 <= 660` and `720 >= 600` are both true, so the function returns `false`. This is a manual trace, not an executed reproduction.

The duration and blocked-room guards appear consistent with AC2 and AC3. No UI evidence was supplied, so AC6 and the display of “Available / Unavailable” cannot be assessed.
```
Skill invoked: yes as a prompt-only procedure, explicitly acknowledged in the answer; no installed-skill badge. Identical shared input SHA-256: 84c9830ef7119fa287b4b1942b58bf1d7a10827989bb7223ff8cd07f3ab0346d. Only the question differs between prompt files; the procedure is separate context.


## 7. Comparison — judged against the actual code

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correct BUG-A inclusive overlap and BUG-B push; also calls start==now rejection a defect | Same two real defects; qualifies the extra start==now suggestion by the wording of AC1 |
| Reproducible test | Concrete touching, overlap and non-mutation cases; uses test.each, not permitted for the lab's submitted suite | Concrete touching and overlap inputs plus a non-touching mutation/repeat case; expected values stated |
| Minimal proposed patch | The full proposed patch is too broad: changes now guard and deletes a comment; accept only strict overlap and removing push | The two target changes are minimal, but reject the optional now-guard change against Week 07 T02 |
| Unsupported claims | Overstates a third defect from abbreviated AC1; explicitly admits no code execution | Separates failure evidence, inspection and manual trace; still suggests a boundary change not justified by the full Week 07 contract |
| Clarity of explanation | Clear half-open interval explanation and runnable-looking snippets, but scope expands | Evidence/root-cause/fix/test table makes confidence and scope easier to audit |

Both answers found BUG-A and BUG-B. Verdict: the skill helped clarity and qualification, not the number of genuine defects discovered. Both agents received the exact Week 08 repair-contract wording, whose abbreviated AC1 says requests in the past; the full Week 07 AC1 explicitly says start is after now. T02 requires false at 540-570 with now 540. The full contract therefore rejects both suggested relaxations. No correct expectation was changed. The skill cannot supply context that was not in either input.


## 8. Task 6 — repair and regression

Codex reviewed both responses in evidence/patch-review.md before making either change. Student personal review remains pending. Each fix changes or deletes one production-code line in its own commit.


### 8.1 The BUG-A patch


```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index d0032d1..738d90f 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -10,7 +10,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });
```
Targeted regression run:

```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 ↓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
 ↓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later.
 ↓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval.
 ↓ src/booking.test.ts > T04 AC1: The end precedes the start.
 ↓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary.
 ↓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted.
 ↓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one.
 ↓ src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time.
 ↓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660.
 ↓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking.
 ↓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval.
 ↓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration.
 ↓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request.
 ↓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap.
 ↓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60.
 ↓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier.
 ↓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged
 ↓ src/booking.test.ts > PAST AC1: start before now is rejected
 ↓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable
 ↓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data
 ✓ src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides 2ms
 ↓ src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings

 Test Files  1 passed (1)
      Tests  1 passed | 21 skipped (22)
   Start at  22:32:31
   Duration  1.28s (transform 78ms, setup 0ms, collect 88ms, tests 4ms, environment 0ms, prepare 484ms)
```
Full suite after BUG-A, before BUG-B (three mutation failures remain):

```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 2ms
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 ✓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 0ms
 ✓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one. 0ms
 ✓ src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time. 0ms
 ✓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660. 0ms
 ✓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking. 0ms
 ✓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval. 0ms
 ✓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration. 0ms
 ✓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 0ms
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 × src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 14ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 × src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 1ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms
 ✓ src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides 0ms
 × src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings 1ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC5: an Available decision leaves booking data unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 720,
+     "start": 660,
+   },
  ]

 ❯ src/booking.test.ts:74:20
     72|   const before = structuredClone(bookings);
     73|   expect(canBook({ ...rest, start: 660, end: 720, bookings })).toBe(tr…
     74|   expect(bookings).toEqual(before);
       |                    ^
     75| });
     76| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:86:20
     84|   const request = { ...rest, start: 720, end: 780, bookings };
     85|   expect(canBook(request)).toBe(true);
     86|   expect(bookings).toEqual(before);
       |                    ^
     87|   expect(canBook(request)).toBe(true);
     88|   expect(bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:107:20
    105|   const before = structuredClone(bookings);
    106|   expect(canBook({ start: 720, end: 780, now: 540, blocked: false, boo…
    107|   expect(bookings).toEqual(before);
       |                    ^
    108| });
    109| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 19 passed (22)
   Start at  22:32:34
   Duration  1.32s (transform 71ms, setup 0ms, collect 84ms, tests 24ms, environment 0ms, prepare 476ms)
```


### 8.2 The BUG-B patch and the final run


```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 738d90f..d034fd1 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -13,6 +13,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
     if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }
```
Targeted regression run:

```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 ↓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared.
 ↓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later.
 ↓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval.
 ↓ src/booking.test.ts > T04 AC1: The end precedes the start.
 ↓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary.
 ↓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted.
 ↓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one.
 ↓ src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time.
 ↓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660.
 ↓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking.
 ↓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval.
 ↓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration.
 ↓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request.
 ↓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap.
 ↓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60.
 ↓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier.
 ↓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged
 ↓ src/booking.test.ts > PAST AC1: start before now is rejected
 ↓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable
 ↓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data
 ↓ src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides
 ✓ src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings 3ms

 Test Files  1 passed (1)
      Tests  1 passed | 21 skipped (22)
   Start at  22:32:40
   Duration  1.25s (transform 64ms, setup 0ms, collect 83ms, tests 6ms, environment 0ms, prepare 466ms)
```
Full final run:

```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-08/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 2ms
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 ✓ src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 0ms
 ✓ src/booking.test.ts > T07 AC2: The duration is 121 minutes, exceeding the cap by one. 0ms
 ✓ src/booking.test.ts > T08 AC4: The request ends where the existing booking starts, sharing no occupied time. 0ms
 ✓ src/booking.test.ts > T09 AC4: Both occupy minutes from 630 to 660. 0ms
 ✓ src/booking.test.ts > T10 AC4: The request contains the entire existing booking. 0ms
 ✓ src/booking.test.ts > T11 AC4: The request lies inside the occupied interval. 0ms
 ✓ src/booking.test.ts > T12 AC4: Identical intervals share their entire duration. 0ms
 ✓ src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 0ms
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 1ms
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 ✓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 0ms
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms
 ✓ src/booking.test.ts > BUG-A AC4: a free gap may touch bookings on both sides 0ms
 ✓ src/booking.test.ts > BUG-B AC5: a non-touching Available request must not mutate bookings 0ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  22:32:43
   Duration  1.37s (transform 71ms, setup 0ms, collect 88ms, tests 11ms, environment 0ms, prepare 403ms)
```
The unchanged provided comment above the deleted push is now stale; it was deliberately not edited because the task requires a single-line BUG-B patch.


## 9. What still fails, and what AI-assisted debugging cannot do



### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| E1 | No genuine installation/simulation screenshot can be captured through the available agent interface. Text transcripts document the real simulation; no image was fabricated. |
| L4 | The supplied checker reads only to the first nested code fence in the unedited plain response. The complete answer is preserved with valid four-backtick Markdown fencing in section 5 and separately in evidence/plain-answer.md. |

Beyond structural checks, the skill was created by Codex rather than typed by the student. Hypotheses, review and conclusions are AI-authored and need the student's own review/work. SETUP.md was not provided and could not be found, so the PR uses five clearly named fallback sections. These limitations are disclosed rather than represented as completed manual tasks.


### 9.2 One limitation of AI-assisted debugging

Both agents proposed allowing start==now because the supplied Week 08 repair-contract wording abbreviated the stricter Week 07 rule. Reviewing the original criterion and T02 prevented an incorrect third change. The skill improved qualification but could not recover omitted context or replace an executed regression test.


## 10. Conclusion (80–150 words)

AI-authored draft for student review; not the student's independent conclusion.

The skill helped mainly with clarity: its evidence table distinguished the observed T01 failure from a mutation found by inspection, while the plain response presented an additional time-boundary issue too confidently. Both answers found the two intended bugs, and both needed review against the full Week 07 contract because their suggested start-equals-now change would contradict T02. The failing BUG-A and BUG-B tests independently exposed endpoint rejection and mutation, and the final twenty-two-test run verified the two single-line repairs without weakening existing assertions. These results support the covered cases, but they do not prove general correctness or make a structured assistant answer authoritative; the shared abbreviated criterion remained a limitation even with the skill.


