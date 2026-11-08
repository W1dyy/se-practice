# Week 07 — Lab report

**Name:** Bakhytzhan Amir
**Group:** MON 16:00-19:00
**Date:** 2026-11-08

**Authorship:** Prepared by Codex at the student's request. Personal review, manual checks and independent conclusion remain pending.

## 1. Setup

| | |
| --- | --- |
| Project I continue | starter; week-06/prototype contains only .gitkeep, no final runnable export |
| Bolt project link | not shared; using the supplied starter fallback |
| Assistant that generated the tests | Codex desktop |
| Exact model | not displayed |
| Where I ran the tests | Local Windows computer, Node 24.14.1, through Codex terminal |
| Vitest version | 3.2.4 |
| Test command | npx vitest run --reporter=verbose |

Actual captured runs used `node <repo>/node_modules/vitest/vitest.mjs run --reporter=verbose` from app/, invoking the same installed runner. Dependencies were installed in app/ and moved to the ignored repository-root node_modules so the export checker sees only source. A clean checkout can use npm ci in app/.

Process disclosure: Codex performed the implementation, plan, generation, review, browser checks and report drafting. Week 07 generation/review used this existing chat's assignment instructions, not a fresh independent student-run chat. Saved input files document the exact task text used, not a separate chat exchange. Personal review and conclusions remain student actions.


## 2. Task 1 — baseline and the booking function

| | |
| --- | --- |
| File and function | starter/src/App.tsx, check() inside the page component |
| Its inputs | s, e, n converted from the time fields; blocked; room.bookings |
| What it returned | Updated local Boolean ok and passed it to setResult |
| How the page used it | Rendered Available or Unavailable from result |

The decision moved to app/src/booking.ts as canBook with explicit start, end, now, blocked and bookings inputs. Each original guard and strict overlap condition was preserved; the function returns the Boolean previously stored in ok. App.tsx imports and calls it while retaining time conversion and validation messages. The baseline source is committed separately. Browser checks were performed after extraction; no pre-extraction browser snapshot was captured. Source comparison and the passing cases support equivalence for the specified inputs, rather than proving universal equivalence.


## 3. Task 2 — the test plan

Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh per test. Plan committed before generation. Reasons were written by Codex and require student review.

| ID | Candidate / changed input | Expected | AC | Reason (AI-authored, student review pending) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | The existing interval ends at 660, so no occupied minute is shared. |
| T02 | 540-570 | false | AC1 | Start equals the supplied current time; it must be strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints give an empty interval. |
| T04 | 750-720 | false | AC1 | The end precedes the start. |
| T05 | 1380-1441 | false | AC1 | The end exceeds the inclusive 1440 day boundary. |
| T06 | 720-840 | true | AC2 | The duration is exactly 120 minutes, which is permitted. |
| T07 | 720-841 | false | AC2 | The duration is 121 minutes, exceeding the cap by one. |
| T08 | 570-600 | true | AC4 | The request ends where the existing booking starts, sharing no occupied time. |
| T09 | 630-690 | false | AC4 | Both occupy minutes from 630 to 660. |
| T10 | 570-690 | false | AC4 | The request contains the entire existing booking. |
| T11 | 615-645 | false | AC4 | The request lies inside the occupied interval. |
| T12 | 600-660 | false | AC4 | Identical intervals share their entire duration. |
| T13 | 660-720, blocked = true | false | AC3 | The blocked flag overrides an otherwise valid touching request. |
| T14 | 630-690, bookings = [] | true | AC4 | With no existing bookings there can be no overlap. |
| X1 | 1380-1440 | true | AC1 | The end is exactly the inclusive day limit and duration is 60. |
| X2 | -1-30, now = -2, bookings = [] | false | AC1 | A negative start is outside the day even when now is earlier. |
| AC5 | 660-720, compare with a deep copy | true, data unchanged | AC5 | Checking availability must not add, remove, or modify bookings. |


