# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code, read-only Explore subagent | claude-opus-5-5 | read-only risk review (Task 2) | none — "WITHOUT editing files" (the agent type has no edit tools) |
| Claude Code, read-only Explore subagent | claude-opus-5-5 | AGENTS.md review and patch draft (Task 6); also the read-AGENTS.md prompt (Task 1) | none; the main session applied only the approved lines to `app/AGENTS.md` |
| Claude Code, read-only Plan subagent | claude-opus-5-5 | refactor proposal for R3 (Task 8) | none; the main session applied its diff to `app/src/booking.ts` and `app/src/App.tsx` |
| Claude Code, main session | claude-opus-5-5 | the whole lab at the student's request: running every command, checking each AI claim in the files, scoring the register, the readiness audit, the decisions in §6.2, writing the R3 regression tests, the AGENTS.md patch for R1, the UI check with screenshots, the checker runs, drafting `lab-report.md`, this file and `submission.yml`, commits and the PR | `app/AGENTS.md`, `app/src/booking.test.ts`, `app/src/booking.ts`, `app/src/App.tsx`, `evidence/`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes — done by the Claude Code main session, not yet by the student personally

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes — reviewed by the Claude Code main session; the student's own review is pending
<!-- Rejected items are named in lab-report.md §6.2 and §8. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes
Claude Code (claude-opus-5-5) main session drafted every section of `lab-report.md`, including §9.3 and the §10 conclusion, which the brief asks the student to write without the assistant.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes — only the absolute path was shortened to `.../` and colour codes were turned off with `NO_COLOR=1`

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** not yet confirmed by the student

**Anything I accepted from the AI without fully understanding it:**
The student has not yet personally reviewed the generated work; no understanding is asserted on the student's behalf. The §10 conclusion and §2.3 judgement are AI-drafted and should be rewritten in the student's own words.

Signed: pending — not signed by the assistant
Date: 2026-11-22
