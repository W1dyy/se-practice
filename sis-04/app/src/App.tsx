import { useState } from 'react';
import { ROOMS, EQUIPMENT } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { fmt, readTimes } from './time';

// The page: form state and rendering only. Room data comes from rooms.ts, the filter rule from
// filter.ts, the availability rule from booking.ts (checkRoom -> canBook).

export default function App() {
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [checked, setChecked] = useState(false);

  const matches = filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment });
  // The selected room is always one of the matches, so a filter can never leave a stale room (F4, F5).
  const room = matches.find(r => r.id === roomId) ?? matches[0];

  // Derived on every render after the first check: switching rooms refreshes the verdict (F5).
  const times = readTimes({ now, start, end, endOfDay });
  const error = checked && 'error' in times ? times.error : '';
  const result = checked && room && !('error' in times) ? checkRoom(ROOMS, room.id, times) : null;

  const toggle = (item: string) =>
    setEquipment(list => list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <fieldset className="filters">
        <legend>What do you need?</legend>
        <label>Attendees<input type="number" min="1" value={attendees} onChange={e => setAttendees(e.target.value)} /></label>
        <div className="equipment">
          {EQUIPMENT.map(item => (
            <label key={item} className="inline">
              <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggle(item)} /> {item}
            </label>
          ))}
        </div>
      </fieldset>

      {matches.length === 0 ? (
        <p className="empty" role="status">
          No room fits {attendees || 0} attendees{equipment.length ? ` with ${equipment.join(' + ')}` : ''}. Lower the number of attendees or remove an equipment item.
        </p>
      ) : (
        <>
          <p className="count">{matches.length} of {ROOMS.length} rooms match.</p>
          <div className="row">
            <label>Room
              <select value={room.id} onChange={e => setRoomId(e.target.value)}>
                {matches.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.capacity} seats{r.blocked ? ' · blocked' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
            <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
            <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
            <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
          </div>
          <button onClick={() => setChecked(true)}>Check availability</button>
          {error && <p className="error" role="alert">{error}</p>}
          {result !== null && (
            <p className={`result ${result ? 'available' : 'unavailable'}`} role="status">
              {room.name}: {result ? 'Available' : 'Unavailable'}{room.blocked ? ' (room is blocked)' : ''}
            </p>
          )}

          <h2>{room.name}</h2>
          <p className="meta">{room.capacity} seats · {room.equipment.join(', ')}{room.blocked ? ' · blocked' : ''}</p>
          <h3>Existing bookings</h3>
          <ul>{room.bookings.length ? room.bookings.map(b => <li key={`${b.start}-${b.end}`}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
        </>
      )}
    </main>
  );
}
