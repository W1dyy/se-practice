# AI Usage Disclosure — Week 07

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex desktop | not displayed | Extraction, plan, first-suite generation, review and improvements, mutations, real terminal execution, browser automation and report drafting | app/src/booking.ts, app/src/booking.test.ts, app/src/App.tsx, app/package.json and lockfile, suites/first/booking.test.ts, evidence/, lab-report.md, submission.yml, AI_USAGE.md |

The assignment prompts were used within the current Codex chat; there was no separate fresh Week 07 generation chat. Saved generation and improvement input/answer files document that process. The plan and review are AI-authored, not independent student work.

I used an assistant to extract canBook: yes. It retained the starter's Boolean conditions; 20 unit tests, three restored mutants and browser checks were executed. No production defect was found requiring a behavior fix.
I used another assistant as well: no for Week 07. The same Codex session drafted the entire report, including the explicitly labelled conclusion draft.
The first suite is preserved exactly as generated: yes.
Every test output in the report is from a real saved run, unedited: yes. Presentation wrappers are Markdown; test log content is preserved.
I can explain every test without the assistant: not yet confirmed by the student.
Anything accepted without fully understanding it: student review of all generated tests, reasons, report and changes is pending; this file does not claim understanding on the student's behalf.
Browser checks were automated using Playwright and Chrome, not manually performed by the student.

Student signature: pending personal review; not signed by the assistant.
Prepared on: 2026-11-08.
