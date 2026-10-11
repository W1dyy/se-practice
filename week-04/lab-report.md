# Lab Report 04

## §3-5 Findings
* **Use Case:** The AI missed linking rule R4. I corrected this by changing to `<<include>>` and adding the required `'why: R4` comment directly above the line.
* **Class Diagram:** The AI created `BookingService`. I removed it because the class diagram must only contain domain concepts. I moved R1 and R2 into a PlantUML note, as R2 cannot be a multiplicity.
* **Sequence Diagram:** The AI nested the overlap check inside the database save call and used square brackets for `alt` guards. I moved validation before `alt` and removed square brackets.

## §6 Critique
1. **Missing R1 in Activity/Sequence:** (AI output lacked duration checks). *Verdict: Accept.* Added a self-call to BookingService to validate duration.
2. **Unjustified Service classes in Domain Model:** *Verdict: Accept.* Removed `BookingService` from Class diagram.
3. **Missing R4 inclusion reason:** *Verdict: Accept.* Added `'why: R4 - A successful booking produces a confirmation` to the Use Case diagram.

## §7 Consistency
| Rule/Story | Use Case | Class | Sequence |
|---|---|---|---|
| R1 | N/A | Note on Booking | BookingService self-call |
| R2 | N/A | Note on Booking | checkOverlap message |
| R3 | N/A | Room.isBlocked attr | checkRoomBlocked msg |
| R4 | Produce confirmation | N/A | confirmation reply msg |

## §8 Change Log
* **Use Case:** Changed extend to include and added `'why: R4` annotation.
* **Class:** Deleted `BookingService`, added note for R1/R2 constraints.
* **Sequence:** Refactored alternative (`alt`) block to ensure validation happens *before* save action.

## §9 Checker Output
Paste the output from the checker here before committing!