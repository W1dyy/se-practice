# SIS #03 — Report: Smart Campus Room Availability Checker

Student: Bakhytzhan Amir; ID: 24B031694; group: MON 16:00-19:00; GitHub: W1dyy.

Status: published on branch sis-03 with open PR https://github.com/W1dyy/se-practice/pull/6; implementation and observed tests completed; submission content remains incomplete. AI authorship, missing independent reflection, incomplete exchange transcripts and provenance limitations are disclosed below. Automated PASS results do not establish compliance with those requirements.

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Codex desktop |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | week-06 |

Python v1 was freshly generated after the student approved the plan in this conversation. No Week 05 v1 or original generation chat was found in the repository branches inspected; no historical conversation was reconstructed. Web v1 and its historical screenshot were copied byte-for-byte from origin/week-06 at the inspected repository state. The old report dates that work 2026-10-18, but its test claims conflict with its actual files and are not reused as observed results. The final web project is a local Codex repair of that Bolt export, not a new download from Bolt.new. Student approval of the plan was received as “План одобряю”.

## 2. Baseline — before any new AI exchange

**Authorship and timing disclosure:** This section was drafted by Codex at the student's explicit request during this SIS conversation. It was not independently written before AI use. The required no-AI baseline and timing condition are not satisfied. No earlier authorship or push time is claimed.

### 2.1 Scope in my own words

**Scope:** Check whether one selected campus room is available for a requested interval using fictional existing bookings. Implement a Boolean Python function and a responsive Bolt.new page. Checking must never create a booking. Exclude login, backend, database, external APIs, payments and unrelated features.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Use integer minutes within one day, with 0 <= start < end <= 1440, and require start to be strictly later than the supplied now. |
| AC2 | Allow intervals lasting up to 120 minutes, including exactly 120 minutes; reject longer intervals. |
| AC3 | A blocked room must return Unavailable for every candidate interval. |
| AC4 | Reject an interval that overlaps any existing booking. One interval ending exactly when another begins is allowed. |
| AC5 | Show an explicit Available or Unavailable result and leave the existing bookings unchanged, including after repeated checks. |
| AC6 | Explain invalid requests clearly and keep the controls and result usable on a narrow phone screen. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Using inclusive overlap comparisons could reject touching intervals. | AC4 | Run T1: existing 600-660, candidate 660-720, now 540, unblocked; expect Available. Also test touching the other endpoint. |
| 2 | A non-strict comparison could accept a request starting exactly now. | AC1 | Run T6: start 540, end 570, now 540; expect Unavailable. Compare with a start one minute later. |
| 3 | A check action could append a booking and change the second result. | AC5 | Run T11 twice on the same data, compare the booking collection before and after, and expect Available both times. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Candidate start measured from midnight. | Integer minute; a valid candidate has 0 <= start < end. |
| `end` | Candidate end measured from midnight. | Integer minute; a valid candidate has start < end <= 1440. |
| `now` | Supplied current minute for evaluating the request. | Assumed valid integer from 0 through 1439. |
| `blocked` | Whether the selected room is unavailable for all requests. | Boolean; True rejects every request. |
| `existing` | Existing occupied intervals for the selected room. | Collection of valid integer (start, end) pairs, treated as half-open intervals and never modified. |
| returns | Whether every rule AC1-AC4 permits the request. | A Python Boolean: True only when all checks pass, otherwise False. No booking is created. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All times refer to the same day; overnight requests are outside scope. Minute 1440 is allowed only as an interval end.
2. The supplied now and existing booking pairs are valid. Existing bookings may be unsorted; every pair must be checked.
3. Data is fictional, and availability checking does not require persistence or a network connection.

**Checked manually:**

- Pending: no implementation or browser case has yet been manually verified in this SIS. Planned checks include endpoint contact, start equal to now, unchanged bookings after two checks, and the final page at 375 px width. Planned checks are not reported as observed results.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `type(start) is not int or type(end) is not int` | AC1 | Yes | Rejects fractional, string and Boolean candidate times instead of coercing them. Valid now and existing pairs remain assumptions. |
| `not (0 <= start < end <= 1440)` | AC1 | Yes | Rejects negative, zero-length, reversed and past-midnight candidates. End equal to 1440 is allowed. |
| `start <= now` | AC1 | Yes | Equality and past starts are rejected; the one-minute-after-now test is accepted. |
| `end - start > 120` | AC2 | Yes | A 120-minute request passes this guard; a 121-minute request does not. |
| `blocked` | AC3 | Yes | No candidate can reach True for a blocked room. |
| `start < booked_end and end > booked_start` | AC4 | Yes | Strict overlap comparison allows endpoint contact; the loop checks every existing pair until a conflict is found. |

