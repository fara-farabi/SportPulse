import React, { useState } from 'react';

const API = 'http://localhost:3001';

export default function H2H() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!team1.trim() || !team2.trim()) { setError('Please enter both team names'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API}/api/h2h?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`);
      const data = await res.json();
      if (data.success && data.summary.total > 0) setResult(data);
      else setError('No matches found between these teams. Try: Arsenal, Chelsea, Liverpool, Manchester City');
    } catch { setError('Error fetching data.'); }
    setLoading(false);
  };

  const suggestions = ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham', 'Real Madrid', 'Barcelona'];

  return (
    <div className="page">
      <h1 className="page-title">⚔️ Head to Head</h1>
      <div className="card">
        <div className="flex" style={{ marginBottom: 12 }}>
          <input placeholder="Team 1 (e.g. Arsenal)" value={team1}
            onChange={e => setTeam1(e.target.value)} style={{ flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <span style={{ color: '#f0c040', fontWeight: 800, fontSize: 20 }}>VS</span>
          <input placeholder="Team 2 (e.g. Chelsea)" value={team2}
            onChange={e => setTeam2(e.target.value)} style={{ flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="btn" onClick={search}>Search</button>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#666, marginRight: 8' }}>Quick select: </span>
          {suggestions.map(s => (
            <button key={s} className="btn-ghost"
              style={{ margin: '3px', fontSize: 12, padding: '4px 10px' }}
              onClick={() => !team1 ? setTeam1(s) : setTeam2(s)}>{s}</button>
          ))}
        </div>
        {error && <div style={{ color: '#ff3b30', marginTop: 12 }}>{error}</div>}
      </div>

      {loading && <div className="loading">Searching matches...</div>}

      {result && (
        <>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            <div className="stat-box">
              <div className="num" style={{ color: '#30d158' }}>{result.summary.team1Wins}</div>
              <div className="label">{result.team1} Wins</div>
            </div>
            <div className="stat-box">
              <div className="num" style={{ color: '#888' }}>{result.summary.draws}</div>
              <div className="label">Draws</div>
            </div>
            <div className="stat-box">
              <div className="num" style={{ color: '#ff3b30' }}>{result.summary.team2Wins}</div>
              <div className="label">{result.team2} Wins</div>
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="stat-box">
              <div className="num">{result.summary.team1Goals}</div>
              <div className="label">{result.team1} Goals Scored</div>
            </div>
            <div className="stat-box">
              <div className="num">{result.summary.team2Goals}</div>
              <div className="label">{result.team2} Goals Scored</div>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3a', fontWeight: 700 }}>
              {result.summary.total} Matches Found
            </div>
            <table>
              <thead>
                <tr><th>Date</th><th>Home</th><th>Score</th><th>Away</th><th>League</th><th>Stadium</th></tr>
              </thead>
              <tbody>
                {result.matches.map(m => (
                  <tr key={m.id}>
                    <td style={{ color: '#888' }}>{m.date}</td>
                    <td style={{ fontWeight: 600 }}>{m.homeTeam}</td>
                    <td style={{ color: '#f0c040', fontWeight: 800, textAlign: 'center' }}>{m.homeScore} - {m.awayScore}</td>
                    <td style={{ fontWeight: 600 }}>{m.awayTeam}</td>
                    <td><span className="tag tag-yellow">{m.league}</span></td>
                    <td style={{ color: '#666', fontSize: 12 }}>{m.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}