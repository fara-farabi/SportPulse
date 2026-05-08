import React, { useState, useEffect } from 'react';

const API = 'http://localhost:3001';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [league, setLeague] = useState('premier-league');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/standings/${league}`)
      .then(r => r.json())
      .then(d => { setStandings(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [league]);

  const leagues = [
    { id: 'premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
    { id: 'la-liga', label: '🇪🇸 La Liga' },
    { id: 'champions-league', label: '🌍 Champions League' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">🏆 League Standings</h1>
      <div className="flex" style={{ marginBottom: 24 }}>
        {leagues.map(l => (
          <button key={l.id} className={league === l.id ? 'btn' : 'btn-ghost'}
            onClick={() => setLeague(l.id)}>{l.label}</button>
        ))}
      </div>
      {loading ? <div className="loading">Loading standings...</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
            </thead>
            <tbody>
              {standings.map(row => (
                <tr key={row.position}>
                  <td style={{ color: '#888' }}>{row.position}</td>
                  <td style={{ fontWeight: 700 }}>{row.team}</td>
                  <td>{row.played}</td>
                  <td style={{ color: '#30d158' }}>{row.won}</td>
                  <td style={{ color: '#888' }}>{row.drawn}</td>
                  <td style={{ color: '#ff3b30' }}>{row.lost}</td>
                  <td>{row.gf}</td>
                  <td>{row.ga}</td>
                  <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td><strong style={{ color: '#f0c040', fontSize: 16 }}>{row.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}