The final return True is reached only after all guards and all existing intervals pass. No append, assignment, sort or other mutation is performed on existing. Final Python is deliberately identical to v1 because the observed tests did not reveal a defect; no artificial bug was planted in v1 to create an improvement narrative. The cleanup targets were in the page.

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

This prompt is quoted from the existing Week 06 lab report, not reconstructed from a missing chat. Its historical date is reported as 2026-10-18. Bolt's complete original response is unavailable. Reuse retains the original “Do not add authentication, backend services” exclusion accepted by the supplied checker.

Paths below are relative to the detected project root web/original/project/.

| Generated file or component | Path | Its role |
| --- | --- | --- |
| React application | `src/App.tsx` | Room selector, supplied current time, request form, result and existing bookings. |
| Availability rules | `src/lib/availability.ts` | AC1-AC4 checks with a structured available/unavailable verdict. |
| Time helpers | `src/lib/time.ts` | HH:MM parsing, formatting and initial browser clock value. |
| Fictional fixtures | `src/data/campus.ts` | Sample rooms, blocked status and existing bookings. |

**What v1 does:**

- Provides a current time input, strict endpoint overlap checking and read-only booking checks. These facts contradict the inherited report's claims of missing current-time input and broken touching comparisons.
- Native time controls cannot express 24:00 or 24:01. Results remain visible after editing a request, and visible labels lack programmatic associations.
- Includes an unused Supabase dependency in package.json; no backend was added to the final.

## 5. Test cases — executed on both artifacts

Base: now=540, blocked=False, existing=[(600,660)]. Python results were executed by the supplied checker. Browser tests used headless installed Chrome through Playwright. T11 records the second check; visible bookings were compared before and after every executable browser case.

Important method limitation: the unchanged v1 ships different seed bookings and no fixture editor. Its T1-T12 runs intercept only the served campus data module in the test browser to supply the required case data; no v1 source file was edited. They exercise the real React form and rules against controlled data, not the untouched native seed scenario. Final tests use the shipped data: A-101 for base cases, C-310 for blocked T3, B-204 for the two-booking T10. These rooms are selected one at a time. No browser interception is used for final.

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

T8/T9 on v1 are Not testable because filling the native time input raises “Malformed value”. Final accepts end 24:00 and rejects 24:01 with feedback. Both T12 runs had innerWidth=375 and document scrollWidth=375. Screenshots were visually inspected after correcting the runtime working directory so Tailwind loads properly. Raw browser observations are saved in evidence/browser-results.json. The reusable harness is tests/browser_cases.cjs. To rerun it, install Playwright in a scratch Node environment, start copies of v1 and final using npm run dev from each project directory at ports 5175 and 5176, and run the harness with Node. Runtime dependencies are intentionally excluded from the exports.

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py guards; web/final/src/lib/availability.ts; App.tsx parsing | T6-T9; non-integer unittest | Starts-now/reversed/past-midnight rejected; valid midnight accepted | Python matches; page T6/T7 Unavailable, T8/T9 Not testable | Python matches; page T6/T7/T9 Unavailable, T8 Available |
| AC2 | code/booking.py duration guard; availability.ts | T4, T5 | 120 allowed, 121 rejected | True/False; page Available/Unavailable | True/False; page Available/Unavailable |
| AC3 | code/booking.py blocked guard; availability.ts room.blocked | T3 | Blocked request rejected | False; page Unavailable | False; page Unavailable |
| AC4 | code/booking.py loop; availability.ts conflict search | T1, T2, T10; overlap-shape unit tests | Contact allowed; overlap with any pair rejected | True/False/False; page Available/Unavailable/Unavailable | Same observed outcomes |
| AC5 | Pure Python return; App.tsx read-only bookings and invalidated verdict | T11; unchanged-input tests; edit after T1 | Repeated Available without modifying bookings; no stale decision after edit | Repeated Available; bookings unchanged; stale Available after edit | Repeated Available; bookings unchanged; edited request clears result |
| AC6 | App.tsx labels, aria-live, responsive classes and feedback | T7, T9, T12; label association inspection | Clear feedback and usable 375 px page | T7 feedback and no overflow; zero associated labels; T9 cannot be entered | T7/T9 feedback; four associated labels; 375 px without horizontal overflow |

