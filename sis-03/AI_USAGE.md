# AI Usage Disclosure — SIS #03

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Codex desktop | not displayed | approved validation plan; AI-authored baseline | report.md section 2 and section 11 | this SIS |
| Codex desktop | not displayed | fresh Python v1 and final; 24 tests | code/original/booking_v1.py, code/booking.py, code/test_booking.py | this SIS |
| Bolt.new | not displayed | original web prototype | web/original/, evidence/web-v1.png | week-06, declared historical date 2026-10-18 |
| Codex desktop | not displayed | source critique, browser checks and focused local repairs | web/final/, tests/browser_cases.cjs, evidence/, report.md | this SIS |
| Codex desktop | not displayed | declaration and report drafting | submission.yml, report.md, AI_USAGE.md | this SIS |

**The assistant wrote, or helped write, my tests in code/:** yes. All 24 tests were generated from AC1-AC5. Expected outcomes were specified independently of implementation results; the supplied checker also runs fault mutations.

**code/original/ and web/original/ hold the AI's first versions exactly as returned:** yes for the fresh Python artifact and the byte-for-byte copied Week 06 export. Historical authorship is based on the existing Week 06 repository record, not a recovered Bolt conversation.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes. See the explicit controlled-fixture method for v1 browser runs in section 5. Not testable denotes native time controls rejecting the required values, not an assumed result.

**Everything submitted can be explained and defended by the student:** pending student review; Codex cannot make that personal assurance.

**Anything accepted from the AI without fully understanding it:** student review pending; no personal assurance is invented.

**Authorship deviation:** At the student's explicit request, Codex drafted section 2 after AI use had begun. This fails the independently written pre-AI baseline requirement. Section 10 remains pending student authorship. Critique decisions are provisional agent decisions, and section 11 is an incomplete stage record rather than four complete transcripts. The final page was repaired locally, not regenerated in Bolt. GitHub push and PR creation have not succeeded.

Student signature: pending
Preparation date: 2026-11-01
