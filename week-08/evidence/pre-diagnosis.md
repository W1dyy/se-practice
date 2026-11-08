Hypotheses recorded by Codex before the independent diagnosis agents; not claimed as the student's unaided hypotheses.
BUG-A: T01 request 660-720, now 540, blocked false, bookings [{start:600,end:660}] expects true but returns false. app/src/booking.ts line 13 uses <= and >=, including endpoint equality. AC4 permits touching.
BUG-B: REPEAT request 720-780 on the same fixture returns true but adds {start:720,end:780}. Line 16 bookings.push mutates the caller's array, contrary to AC5.
The original AC5 case uses 660-720 and fails at toBe(true) before data equality; BUG-A masks its ability to observe BUG-B. REPEAT supplies independent evidence for mutation.