## 7. Issue log

The focused instructions below were formulated and applied by Codex within the student's standing request. They are not invented student messages or Bolt chat transcripts. Decisions remain subject to student review.

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Stale result after editing the checked request | AC5/AC6: T1 gives Available, then edit start to 10:30 without submitting; v1 still displays Available for old 11:00-12:00 | High | Focus: clear the verdict whenever room/current/start/end changes; keep existing bookings unchanged. Updated App.tsx onChange handlers only. | v1 result after edit Available; final no result after edit; rechecking gives Unavailable in both. |
| 2 | Labels are visually present but not associated with controls | AC6: inspect the four Room/Current time/Start/End labels; v1 has zero label-for associations | Medium | Focus: add stable control ids and matching htmlFor, and announce result changes politely. Added four associations and aria-live result region. | DOM inspection: zero associations in v1, four in final; final narrow T12 Available without overflow. Announcement markup verified; no screen-reader session claimed. |
| 3 | Midnight cannot be requested and footer formats 1440 as 00:00 | AC1/AC6: T8/T9 cannot be filled in v1 end time input | Medium | Focus: accept exactly 24:00 as the end, reject 24:01, keep current/start below midnight; format 1440 as 24:00. | Final T8 Available, T9 Unavailable; narrow screenshot footer displays 00:00–24:00. |
| 4 | Unused backend SDK and seed data hinder required scenarios | Scope and AC1-AC6 testability: package.json includes Supabase; no room ships the required base and second-booking fixtures | Low | Focus: remove unused backend dependency from final and provide fictional base, blocked and second-booking room datasets. Preserve all original files unchanged. | Final build, typecheck and lint passed; final browser T1-T12 use its own data; final source scope scan clean. |

**Before / after:** evidence/before-1.png → evidence/after-1.png show issue 1 with the same edited 10:30–12:00 request: v1 retains its old Available decision; final clears it and asks for a check. Before is a fresh v1 browser capture using controlled fixture data; web-v1.png is the unchanged historical Bolt screenshot.

## 8. Critique decisions

This is Codex's review and provisional decision record, not a claim of independent student verification. Tests and source inspection provide the cited evidence; the student must review the decisions before submitting.

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Python strict overlap and duration guards satisfy AC1-AC4 under the declared valid-input assumptions | Executed 24 unittests, T1-T11 and supplied mutation checks | accept | T1 contact accepted, T2/T10 overlap rejected, T4 accepted and T5 rejected. |
| 2 | The inherited Week 06 report claims v1 has no supplied-time field and rejects touching endpoints | Inspected actual App.tsx/currentTimeStr and availability.ts strict comparison; reran T1/T6 | reject | Source and observed T1 Available/T6 Unavailable contradict that historical narrative; AC1/AC4 do not justify those claimed repairs. |
| 3 | Clearing stale results and associating labels improves feedback | Executed edit-after-T1 scenario and counted label-for associations in both pages | accept | AC5/AC6: stale Available becomes no result after editing; labels increase from zero to four. |
| 4 | A valid end of 1440 needs an explicit interface representation | Native v1 fill rejected 24:00; final T8/T9 executed through real form | modify | Use a text end field allowing only exact 24:00 as the boundary, rather than changing AC1 or claiming that native time controls accept it. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Prepare SIS 03 in W1dyy/se-practice with Python, Bolt reuse, observed tests and an open PR. |
| Model / plan | Codex proposed validation guards and boundary tests; the student explicitly approved the plan. |
| Tool call | Python wrote and tested files; Git inspected origin/week-06; Playwright drove the real React forms. |
| Observation | All 24 Python tests passed; browser runs confirmed a stale verdict and missing label associations in v1. |
| Next step | Codex repaired the derived final, reran browser cases and build checks, and visually inspected captures. |
| Human review | The student supplied identity and approved the plan; review of generated code, critique decisions and final submission is still pending. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Codex terminal | Supplied ZIP, PDF text, repository files and user instructions | Local file edits and test processes; additional network permission granted for repository access | Observed |
| Git and Playwright | Public repository branches; locally served copies of the source projects | Clone and local commits succeeded; Chrome ran headlessly; push failed during credential lookup | Observed |
| Bolt.new original export | Existing Week 06 source and screenshot identify a Bolt project | Historical generation model and internal build permissions were not visible during this SIS | Assumed |
| Codex model | Conversation and selected terminal results | No complete repository context or hidden model configuration can be inferred merely from the tool label | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting generated changes, inspect the diff for network calls, storage, credentials and scope changes. Preserve the original files, run boundary and mutation tests, and inspect actual screenshots. Do not sign the student's personal understanding declaration or claim a successful push when authentication failed.

