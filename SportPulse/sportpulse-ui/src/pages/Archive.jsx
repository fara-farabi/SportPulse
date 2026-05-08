import React, { useState, useEffect } from 'react';

const API = '';;

export default function Archive() {
  const [matches, setMatches] = useState([]);
  const [cricket, setCricket] = useState([]);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('football');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/football/matches`).then(r => r.json()),
      fetch(`${API}/api/cricket/matches`).then(r => r.json()),
    ]).then(([f, c]) => {
      setMatches(f.data || []);
      setCricket(c.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const footballFiltered = matches.filter(m =>
    !search ||
    m.homeTeam?.toLowerCase().includes(search.toLowerCase()) ||
    m.awayTeam?.toLowerCase().includes(search.toLowerCase()) ||
    m.league?.toLowerCase().includes(search.toLowerCase()) ||
    m.stadium?.toLowerCase().includes(search.toLowerCase())
  );

  const cricketFiltered = cricket.filter(m =>
    !search ||
    m.team1?.toLowerCase().includes(search.toLowerCase()) ||
    m.team2?.toLowerCase().includes(search.toLowerCase()) ||
    m.tournament?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title">📁 Match Archive</h1>
      <div className="card">
        <div className="flex">
          <input placeholder="Search teams, leagues, stadiums..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <button className={sport === 'football' ? 'btn' : 'btn-ghost'} onClick={() => setSport('football')}>⚽ Football ({matches.length})</button>
          <button className={sport === 'cricket' ? 'btn' : 'btn-ghost'} onClick={() => setSport('cricket')}>🏏 Cricket ({cricket.length})</button>
          {search && <button className="btn-ghost" onClick={() => setSearch('')}>✕ Clear</button>}
        </div>
      </div>
      {loading ? <div className="loading">Loading archive...</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3a', fontWeight: 700 }}>
            {sport === 'football' ? `⚽ ${footballFiltered.length} Football Matches` : `🏏 ${cricketFiltered.length} Cricket Matches`}
          </div>
          {sport === 'football' && (
            <table>
              <thead>
                <tr><th>Date</th><th>League</th><th>Home</th><th>Score</th><th>Away</th><th>Stadium</th></tr>
              </thead>
              <tbody>
                {footballFiltered.map(m => (
                  <tr key={m.id}>
                    <td style={{ color: '#888', whiteSpace: 'nowrap' }}>{m.date}</td>
                    <td><span className="tag tag-yellow">{m.league}</span></td>
                    <td style={{ fontWeight: 600 }}>{m.homeTeam}</td>
                    <td style={{ color: '#f0c040', fontWeight: 800, textAlign: 'center' }}>{m.homeScore} - {m.awayScore}</td>
                    <td style={{ fontWeight: 600 }}>{m.awayTeam}</td>
                    <td style={{ color: '#666', fontSize: 12 }}>{m.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {sport === 'cricket' && (
            <table>
              <thead>
                <tr><th>Tournament</th><th>Team 1</th><th>Score</th><th>Team 2</th><th>Score</th><th>Stadium</th></tr>
              </thead>
              <tbody>
                {cricketFiltered.map(m => (
                  <tr key={m.id}>
                    <td><span className="tag tag-yellow">{m.tournament?.substring(0,30)}</span></td>
                    <td style={{ fontWeight: 600 }}>{m.team1}</td>
                    <td style={{ color: '#f0c040', fontWeight: 800 }}>{m.team1Score}</td>
                    <td style={{ fontWeight: 600 }}>{m.team2}</td>
                    <td style={{ color: '#f0c040', fontWeight: 800 }}>{m.team2Score}</td>
                    <td style={{ color: '#666', fontSize: 12 }}>{m.stadium?.substring(0,30)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}