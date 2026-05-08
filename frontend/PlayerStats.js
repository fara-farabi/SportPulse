import { useState } from 'react';

export default function PlayerStats() {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);

  async function fetchStats() {
    const res = await fetch(`http://localhost:5000/api/player/${id}`);
    const json = await res.json();
    setData(json);
  }

  return (
    <div>
      <input placeholder="Player ID" onChange={e => setId(e.target.value)} />
      <button onClick={fetchStats}>Show Stats</button>

      {data && (
        <div>
          <h3>{data.strPlayer}</h3>
          <p>Nationality: {data.strNationality}</p>
          <p>Team: {data.strTeam}</p>
        </div>
      )}
    </div>
  );
}