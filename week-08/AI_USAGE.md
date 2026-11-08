# AI Usage Disclosure — Week 08

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex independent agent plain_diagnosis | not displayed, inherited parent model | Diagnosis without the skill, fresh context | none; read only evidence/plain-prompt.txt |
| Codex independent agent skill_diagnosis | not displayed, same inherited parent model | Diagnosis with bug-detector, fresh context, prompt-only simulation | none; read only SKILL.md and evidence/skill-prompt.txt |
| Codex parent session | not displayed | All implementation, tests, hypotheses, comparison, report, packaging, commits and terminal execution | app/src/booking.ts, app/src/booking.test.ts, skills/, evidence/, lab-report.md, submission.yml, AI_USAGE.md |

SKILL.md was typed by me from the deck text, not generated: no. Codex copied the exact provided text into the file and packaged it; the student's required manual typing remains pending.
I applied the patches myself after reviewing the proposals: no. Codex reviewed and applied them. One overlap line changed for BUG-A; one push line deleted for BUG-B. Student review is pending.
I used another assistant as well: yes. Two independent Codex subagents were explicitly authorized for the controlled comparison; no model override was used. The parent drafted all report sections, including the labelled conclusion draft.
Every terminal output in the report was pasted from a real run, unedited: yes. The diagnosis answers are also preserved unedited. They are not claims of executed tests; both agents explicitly state that they did not execute code.
I can explain both bugs and fixes without the assistant: not yet confirmed by the student.
Anything accepted without fully understanding it: the student has not yet personally verified the generated work; no understanding or signature is asserted on the student's behalf.

Simulation disclosure: fresh agent contexts, same saved code/AC/failure input, no installed skill. Text transcripts exist; a genuine installation/simulation screenshot does not, so E1 remains ERROR. The shared AC1 wording was abbreviated in the supplied Week 08 contract; both agents' extra time-boundary suggestions were rejected against Week 07 AC1/T02. The plain response's table-driven test suggestion was not copied into the suite.

Student signature: pending personal review; not signed by the assistant.
Prepared on: 2026-11-08.
