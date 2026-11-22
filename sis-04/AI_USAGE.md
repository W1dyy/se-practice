# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude Code, read-only Plan subagent | claude-opus-5-5 | 2026-11-22 | codebase analysis (Task 1) | none (read-only agent type) |
| Claude Code, read-only Plan subagent | claude-opus-5-5 | 2026-11-22 | improvement plan (same answer as the analysis) | none |
| Claude Code, main session | claude-opus-5-5 | 2026-11-22 | feature extension (Task 2): `rooms.ts`, `filter.ts`, `checkRoom`, the page | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/booking.ts`, `app/src/App.tsx`, `app/src/index.css`, `app/README.md` |
| Claude Code, main session | claude-opus-5-5 | 2026-11-22 | refactoring (Task 3): `time.ts`, removal of the global blocked state, the diagrams | `app/src/time.ts`, `app/src/App.tsx`, `app/src/booking.ts`, `diagrams/` |
| Claude Code, main session | claude-opus-5-5 | 2026-11-22 | tests (Task 4) | `app/src/catalog.test.ts`, `app/src/filter.test.ts` |
| Claude Code, read-only Explore subagent | claude-opus-5-5 | 2026-11-22 | test review (exchange 8.3) | none |
| Claude Code, main session | claude-opus-5-5 | 2026-11-22 | the five screenshots (built-in browser of the Claude desktop app), all of `report.md` including the §10 reflection draft, `submission.yml`, commits and the PR | `evidence/`, `report.md`, `AI_USAGE.md`, `submission.yml` |

The whole SIS was carried out by the Claude Code agent at the student's request. The student's personal review is pending.

**The assistant wrote, or helped write, tests in `app/`:** yes
All 19 new tests in `catalog.test.ts` and `filter.test.ts` were written by the Claude Code main session. Their expected values were worked out from AC1–AC5, F1–F5 and the fixed test catalog before each run, and were seen failing before the code existed (`evidence/red-checkRoom.txt`, `evidence/red-filter.txt`). A separate read-only subagent then reviewed them (§8.3), and B5, B6, F3 and the unknown-id test were tightened.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes — on the student's computer, run by the Claude Code agent; only the absolute path is shortened to `.../` and colour codes were off (`NO_COLOR=1`)

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** not yet confirmed by the student

**Anything I accepted from the AI without fully understanding it:**
The student has not yet personally reviewed the generated code, tests and report. The §10 reflection is an AI draft and must be rewritten in the student's own words; nothing here is signed on the student's behalf.

Signed: pending — not signed by the assistant
Date: 2026-11-22
