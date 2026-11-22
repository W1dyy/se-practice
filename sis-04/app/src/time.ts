// Form helpers for <input type="time"> values. Presentation only: the booking rules stay in booking.ts.

export const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

export const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export type TimeForm = { now: string; start: string; end: string; endOfDay: boolean };

// Turns the form into minutes, or into the one message the page shows instead of a verdict.
export function readTimes(form: TimeForm):
  { error: string } | { start: number; end: number; now: number } {
  if (!form.start || !form.now || (!form.end && !form.endOfDay)) {
    return { error: 'Fill in the current time, the start and the end.' };
  }
  const start = toMinutes(form.start);
  const end = form.endOfDay ? 1440 : toMinutes(form.end);
  if (!(start < end)) return { error: 'The end time must be after the start time.' };
  return { start, end, now: toMinutes(form.now) };
}
