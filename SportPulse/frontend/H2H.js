import { useState } from 'react';

export default function H2H() {
  const [result, setResult] = useState(null);
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');

  async function handleSearch() {
    const res = await fetch(`http://localhost:5000/api/h2h/${t1}/${t2}`);
    const data = await res.json();
    setResult(data);
  }

  return (
    <div>
      <input placeholder="Team A" onChange={e => setT1(e.target.value)} />
      <input placeholder="Team B" onChange={e => setT2(e.target.value)} />
      <button onClick={handleSearch}>Search H2H</button>

      {result && (
        <ul>
          {result.map(match => (
            <li key={match.idEvent}>
              {match.dateEvent} — {match.strEvent}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}