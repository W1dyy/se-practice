import { test, expect } from 'vitest';
import { canBook } from './booking';

const fixture = () => ({ now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] });

test('T01 AC4: The existing interval ends at 660, so no occupied minute is shared.', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
});

test('T02 AC1: Start equals the supplied current time; it must be strictly later.', () => {
  expect(canBook({ ...fixture(), start: 540, end: 570 })).toBe(false);
});

test('T03 AC1: Equal endpoints give an empty interval.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 720 })).toBe(false);
});

test('T04 AC1: The end precedes the start.', () => {
  expect(canBook({ ...fixture(), start: 750, end: 720 })).toBe(false);
});

test('T05 AC1: The end exceeds the inclusive 1440 day boundary.', () => {
  expect(canBook({ ...fixture(), start: 1380, end: 1441 })).toBe(false);
});

test('T06 AC2: The duration is exactly 120 minutes, which is permitted.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 840 })).toBe(true);
});

test('T07 AC2: The duration is 121 minutes, exceeding the cap by one.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 841 })).toBe(false);
});

test('T08 AC4: The request ends where the existing booking starts, sharing no occupied time.', () => {
  expect(canBook({ ...fixture(), start: 570, end: 600 })).toBe(true);
});

test('T09 AC4: Both occupy minutes from 630 to 660.', () => {
  expect(canBook({ ...fixture(), start: 630, end: 690 })).toBe(false);
});

test('T10 AC4: The request contains the entire existing booking.', () => {
  expect(canBook({ ...fixture(), start: 570, end: 690 })).toBe(false);
});

test('T11 AC4: The request lies inside the occupied interval.', () => {
  expect(canBook({ ...fixture(), start: 615, end: 645 })).toBe(false);
});

test('T12 AC4: Identical intervals share their entire duration.', () => {
  expect(canBook({ ...fixture(), start: 600, end: 660 })).toBe(false);
});

test('T13 AC3: The blocked flag overrides an otherwise valid touching request.', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720, blocked: true })).toBe(false);
});

test('T14 AC4: With no existing bookings there can be no overlap.', () => {
  expect(canBook({ ...fixture(), start: 630, end: 690, bookings: [] })).toBe(true);
});

test('X1 AC1: The end is exactly the inclusive day limit and duration is 60.', () => {
  expect(canBook({ ...fixture(), start: 1380, end: 1440 })).toBe(true);
});

test('X2 AC1: A negative start is outside the day even when now is earlier.', () => {
  expect(canBook({ ...fixture(), start: -1, end: 30, now: -2, bookings: [] })).toBe(false);
});

test('AC5: an Available decision leaves booking data unchanged', () => {
  const { bookings, ...rest } = fixture();
  const before = structuredClone(bookings);
  expect(canBook({ ...rest, start: 660, end: 720, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});

test('PAST AC1: start before now is rejected', () => {
  expect(canBook({ ...fixture(), start: 539, end: 570 })).toBe(false);
});

test('REPEAT AC5: non-touching checks are pure and repeatable', () => {
  const { bookings, ...rest } = fixture();
  const before = structuredClone(bookings);
  const request = { ...rest, start: 720, end: 780, bookings };
  expect(canBook(request)).toBe(true);
  expect(bookings).toEqual(before);
  expect(canBook(request)).toBe(true);
  expect(bookings).toEqual(before);
});

test('REJECTED AC5: an overlapping request preserves data', () => {
  const { bookings, ...rest } = fixture();
  const before = structuredClone(bookings);
  expect(canBook({ ...rest, start: 630, end: 690, bookings })).toBe(false);
  expect(bookings).toEqual(before);
});
