import type { Room } from './rooms';

// F1: capacity >= attendees. F2: the room has ALL the selected items (every, not some).
// Blocked rooms are NOT removed here: they stay listed and checkRoom reports them Unavailable (F3).
// Pure: returns a new array and never changes the catalog.
export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[] {
  return rooms.filter(room =>
    room.capacity >= criteria.attendees &&
    criteria.equipment.every(item => room.equipment.includes(item)));
}
