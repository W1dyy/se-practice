| ID | Candidate / changed input | Expected | AC | Reason (AI-authored, student review pending) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | The existing interval ends at 660, so no occupied minute is shared. |
| T02 | 540-570 | false | AC1 | Start equals the supplied current time; it must be strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints give an empty interval. |
| T04 | 750-720 | false | AC1 | The end precedes the start. |
| T05 | 1380-1441 | false | AC1 | The end exceeds the inclusive 1440 day boundary. |
| T06 | 720-840 | true | AC2 | The duration is exactly 120 minutes, which is permitted. |
| T07 | 720-841 | false | AC2 | The duration is 121 minutes, exceeding the cap by one. |
| T08 | 570-600 | true | AC4 | The request ends where the existing booking starts, sharing no occupied time. |
| T09 | 630-690 | false | AC4 | Both occupy minutes from 630 to 660. |
| T10 | 570-690 | false | AC4 | The request contains the entire existing booking. |
| T11 | 615-645 | false | AC4 | The request lies inside the occupied interval. |
| T12 | 600-660 | false | AC4 | Identical intervals share their entire duration. |
| T13 | 660-720, blocked = true | false | AC3 | The blocked flag overrides an otherwise valid touching request. |
| T14 | 630-690, bookings = [] | true | AC4 | With no existing bookings there can be no overlap. |
| X1 | 1380-1440 | true | AC1 | The end is exactly the inclusive day limit and duration is 60. |
| X2 | -1-30, now = -2, bookings = [] | false | AC1 | A negative start is outside the day even when now is earlier. |
| AC5 | 660-720, compare with a deep copy | true, data unchanged | AC5 | Checking availability must not add, remove, or modify bookings. |
