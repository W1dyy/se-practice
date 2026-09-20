# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Amir Bakhytzhans
**Group:** Information Systems
**Date:** September 20, 2026

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-5.1 |
| Implementation language | Python |
| Date of the runs | 2026-09-20 |

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Assumed hardcoded sample list `[75, 88, 92, 60, 54]` executed via global print script.
2. Assumed function signature `analyze_student_marks(marks)` without `pass_mark` parameter.
3. Assumed returning dictionary with keys `average`, `highest`, `lowest`, omitting `pass_rate`.

**Questions it should have asked and did not:**

1. What target function name, parameter signature, and default pass mark are required?
2. What specific keys should be included in the return structure, and how should invalid inputs be handled?

**Is the function named `analyze_marks` with the required signature?** no — called `analyze_student_marks(marks)`

**First impression before testing**: The generated code is a generic introductory script that will immediately fail the harness because the required function name `analyze_marks` is missing.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

**What B fixed compared to A:**

1. Specified exact function name `analyze_marks` and default parameter signature `pass_mark=50`.
2. Mandated exact dictionary return structure (`average`, `highest`, `lowest`, `pass_rate`) and error handling with `ValueError`.

**What B still leaves open:**

1. Whether string representations of numbers (e.g., `"60"`) or booleans should be coerced or strictly rejected as non-numeric.
2. Whether floating-point values should be rounded or left as raw unrounded floats.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:**
1. Inputs must strictly be `int` or `float` instances (string numbers like `"60"` are rejected).
2. `pass_rate` is expressed as a percentage rounded to 2 decimal places.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

**What I deliberately added that A, B and C did not have:**

1. Explicit type check constraint excluding booleans (`bool`) and numeric strings (`str`) to avoid implicit casting.
2. Explicit rounding instruction (`round(rate, 2)`) for percentage calculation consistency.
3. Explicit specification of pass condition (`mark >= pass_mark`) to prevent inclusive/exclusive boundary errors.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The primary ambiguity was whether non-numeric validation allowed string numbers like `"60"` to be coerced into floats via `float("60")`, and whether `pass_rate` should be rounded to 2 decimal places or left as unrounded float. In Prompt D, I resolved this by explicitly mandating `type(m) in (int, float)` (strictly rejecting strings/booleans) and specifying `round(rate, 2)`.

---

## 6. Test results — the evidence

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | FAIL | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 5/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1-6 | Module defined no function named `analyze_marks` (`load_function` raised ERROR). |
| B | 5 | Returned `{'average': 50.0, 'highest': 60.0, 'lowest': 40.0, 'pass_rate': 50.0}` instead of raising ValueError. |

### Pasted terminal output — all four runs

**Prompt A**

```text
========================================================================
analyze_marks harness — code/prompt_a.py
tolerance for numeric comparison: 0.01
========================================================================
ERROR: code/prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
