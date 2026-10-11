## Open Boundary Decisions & Assumptions
1. **Rule R2 (Duration Boundary):** Exactly two hours is permitted ($\text{Duration} \le 2\text{ hours}$).
2. **Rule R3 (Overlap Boundary):** A booking ending at time $T$ and another starting at time $T$ do **not** overlap (adjacent slots are valid).

---

## Story: US-02 (Book Room)

### AC-01: Successful Booking (Happy Path)
* **Given** room 101 is free from 14:00 to 16:00 today (in the future),
* **When** a Student submits a booking request for room 101 from 14:00 to 16:00 today,
* **Then** the system creates the reservation, confirms the status as booked, and updates availability.

### AC-02: Violation of Rule R1 (Past Start Time)
* **Given** the current system time is 15:00,
* **When** a Student attempts to book room 101 starting at 14:00 today,
* **Then** the system rejects the booking request and displays an error stating bookings must start in the future.

### AC-03: Violation of Rule R2 (Duration Exceeds 2 Hours)
* **Given** room 101 is available from 10:00 to 14:00 tomorrow,
* **When** a Student attempts to book room 101 from 10:00 to 12:30 (2.5 hours),
* **Then** the system rejects the request and displays an error stating maximum booking duration is 2 hours.

### AC-04: Violation of Rule R3 (Overlapping Reservation)
* **Given** room 101 is already booked from 10:00 to 12:00,
* **When** a Student attempts to book room 101 from 11:30 to 13:00 on the same date,
* **Then** the system rejects the request due to a schedule overlap conflict.

### AC-05: Violation of Rule R4 (Blocked Room)
* **Given** room 102 is currently marked as blocked by an Administrator,
* **When** a Student attempts to book room 102 for a valid future time slot,
* **Then** the system rejects the request stating the room is currently out of service.

---

## Story: US-03 (Cancel Booking)

### AC-06: Successful Cancellation (Happy Path)
* **Given** a Student holds an active booking for room 101 tomorrow from 10:00 to 12:00,
* **When** the Student requests to cancel the booking,
* **Then** the system updates the booking status to canceled and immediately releases room 101 for booking by others.

### AC-07: Cancellation Failure (Non-Existent or Already Canceled)
* **Given** a reservation ID that does not exist or has already been canceled,
* **When** a Student attempts to cancel the booking,
* **Then** the system rejects the action and displays an error message that the booking cannot be found or canceled.

---

## Story: US-05 (Block or Unblock Room)

### AC-08: Successful Room Block (Happy Path)
* **Given** room 103 is currently active and unblocked,
* **When** an Administrator sets the status of room 103 to blocked,
* **Then** room 103 status changes to blocked and it is removed from student availability searches.

### AC-09: Successful Room Unblock
* **Given** room 103 is currently blocked,
* **When** an Administrator sets the status of room 103 to unblocked,
* **Then** room 103 becomes available for future bookings.