// The room catalog: data only, no rules. Every room and booking is fictional.
// Times are minutes after midnight (600 = 10:00).

export type Interval = { start: number; end: number };

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const EQUIPMENT = ['projector', 'whiteboard', 'computers', 'video-call'];

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 30, equipment: ['projector', 'whiteboard', 'video-call'], blocked: false, bookings: [] },
  { id: 'c310', name: 'Lab C-310', capacity: 20, equipment: ['computers', 'projector'], blocked: false, bookings: [{ start: 660, end: 780 }] },
  { id: 'd012', name: 'Seminar D-012', capacity: 8, equipment: ['whiteboard'], blocked: true, bookings: [] },
];