**Reliability, security, responsibility:** Boundary tests establish expected behavior independently of generated code, while browser observations reveal stale results and accessibility problems that Python tests cannot cover. Limiting the final page to fictional local data avoids unnecessary account and database access. The student remains responsible for checking the code, understanding overlap rules, reviewing provisional decisions and honestly disclosing AI authorship. Tool success establishes an observed action, not permission to invent a personal reflection or historical evidence.

## 10. Reflection

Pending a student-written 100–200 word reflection. No personal reflection has been supplied. Codex has not invented the student's learning experience or claimed the required independent authorship. This section intentionally remains incomplete and is declared as Q1.

## 11. Appendix A — AI exchanges

These are stage records from the continuing SIS conversation. They include verbatim short user messages, excerpts from the standing request and generated artifacts. They are not four complete historical prompt/response transcripts. Missing complete exchanges are explicitly declared under X2 and must be completed from genuine chat records; no missing Week 05 chat was reconstructed.

### B1

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Standing user request, excerpt: Python: AI plan you approve -> v1 saved unedited -> review every branch (section 3) -> final code/booking.py -> 10+ tests in code/test_booking.py.
~~~~

**Response:**

~~~~text
Подтвердите план Python: последовательно проверить целые минуты и границы дня, start > now, длительность ≤120, blocked и пересечение start < booked_end and end > booked_start; данные не изменять. Сохранить первую генерацию отдельно и написать 10+ граничных тестов.
~~~~

Actual student approval: “План одобряю”. The standing-request excerpt is identified as an excerpt, not a separately sent message.

### B2

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
План одобряю
~~~~

**Response:**

~~~~python
def can_book(start, end, now, blocked, existing):
    """Check a same-day request without changing existing half-open intervals."""
    if type(start) is not int or type(end) is not int:
        return False
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False
    return True
~~~~

This is the complete first generated Python artifact, saved before changes. Other commentary and tool calls are not a complete conversation transcript here. Web generation is reused from Week 06; its complete model response is unavailable.

### B3

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Standing user request, excerpt: AI critique against AC1-AC6: verify each claim, accept / reject / modify (section 8).
~~~~

**Response:**

~~~~text
В исходниках Bolt v1 уже есть корректное сравнение пересечений и поле текущего времени, хотя старый отчёт утверждает обратное. Поэтому описанные там ошибки переносить не буду.
Нашёл другие проблемы: результат остаётся на экране после изменения входных данных, а подписи полей не связаны с контролами. Их проверю в браузере и затем исправлю.
~~~~

This is an actual commentary excerpt; the complete critique is the provisional claim record in section 8, not an independent student's decision.

### B4

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Agent-authored focused instructions within the standing user request: Clear the verdict whenever any request field changes. Associate the four visible labels with their inputs and announce result changes. Permit exactly 24:00 only as the end boundary. Do not modify existing bookings or the original export.
~~~~

**Response:**

~~~~text
Applied focused repairs to derived final, preserving original export.
~~~~

The response above is the actual repair script's terminal output, not a fabricated full model response. The implementation diff and issue-specific tests establish what changed; a terminal line does not replace the required complete AI exchange. Full four-exchange evidence is still pending.

## 12. Appendix B — Test output

### 12.1 Your suite

Command: python -m unittest -v, run inside code/.

