# Lab Report: Requirements Engineering with AI

## 1. AI Assistant & Model Info
* **Assistant / Platform:** Google Gemini
* **Exact Model Name:** `gemini-2.5-flash`

---

## 2. Unedited AI Output for User Stories

### Prompt Used (Verbatim)
> You are a requirements analyst. For the Smart Campus study room booking system, identify Student and Administrator goals. Write 6 to 8 user stories using: As a [role], I want [goal], so that [reason]. Add a priority and one assumption to each story. Stay within the supplied scenario.

### Original Raw Output
1. As a Student, I want to view room availability for specific dates and times, so that I can find a free study space that fits my schedule. (Priority: High, Assumption: Availability updates in real-time)
2. As a Student, I want to book an available study room for a time slot, so that I can reserve a space for study. (Priority: High, Assumption: Bookings start in the future)
3. As a Student, I want to cancel my reservation, so that I can release the room when I no longer need it. (Priority: Medium, Assumption: Cancellation frees room immediately)
4. As a Student, I want to receive confirmation when I book or cancel a room, so that I have proof of my booking. (Priority: Low, Assumption: Confirmations are sent in-app/email without SMS)
5. As an Administrator, I want to block a study room, so that I can perform room maintenance. (Priority: High, Assumption: Blocked rooms reject booking attempts)
6. As an Administrator, I want to unblock a study room, so that students can book it again. (Priority: Medium, Assumption: Unblocking restores availability)
7. As an Administrator, I want to review room usage reports, so that I can analyze utilization. (Priority: Medium, Assumption: Reports aggregate historical logs)

---

## 3. Review & Revisions of User Stories

* **US-01:** Kept. Valid Student goal mapped to UC-01.
* **US-02:** Kept. Clarified scope boundaries to reference rules R1 and R2 explicitly.
* **US-03:** Kept. Mapped to UC-03.
* **US-04:** Kept. Scope verified against out-of-scope rules (no SMS/Push notifications).
* **US-05:** Kept. Administrator action mapped to UC-04.
* **US-06:** Kept. Administrative unblock function mapped to UC-04.
* **US-07:** Kept. Administrative usage reporting mapped to UC-05.

---

## 4. Unedited AI Output for Acceptance Criteria

### Prompt Used (Verbatim)
> For each selected story, write 3 to 5 acceptance criteria in Given, When, Then form. Include successful behavior, validation, and an error or alternative case. Apply these rules: bookings must be in the future, maximum duration is two hours, rooms cannot overlap, and blocked rooms cannot be booked. List assumptions before the criteria.

### Original Raw Output
*Generated criteria for US-02, US-03, and US-05 covering Happy Paths (AC-01, AC-06, AC-08), Rule Violations (AC-02, AC-03, AC-04, AC-05), and Failure Modes (AC-07, AC-09).*

---

## 5. Review & Decisions for Acceptance Criteria

* **Rule R2 Decision:** Exactly 2 hours is permitted ($\text{Duration} \le 2\text{ hours}$).
* **Rule R3 Decision:** A booking ending at $T$ and a booking starting at $T$ do not overlap.
* **Review Result:** All criteria AC-01 through AC-09 adhere strictly to Given/When/Then structure and test concrete domain behavior without referring to screens, databases, or UI components.

---

## 6. Unedited AI Output for PlantUML Diagram

### Prompt Used (Verbatim)
> Create PlantUML code for a UML use-case diagram of the Smart Campus study room booking system. Place Student and Administrator outside the system boundary. Include View availability, Book room, Cancel booking, Block or unblock room, Review usage, and Send confirmation. Show only justified actor associations. Use include or extend only when the relationship is clear. Do not model screens, databases, or internal classes.

---

## 7. Review of Use-Case Diagram & Associations

* **Actor Association Review:** Initial AI drafts often connect actors directly to `Send confirmation` (UC-06). In our corrected diagram, `UC-06` is purely automated and included by `UC-02` (Book room) and `UC-03` (Cancel booking). Neither `Student` nor `Administrator` directly triggers `UC-06`.
* **System Boundary Review:** Exactly two human actors (`Student`, `Administrator`) sit outside the boundary.
* **Scope Review:** No screens, UI components, databases, or external communication services (SMS/Push) are modeled.

---

## 8. Traceability Analysis & Gap Analysis

* **Gaps Identified:**
  1. **UC-01 (View availability):** Covered by `US-01`. No dedicated AC was generated due to the 3-story limit.
  2. **UC-05 (Review usage):** Covered by `US-07`. No dedicated AC was generated due to the 3-story limit.
  3. **UC-06 (Send confirmation):** Covered by `US-04`. Function is executed automatically via `<<include>>` relationships from `UC-02` and `UC-03`.

---

## 9. Checker Verification & Execution Results

* **`python tests/check_requirements.py` Exit Code:** 0
* **`python tests/validate_submission.py` Exit Code:** 0
* **Total Automated Checks Passed:** 23 / 23