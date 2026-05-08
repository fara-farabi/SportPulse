import { useState } from 'react';

export default function Archive() {
  const [team, setTeam] = useState('');
  const [season, setSeason] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const res = await fetch(`http://localhost:5000/api/archive?team=${team}&season=${season}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <div>
      <input placeholder="Team" onChange={e => setTeam(e.target.value)} />
      <input placeholder="Season (YYYY)" onChange={e => setSeason(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {results.map(item => (
        <div key={item.idEvent}>{item.dateEvent} — {item.strEvent}</div>
      ))}
    </div>
  );
}