~~~~text
test_121_minutes (test_booking.BookingTests.test_121_minutes) ... ok
test_blocked (test_booking.BookingTests.test_blocked) ... ok
test_contained_by_existing (test_booking.BookingTests.test_contained_by_existing) ... ok
test_contains_existing (test_booking.BookingTests.test_contains_existing) ... ok
test_end_of_day (test_booking.BookingTests.test_end_of_day) ... ok
test_exactly_120 (test_booking.BookingTests.test_exactly_120) ... ok
test_identical_interval (test_booking.BookingTests.test_identical_interval) ... ok
test_inputs_unchanged_after_rejection (test_booking.BookingTests.test_inputs_unchanged_after_rejection) ... ok
test_inputs_unchanged_after_repeated_success (test_booking.BookingTests.test_inputs_unchanged_after_repeated_success) ... ok
test_integer_minutes_required (test_booking.BookingTests.test_integer_minutes_required) ... ok
test_negative_start (test_booking.BookingTests.test_negative_start) ... ok
test_no_bookings (test_booking.BookingTests.test_no_bookings) ... ok
test_overlap_ending_inside (test_booking.BookingTests.test_overlap_ending_inside) ... ok
test_partial_overlap (test_booking.BookingTests.test_partial_overlap) ... ok
test_past_midnight (test_booking.BookingTests.test_past_midnight) ... ok
test_reversed (test_booking.BookingTests.test_reversed) ... ok
test_second_booking (test_booking.BookingTests.test_second_booking) ... ok
test_starts_before_now (test_booking.BookingTests.test_starts_before_now) ... ok
test_starts_now (test_booking.BookingTests.test_starts_now) ... ok
test_starts_one_minute_after_now (test_booking.BookingTests.test_starts_one_minute_after_now) ... ok
test_touching_end (test_booking.BookingTests.test_touching_end) ... ok
test_touching_start (test_booking.BookingTests.test_touching_start) ... ok
test_unsorted_bookings_and_tuple (test_booking.BookingTests.test_unsorted_bookings_and_tuple) ... ok
test_zero_duration (test_booking.BookingTests.test_zero_duration) ... ok

----------------------------------------------------------------------
Ran 24 tests in 0.001s

OK
~~~~

The final web runtime copy also passed npm run build, npm run typecheck and npm run lint. Dependencies were installed only in scratch runtime copies, not in either submitted export. Browser tests were rerun after a working-directory mistake initially prevented Tailwind styling; the retained screenshots come from the corrected runs.

### 12.2 Path B only — three faults you planted

Not applicable: Path A uses the supplied checker's mutation analysis instead.

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| Q1 | No independently written student reflection has been supplied. | Student writes 100–200 words based on actual experience and decisions. |
| X2 | Four stage records exist, but they are excerpts and artifact records, not four complete prompt/response transcripts. | Save genuine complete exchanges; never invent historical prompts or responses. |
| Baseline authorship and timing | Student explicitly asked Codex to draft section 2 after this conversation began. Mechanical B1 cannot verify authorship. | Disclose the deviation to the instructor; do not relabel AI prose or backdate commits. |
| Student verification | Critique decisions and the final work were inspected by Codex; no independent student verification is claimed. | Student reviews code, cases, changes and all claims before submitting. |
| Final Bolt provenance | Final source is a local repair of the unchanged Week 06 Bolt export, not a fresh Bolt download. | Import the repaired project into Bolt, verify there, and retain a genuine final export if the course requires it. |
| v1 browser fixture method | Required case data was injected into the served module only in the v1 test browser; native v1 has different fixed sample data. | Grader can rerun the documented harness; student can perform a separate native-fixture check. |
| GitHub publication | Published through the connected GitHub account after the initial terminal authentication failure. Open PR: https://github.com/W1dyy/se-practice/pull/6, sis-03 to main. Original local commits were recreated through GitHub with identical file trees, preserving their order; publication timestamps are real. | Keep the PR open for grading; complete the remaining disclosed content before submission. |

The open PR title is `SIS 03 - Room availability - Bakhytzhan Amir`. Its five-section draft follows. Time spent is deliberately not invented.

### PR description draft

~~~~markdown
## What I built
Python can_book with 24 tests and a locally repaired Week 06 Bolt room availability checker. Both versions are preserved; report.md records observed cases, traceability, issues and known limitations. This is incomplete work pending the items disclosed in report section 13.

## AI tools used
Codex desktop, exact model not displayed; reused Week 06 Bolt.new export, model not displayed. AI assistance includes the baseline at the student's explicit request; the required independent baseline condition is not met.

## What the AI got wrong
The inherited report described defects not present in the actual export. Source inspection and browser runs contradicted those claims. Initial local screenshots lacked styling because the test server used the wrong working directory; corrected runs replaced those captures.

## Time spent
Not supplied by the student; to be completed with actual time.

## What I would do differently
Student reflection and personal decisions remain pending. Technical next steps are a genuine Bolt final export, complete chat transcripts and independent student review without expanding scope.
~~~~