## 4. Task 3 — the generation prompt and the first suite

The assignment prompt used in this Codex session (not a separate fresh chat):

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

| ID | Candidate / changed input | Expected | AC | Reason (AI-authored, student review pending) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | The existing interval ends at 660, so no occupied minute is shared. |
| T02 | 540-570 | false | AC1 | Start equals the supplied current time; it must be strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints give an empty interval. |
| T04 | 750-720 | false | AC1 | The end precedes the start. |
| T05 | 1380-1441 | false | AC1 | The end exceeds the inclusive 1440 day boundary. |
| T06 | 720-840 | true | AC2 | The duration is exactly 120 minutes, which is permitted. |
| T07 | 720-841 | false | AC2 | The duration is 121 minutes, exceeding the cap by one. |
| T08 | 570-600 | true | AC4 | The request ends where the existing booking starts, sharing no occupied time. |
| T09 | 630-690 | false | AC4 | Both occupy minutes from 630 to 660. |
| T10 | 570-690 | false | AC4 | The request contains the entire existing booking. |
| T11 | 615-645 | false | AC4 | The request lies inside the occupied interval. |
| T12 | 600-660 | false | AC4 | Identical intervals share their entire duration. |
| T13 | 660-720, blocked = true | false | AC3 | The blocked flag overrides an otherwise valid touching request. |
| T14 | 630-690, bookings = [] | true | AC4 | With no existing bookings there can be no overlap. |
| X1 | 1380-1440 | true | AC1 | The end is exactly the inclusive day limit and duration is 60. |
| X2 | -1-30, now = -2, bookings = [] | false | AC1 | A negative start is outside the day even when now is earlier. |
| AC5 | 660-720, compare with a deep copy | true, data unchanged | AC5 | Checking availability must not add, remove, or modify bookings. |

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
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
```
The assistant answer, preserved in evidence/generation-answer.txt; test code preserved unedited in suites/first/:

```text
Run command: npx vitest run
AC mapping: AC1 = T02-T05, X1, X2; AC2 = T06-T07; AC3 = T13; AC4 = T01, T08-T12, T14; AC5 = AC5.
AC6 requires browser checks; these unit tests cannot establish mobile usability or validation feedback.
Unclear requirement: acceptance criteria do not define how malformed existing bookings should be handled. The suite makes no normative assertion about those records.
Each test imports the real module, fixes time and creates a new fixture. Expected values come from the supplied case plan.
```
The first suite was saved before improvement: yes.


## 5. Task 4 — review of the first suite

Codex recorded these decisions in evidence/review-before-run.md before execution.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T01-T14, X1, X2 | No incorrect expectation found; assertions are exact, imports real | accept | AC1-AC4 and reviewed case inputs |
| 2 | Past-time coverage | Equality alone misses a guard that checks only start == now | revise | AC1; add PAST 539-570 at now 540 |
| 3 | AC5 coverage | Touching call can stop before a mutation if overlap handling breaks | revise | AC5; add non-touching repeated calls and deep comparison |
| 4 | Rejected requests | Preservation on false result is not independently checked | revise | AC5; add REJECTED with a deep-copy comparison |


## 6. Task 5 — running, diagnosing, improving



### 6.1 The first run


```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 4ms
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
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 1ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  21:57:18
   Duration  1.58s (transform 96ms, setup 0ms, collect 101ms, tests 15ms, environment 0ms, prepare 530ms)
```
| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | 17 passed, zero failed | Inputs and exact booleans match the plan | Neither | Add coverage without changing expectations |

The log was saved successfully; printing it through Python's Windows cp1251 stdout initially raised UnicodeEncodeError on a checkmark. This was a log-display issue after Vitest finished, not a failed test. UTF-8 stdout was then configured for later runs; the saved first-run log was preserved.


### 6.2 The improvement prompt

Assignment improvement prompt used with the actual output in this same session:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.


 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 4ms
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
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 1ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  21:57:18
   Duration  1.58s (transform 96ms, setup 0ms, collect 101ms, tests 15ms, environment 0ms, prepare 530ms)
```
Assistant response, saved before editing:

