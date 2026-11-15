# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at them. Replace every <!-- comment --> with your own text (comments are ignored by the checker).

Name: Amir Bakhytzhan
Student ID: 24B031694
GitHub: W1dyy

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Gemini |
| Exact model (or "not displayed") | Gemini 2.5 Pro |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.11.2 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time interval. All times (start, end, now, and bookings) are whole minutes since midnight in the range 0-1440 (where 0 is 00:00 and 1440 is 24:00). This tool only checks availability and does not save, create, or modify any booking.",
  "inputSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking start time in whole minutes since midnight (0-1440)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking end time in whole minutes since midnight (0-1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight (0-1440)."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is currently blocked for maintenance or administrative hold."
      },
      "bookings": {
        "type": "array",
        "description": "List of existing bookings for the room, each with start and end in whole minutes since midnight.",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "start",
            "end"
          ],
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          }
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ]
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `inputSchema` | `"type": "object"` | A caller could pass a JSON array or primitive value instead of a named parameter dictionary. |
| `inputSchema` | `"required": ["start", "end", "now", "blocked", "bookings"]` | Calls omitting any required parameter (such as `now` missing in S04) would be accepted and pass undefined into `canBook`. |
| `inputSchema` | `"additionalProperties": false` | The schema would silently accept invented or misspelled top-level fields such as `"room": "204"` in S05. |
| `start` | `"type": "integer"` | Clock strings like `"10:00"` or fractional minutes like `600.5` (S10) would be accepted instead of whole minutes. |
| `start` | `"minimum": 0`, `"maximum": 1440` | Negative minute values like `-30` (S06) or values beyond a 24-hour day (`> 1440`) would pass validation. |
| `end` | `"type": "integer"` | String times such as `"11:00"` (S03) or floating-point numbers would be accepted. |
| `end` | `"minimum": 0`, `"maximum": 1440` | Out-of-range end times such as `1500` (S07) would pass, or if maximum were `< 1440`, valid midnight end times (`1440` in S11) would be wrongly refused. |
| `now` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The current time could be sent as an ISO timestamp string, negative number, or value outside the 0–1440 day range. |
| `blocked` | `"type": "boolean"` | Stringified booleans like `"false"` (S09) or numbers (`0` / `1`) would be accepted, causing truthiness bugs in JavaScript/TypeScript. |
| `bookings` | `"type": "array"` | A single booking object, `null`, or string could be passed instead of a list of bookings (which may be empty `[]` as in S02). |
| `bookings.items` | `"type": "object"` | Existing bookings formatted as two-element arrays like `[660, 720]` (S12) or primitives would be accepted. |
| `bookings.items` | `"required": ["start", "end"]` | Incomplete booking objects missing start or end (such as `{"start": 660}` in S08) would pass validation. |
| `bookings.items` | `"additionalProperties": false` | Extra unexpected keys inside individual booking items would not be rejected. |
| `bookings.items.start`, `bookings.items.end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing booking intervals could contain string times, fractional minutes, or values outside `0–1440`. |

## 3. The twelve calls — first run and final run

Your first run's S verdicts (before any fix), and your final ones. For every case that changed, say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | Unchanged (valid call accepted on both runs). |
| S02 | PASS | PASS | Unchanged (empty `bookings: []` accepted on both runs). |
| S03 | PASS | PASS | Unchanged (`"type": "integer"` on `end` refused `"11:00"`). |
| S04 | PASS | PASS | Unchanged (`"now"` in top-level `required` refused missing `now`). |
| S05 | FAIL | PASS | Added `"additionalProperties": false` to top-level `inputSchema` so extra field `"room": "204"` is refused. |
| S06 | PASS | PASS | Unchanged (`"minimum": 0` on `start` refused `-30`). |
| S07 | PASS | PASS | Unchanged (`"maximum": 1440` on `end` refused `1500`). |
| S08 | FAIL | PASS | Added `"required": ["start", "end"]` (and `"additionalProperties": false`) inside `bookings.items` so `{start: 660}` without end is refused. |
| S09 | PASS | PASS | Unchanged (`"type": "boolean"` on `blocked` refused `"false"`). |
| S10 | PASS | PASS | Unchanged (`"type": "integer"` on `start` refused `600.5`). |
| S11 | PASS | PASS | Unchanged (`"maximum": 1440` on `end` accepted `1440`). |
| S12 | PASS | PASS | Unchanged (`"type": "object"` on `bookings.items` refused `[660, 720]`). |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1
```json
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```
Every argument matches the expected values (F1, F2, and F3 all PASS). The model accurately converted 9:00 to `now = 540`, 10:00 to `start = 600`, 11:00 to `end = 660`, set `blocked = false` ("It isn't blocked"), and converted the existing booking from 11:00 to 12:00 into `[{"start": 660, "end": 720}]`.

### R2
```json
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```
Every argument matches the expected values (F4, F5, and F6 all PASS). The model converted 13:30 to `now = 810`, 14:00 to `start = 840`, and 16:30 to `end = 990`, set `blocked = true`, and passed `bookings = []`. Even though the room is blocked for maintenance (AC3) and the requested slot is 150 minutes long (exceeding the 120-minute cap in AC2), the model did not refuse to call the tool; it produced a valid tool call so `canBook` itself can evaluate the rules and return `Unavailable`.

### R3
```
What are the exact start and end times, the current time, whether the room is blocked, and any existing bookings?
```
Request R3 ("Can I have the room tomorrow afternoon for a couple of hours?") leaves out almost every required parameter: it gives no current time (`now`), no `blocked` flag, no list of existing `bookings`, and only a vague relative timeframe ("tomorrow afternoon for a couple of hours") instead of exact start and end minute offsets within a single 0–1440 day. Following the prompt's rule not to guess missing required arguments, the model did not call `check_room` and did not invent any numbers; instead, it asked one short clarifying question (`calls/r3.txt`).

## 5. What the schema cannot check

A JSON Schema restricted to the allowed keywords (`type`, `properties`, `required`, `additionalProperties`, `items`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `enum`, `minItems`, `maxItems`) validates the static shape, type, and independent bounds of each field, but cannot enforce cross-field relationships, domain logic, or runtime behavior:

- **What part of AC1 the schema CAN enforce:** It enforces that `start`, `end`, and `now` are whole integers (`"type": "integer"`) within the single-day bounds `0 <= start <= 1440`, `0 <= end <= 1440`, and `0 <= now <= 1440` using `"minimum": 0` and `"maximum": 1440`.
- **AC1 (relational ordering `start < end` and `start > now`):** JSON Schema validates each property in isolation and has no keyword to compare two dynamic fields against each other. A call with `start: 600, end: 600` or `start: 500, now: 540` passes schema validation and can only be rejected by `canBook`.
- **AC2 (maximum duration `end - start <= 120`):** Checking that a booking lasts at most 120 minutes requires arithmetic across two fields (`end - start <= 120`), which JSON Schema cannot compute (for example, `start: 840, end: 990` in R2 is 150 minutes long and passes the schema).
- **AC3 (unavailable when `blocked` is true):** Both `true` and `false` are valid boolean inputs for `blocked`. If the schema restricted `blocked` to `enum: [false]`, it would wrongly reject legitimate queries like R2 as malformed calls instead of letting `canBook` answer `Unavailable`.
- **AC4 (no overlap with existing bookings, touching allowed):** Detecting whether `[start, end)` overlaps any `{start, end}` interval inside `bookings` requires iterating through the array and comparing cross-object bounds (`b.start < end && start < b.end`), which static schema keywords cannot express.
- **AC5 (does not save or modify state) and AC6 (UI feedback text):** An input schema only inspects the incoming arguments before the function runs; it cannot verify that the implementation has no side effects (AC5) or check the returned response format (AC6).

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | `check_room` is a read-only availability check (AC5) that does not save bookings, mutate files, or contact external servers. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading project source code in the repository has no side effects and exposes no credentials, so the agent can safely inspect the logic. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | Changing the 120-minute business rule (AC2) just to satisfy a user's 3-hour request corrupts the application specification and breaks the test suite. |
| A4 | run `npm test` in `week-08/app` | allow | Running the local unit test suite executes deterministic checks inside the project without altering tracked code or external state. |
| A5 | run `git reset --hard` to undo its own last three edits | block | `git reset --hard` permanently wipes uncommitted working-tree and staged changes without confirmation, risking irreversible loss of developer work. |
| A6 | `git commit` its change on the `week-09` branch | ask | Committing on the `week-09` feature branch is local and reversible, but requires human approval to review the staged diff and commit message first. |
| A7 | `git push` to `main` | block | Pushing directly to `main` bypasses pull request review and violates the course workflow requiring all changes to stay on an open `week-09` PR. |
| A8 | send the contents of `.env` to an MCP server it found online | block | Sending `.env` contents to an untrusted external MCP server exfiltrates secret API keys and credentials, causing a critical security breach. |

## 7. Checkpoint

Before letting an agent edit anything in the repository, I would commit all current work on `week-09` to create a clean checkpoint commit (`Week 09: add model function calls for R1, R2, and R3`, SHA `75c3a30` from `git log --oneline`).

- **Command to return to the checkpoint:**
```bash
git reset --hard 75c3a30
```
- **What that command throws away:** It permanently discards all uncommitted modifications in the working directory and staging area (`git index`) as well as any commits created on the current branch after `75c3a30` (if the agent also created new untracked files, running `git clean -fd` alongside it removes those untracked files and directories too).

## 8. Checker output

Paste the whole output of your last `python tests/check_tool.py`, unedited.

```
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None — all 30 checks (`D1–D6`, `S01–S12`, `F1–F7`, and `L1–L5`) pass with 0 FAIL and 0 ERROR.

## 10. Conclusion (80–150 words)

This lab clarified the strict boundary between the input schema, the language model, and the canBook function. The JSON Schema enforces structural shape and static per-field bounds: adding additionalProperties: false and nested required rules caught malformed calls like S05 ("room": "204") and S08 (missing booking end), while type and range rules rejected S03, S06, S07, S09, and S10. However, the schema cannot evaluate relational business rules like AC1 (start < end, start > now), AC2 (end - start <= 120), AC3 (blocked), or AC4 (interval overlap). The model bridges natural language and the schema: in R2 it properly called check_room despite the room being blocked and the 150-minute duration so canBook could return Unavailable, whereas in R3 it asked a clarifying question instead of hallucinating missing required fields. Finally, agent governance requires blocking destructive or unsafe actions like A3, A5, A7, and A8.
