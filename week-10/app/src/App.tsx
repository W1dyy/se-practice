import { checkRequest } from './booking';
import { useState } from 'react';

// The availability decision (time parsing, validation, verdict) lives in src/booking.ts as
// checkRequest(form, room), a pure function covered by src/booking.test.ts. This component only
// holds form state and renders the outcome.

type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
];

const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    const outcome = checkRequest({ now, start, end, endOfDay }, { blocked, bookings: room.bookings });
    setError(outcome.error);
    setResult(outcome.result);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <div className="row">
        <label>Room
          <select value={roomId} onChange={e => setRoomId(e.target.value)}>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
        <label className="inline"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} /> Room blocked</label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
      )}
      <h2>Existing bookings</h2>
      <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
    </main>
  );
}
