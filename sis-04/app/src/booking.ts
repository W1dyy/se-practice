import type { Room } from './rooms';

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
  return true;
}

// The availability of one room from the catalog: canBook with THAT room's own blocked flag and
// bookings (F3, F5). An unknown id is not available. Reads the catalog, never changes it (AC5).
export function checkRoom(rooms: Room[], roomId: string,
                          request: { start: number; end: number; now: number }): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}
