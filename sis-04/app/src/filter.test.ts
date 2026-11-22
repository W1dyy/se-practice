import { test, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

// Fixed catalog, independent of the page's ROOMS. Expected ids are read from F1/F2, not from the code.
const catalog = (): Room[] => [
  { id: 'r-small', name: 'Small', capacity: 6, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r-mid', name: 'Middle', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'r-lab', name: 'Lab', capacity: 20, equipment: ['projector', 'computers'], blocked: false, bookings: [{ start: 630, end: 690 }] },
  { id: 'r-closed', name: 'Closed', capacity: 40, equipment: ['projector', 'whiteboard', 'computers'], blocked: true, bookings: [] },
];
const ids = (rooms: Room[]) => rooms.map(r => r.id);

test('F1: only rooms with capacity >= 15 attendees remain', () => {
  expect(ids(filterRooms(catalog(), { attendees: 15, equipment: [] }))).toEqual(['r-lab', 'r-closed']);
});

test('B5 F1: capacity exactly equal to attendees (10) includes the room', () => {
  expect(ids(filterRooms(catalog(), { attendees: 10, equipment: [] }))).toEqual(['r-mid', 'r-lab', 'r-closed']);
});

test('B6 F1: capacity one below attendees (11 vs 10) excludes the room', () => {
  expect(ids(filterRooms(catalog(), { attendees: 11, equipment: [] }))).toEqual(['r-lab', 'r-closed']);
});

test('F2: a room must have ALL selected items; projector + whiteboard leaves only rooms with both', () => {
  expect(ids(filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['r-mid', 'r-closed']);
});

test('F2: a room with only one of the two required items is excluded', () => {
  const result = ids(filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'computers'] }));
  expect(result).not.toContain('r-mid');
  expect(result).toEqual(['r-lab', 'r-closed']);
});

test('F2: an item that no room has (video-call) leaves no room', () => {
  expect(filterRooms(catalog(), { attendees: 1, equipment: ['video-call'] })).toEqual([]);
});

test('F4: a filter no room satisfies returns an empty list (the page shows the empty state)', () => {
  expect(filterRooms(catalog(), { attendees: 50, equipment: [] })).toEqual([]);
});

test('F1 F2: filterRooms does not change the catalog it reads', () => {
  const rooms = catalog();
  const before = structuredClone(rooms);
  filterRooms(rooms, { attendees: 12, equipment: ['projector'] });
  expect(rooms).toEqual(before);
});

test('INT F3: filterRooms then checkRoom on each match - the blocked match is never available', () => {
  const rooms = catalog();
  const matches = filterRooms(rooms, { attendees: 8, equipment: ['projector'] });
  expect(ids(matches)).toEqual(['r-mid', 'r-lab', 'r-closed']);
  const verdicts = matches.map(r => checkRoom(rooms, r.id, { start: 600, end: 660, now: 540 }));
  expect(verdicts).toEqual([true, false, false]);
});