```text
The first run reports 17 passed and no failures; there is no failed expectation to repair and no implementation fix is justified.
Accept T01-T14, X1 and X2: their exact expected booleans match the plan and they import the real module with fresh fixtures. The AC5 comparison is valid but uses a touching request, so an overlap regression could stop it before a mutation is reached.
Add PAST for 539-570 with now 540: AC1 rejects a start strictly before now, detecting an equality-only time check. Add REPEAT for 720-780 twice on the same non-touching fixture: AC5 requires unchanged data and repeatable results, detecting an availability check that reserves a slot. Add REJECTED for an overlapping request with a deep-copy comparison: AC5 also applies when the answer is false.
These are coverage improvements, not test repairs. Keep all original expectations. AC6 remains a browser task, and malformed existing bookings remain unspecified by the criteria.
```


### 6.3 The final run


```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

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
   Start at  22:01:25
   Duration  1.34s (transform 66ms, setup 0ms, collect 79ms, tests 7ms, environment 0ms, prepare 450ms)
```


## 7. Task 6 — deliberate defects

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Not applicable; assertion failure |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Not applicable; AC5 fails at its true assertion before comparison |
| M3 | Remove the blocked-room rejection | Detected | T13 | Not applicable; assertion failure |

Each mutant was applied independently, tested against the unchanged 20-test suite, and restored in a finally block. No mutant was committed.

M1
```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

 ✓ src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 3ms
 ✓ src/booking.test.ts > T02 AC1: Start equals the supplied current time; it must be strictly later. 0ms
 ✓ src/booking.test.ts > T03 AC1: Equal endpoints give an empty interval. 0ms
 ✓ src/booking.test.ts > T04 AC1: The end precedes the start. 0ms
 ✓ src/booking.test.ts > T05 AC1: The end exceeds the inclusive 1440 day boundary. 0ms
 × src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted. 13ms
   → expected false to be true // Object.is equality
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
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 0ms
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 ✓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 0ms
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T06 AC2: The duration is exactly 120 minutes, which is permitted.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:27:59
     25| 
     26| test('T06 AC2: The duration is exactly 120 minutes, which is permitted…
     27|   expect(canBook({ ...fixture(), start: 720, end: 840 })).toBe(true);
       |                                                           ^
     28| });
     29| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  22:01:15
   Duration  1.35s (transform 61ms, setup 0ms, collect 68ms, tests 22ms, environment 0ms, prepare 514ms)
```

M2
```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

 × src/booking.test.ts > T01 AC4: The existing interval ends at 660, so no occupied minute is shared. 16ms
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
 ✓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 1ms
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 17 passed (20)
   Start at  22:01:18
   Duration  1.42s (transform 88ms, setup 0ms, collect 109ms, tests 24ms, environment 0ms, prepare 515ms)
```

M3
```text

 RUN  v3.2.4 C:/Users/s8776/Documents/Codex/2026-11-01/instructions-sis-03-ai-assisted-coding/work/se-practice/week-07/app

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
 × src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request. 13ms
   → expected true to be false // Object.is equality
 ✓ src/booking.test.ts > T14 AC4: With no existing bookings there can be no overlap. 0ms
 ✓ src/booking.test.ts > X1 AC1: The end is exactly the inclusive day limit and duration is 60. 0ms
 ✓ src/booking.test.ts > X2 AC1: A negative start is outside the day even when now is earlier. 0ms
 ✓ src/booking.test.ts > AC5: an Available decision leaves booking data unchanged 1ms
 ✓ src/booking.test.ts > PAST AC1: start before now is rejected 0ms
 ✓ src/booking.test.ts > REPEAT AC5: non-touching checks are pure and repeatable 0ms
 ✓ src/booking.test.ts > REJECTED AC5: an overlapping request preserves data 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T13 AC3: The blocked flag overrides an otherwise valid touching request.
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:55:74
     53| 
     54| test('T13 AC3: The blocked flag overrides an otherwise valid touching …
     55|   expect(canBook({ ...fixture(), start: 660, end: 720, blocked: true }…
       |                                                                          ^
     56| });
     57| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  22:01:21
   Duration  1.29s (transform 72ms, setup 0ms, collect 91ms, tests 20ms, environment 0ms, prepare 445ms)
```

