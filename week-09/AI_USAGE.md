# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | Gemini 2.5 Pro | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Gemini | Gemini 2.5 Pro | Reviewing JSON Schema constraints and drafting report explanations | tool/check_room.json, lab-report.md |

**I wrote `tool/check_room.json` myself:** yes

**I used an AI to explain a JSON Schema keyword or a check:** yes
Used Gemini 2.5 Pro to confirm how `additionalProperties: false` and nested `required` arrays inside `bookings.items` interact with cases S05 and S08 in `check_tool.py`.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
None — I verified every constraint in `tool/check_room.json` against `tests/check_tool.py` and checked all 30 test cases locally.

Signed: Amir Bakhytzhan
Date: 2026-11-15
