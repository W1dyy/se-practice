import { test, expect } from 'vitest';
import { checkRoom } from './booking';
import type { Room } from './rooms';

// A fixed catalog for the tests, independent of the page's ROOMS. Expected values come from
// the requirements (AC1–AC5, F1–F5), not from what the code returns.
const catalog = (): Room[] => [
  { id: 'r-small', name: 'Small', capacity: 6, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r-mid', name: 'Middle', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'r-lab', name: 'Lab', capacity: 20, equipment: ['projector', 'computers'], blocked: false, bookings: [{ start: 630, end: 690 }] },
  { id: 'r-closed', name: 'Closed', capacity: 40, equipment: ['projector', 'whiteboard', 'computers'], blocked: true, bookings: [] },
];
const NOW = 540; // 09:00

test('F3 AC3: a blocked room with no bookings is never available', () => {
  expect(checkRoom(catalog(), 'r-closed', { start: 900, end: 960, now: NOW })).toBe(false);
});

test('F5: the same times give different results for two rooms, from each room\'s own bookings', () => {
  const rooms = catalog();
  expect(checkRoom(rooms, 'r-small', { start: 600, end: 660, now: NOW })).toBe(false);
  expect(checkRoom(rooms, 'r-mid', { start: 600, end: 660, now: NOW })).toBe(true);
});

test('B3 AC4: touching the chosen room\'s booking at its end is available', () => {
  expect(checkRoom(catalog(), 'r-lab', { start: 690, end: 750, now: NOW })).toBe(true);
});

test('B3 AC4: ending exactly where the chosen room booking starts is available', () => {
  expect(checkRoom(catalog(), 'r-lab', { start: 570, end: 630, now: NOW })).toBe(true);
});

test('B4 AC4: overlapping the chosen room\'s booking by one minute is rejected', () => {
  expect(checkRoom(catalog(), 'r-lab', { start: 689, end: 750, now: NOW })).toBe(false);
});

test('AC2 B1: exactly 120 minutes in a free room is available through checkRoom', () => {
  expect(checkRoom(catalog(), 'r-mid', { start: 720, end: 840, now: NOW })).toBe(true);
});

test('AC2 B2: 121 minutes in a free room is rejected through checkRoom', () => {
  expect(checkRoom(catalog(), 'r-mid', { start: 720, end: 841, now: NOW })).toBe(false);
});

test('AC1: a request that starts before now is rejected through checkRoom', () => {
  expect(checkRoom(catalog(), 'r-mid', { start: 500, end: 560, now: NOW })).toBe(false);
});

test('an unknown room id is not available', () => {
  expect(checkRoom(catalog(), 'no-such-room', { start: 900, end: 960, now: NOW })).toBe(false);
});

test('AC5: checkRoom leaves the catalog and every room\'s bookings unchanged', () => {
  const rooms = catalog();
  const before = structuredClone(rooms);
  checkRoom(rooms, 'r-mid', { start: 700, end: 760, now: NOW });
  checkRoom(rooms, 'r-small', { start: 600, end: 660, now: NOW });
  expect(rooms).toEqual(before);
});