All three changes reverted and final suite rerun: yes.


## 8. Task 7 — manual UI checks

These were actual browser interactions automated by Codex with Playwright and installed Chrome, not manual student checks. The phone screenshot was visually inspected. Student manual verification remains pending.

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00-12:00, unblocked | Available, fixed sample booking | AC5 | Available; 10:00-11:00 remained visible | Pass |
| U2 | Enable blocked, check again | Unavailable replaces result | AC3, AC5 | Unavailable replaced Available | Pass |
| U3 | Clear Start and submit | Validation feedback | AC6 | Fill in the current time, the start and the end; stale result removed | Pass |
| U4 | Set viewport to 375x812 | Controls and result usable | AC6 | No horizontal overflow; controls and Available visible | Pass |
| U5 | Check 12:00-13:00 three times | Data unchanged | AC5 | All Available; list text identical before and after | Pass |

Real captures: evidence/ui-1.png through ui-5.png. Edge could not launch in the execution environment; installed Chrome worked. No screenshots were fabricated.


## 9. Comparison and what still fails



### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | All structural checker checks pass; this does not certify student authorship or manual work |

Process limitations beyond the checker: the Week 07 prompts were applied in the existing Codex context; student-authored reasons, personal review and conclusions are not completed by the student. UI interactions were automated. SETUP.md was unavailable, so exact PR-section conformance cannot be verified. Work was performed on 8 November, after the Week 07 deadline; no dates have been backdated.


### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 20 / 20 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1-AC5; no strictly-past positive start, no repeated call; AC6 outside unit scope | AC1-AC5 plus PAST, REPEAT, REJECTED; AC6 checked separately in browser |
| Selected mutants detected | Not executed on first suite; no measured score claimed | M1, M2, M3: 3/3 detected |
| Accepted / revised / rejected tests | All 17 retained unchanged | 17 retained, 3 additions, zero altered expectations |
| Remaining limitations | Malformed existing records unspecified, UI outside unit scope | Same specification gap; browser captures are not exhaustive accessibility checks |


### 9.3 What no AC decides

Actual Node 24 call with start 660, end 720, now 540, blocked false and bookings [{start:700,end:650}] returned true. The strict overlap predicate finds no intersection, and no validation of existing records runs. No AC specifies treatment of malformed existing intervals, so this is an observation, not a new normative expectation. The result is declared as returns-true; no assertion was added that would silently invent a requirement.


## 10. Conclusion (120–180 words)

AI-authored draft for student review; this is not represented as the student's independent conclusion.

The first suite had no observed incorrect expectation, but it did not independently cover a request strictly before the current time or repeated availability checks on the same data, so a future defect on those paths could escape its assertions. Reviewing the inputs against AC1 and AC5 led to three additional tests while preserving all seventeen original cases and their expected results. The final twenty-test green run shows that the implemented function meets those particular assertions, and the mutation experiments provide stronger evidence because T06 detected the duration defect, T01 and T08 detected endpoint conflicts, and T13 detected a removed blocked-room guard. The separate browser observations support the displayed decisions and phone-width layout, but neither those observations nor the unit suite establish exhaustive correctness, accessibility, or a policy for malformed existing bookings; that last case remains an explicitly recorded specification gap.


