export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}

export type BookingForm = { now: string; start: string; end: string; endOfDay: boolean };
export type RoomState = { blocked: boolean; bookings: { start: number; end: number }[] };
export type CheckOutcome = { error: string; result: boolean | null };

// Parses an "HH:MM" value from <input type="time"> into minutes since midnight.
const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

// The page's whole availability decision: validate the form, parse the times, then ask canBook.
// Pure: reads `room` but never changes it. A validation error always comes with result: null,
// so the page never shows an error and a verdict together.
export function checkRequest(form: BookingForm, room: RoomState): CheckOutcome {
  if (!form.start || !form.now || (!form.end && !form.endOfDay)) {
    return { error: 'Fill in the current time, the start and the end.', result: null };
  }
  const start = toMinutes(form.start);
  const end = form.endOfDay ? 1440 : toMinutes(form.end);
  const now = toMinutes(form.now);
  if (!(start < end)) {
    return { error: 'The end time must be after the start time.', result: null };
  }
  const result = canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });
  return { error: '', result };
}
