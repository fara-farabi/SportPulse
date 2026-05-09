import React, { useState, useEffect } from 'react';

export default function EditMatch() {
  const [matches, setMatches] = useState([]);
  const [cricket, setCricket] = useState([]);
  const [sport, setSport] = useState('football');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/football/matches').then(r => r.json()).then(d => setMatches(d.data || []));
    fetch('/api/cricket/matches').then(r => r.json()).then(d => setCricket(d.data || []));
  }, []);

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const startEdit = (match) => {
    setEditing(match.id);
    setForm(match);
  };

  const saveEdit = async () => {
    const endpoint = sport === 'football'
      ? `/api/admin/matches/edit/football/${editing}`
      : `/api/admin/matches/edit/cricket/${editing}`;
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.success) {
      notify('✅ Match updated successfully!');
      setEditing(null);
      if (sport === 'football') {
        setMatches(prev => prev.map(m => m.id === editing ? { ...m, ...form } : m));
      } else {
        setCricket(prev => prev.map(m => m.id === editing ? { ...m, ...form } : m));
      }
    }
  };

  const footballFiltered = matches.filter(m =>
    !search || m.homeTeam?.toLowerCase().includes(search.toLowerCase()) ||
    m.awayTeam?.toLowerCase().includes(search.toLowerCase())
  );

  const cricketFiltered = cricket.filter(m =>
    !search || m.team1?.toLowerCase().includes(search.toLowerCase()) ||
    m.team2?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ color: '#f0c040', marginBottom: 20 }}>✏️ Edit Match Results</h2>
      {msg && <div style={{ background: '#1a2b1a', border: '1px solid #30d158', borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: '#30d158' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className={sport === 'football' ? 'btn' : 'btn-ghost'} onClick={() => setSport('football')}>⚽ Football</button>
        <button className={sport === 'cricket' ? 'btn' : 'btn-ghost'} onClick={() => setSport('cricket')}>🏏 Cricket</button>
        <input placeholder="Search teams..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
      </div>

      {editing && (
        <div style={{ background: '#1e1e2e', border: '1px solid #f0c040', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Editing Match</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {sport === 'football' ? (
              <>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Home Team</div><input value={form.homeTeam || ''} onChange={e => setForm({ ...form, homeTeam: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Away Team</div><input value={form.awayTeam || ''} onChange={e => setForm({ ...form, awayTeam: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Home Score</div><input type="number" value={form.homeScore || ''} onChange={e => setForm({ ...form, homeScore: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Away Score</div><input type="number" value={form.awayScore || ''} onChange={e => setForm({ ...form, awayScore: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Stadium</div><input value={form.stadium || ''} onChange={e => setForm({ ...form, stadium: e.target.value })} style={{ width: '100%' }} /></div>
              </>
            ) : (
              <>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Team 1</div><input value={form.team1 || ''} onChange={e => setForm({ ...form, team1: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Team 2</div><input value={form.team2 || ''} onChange={e => setForm({ ...form, team2: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Team 1 Score</div><input value={form.team1Score || ''} onChange={e => setForm({ ...form, team1Score: e.target.value })} style={{ width: '100%' }} /></div>
                <div><div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Team 2 Score</div><input value={form.team2Score || ''} onChange={e => setForm({ ...form, team2Score: e.target.value })} style={{ width: '100%' }} /></div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn" onClick={saveEdit}>💾 Save Changes</button>
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {sport === 'football'
              ? <tr><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Home</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Score</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Away</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>League</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Action</th></tr>
              : <tr><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Team 1</th><th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Scores</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Team 2</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Tournament</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>Action</th></tr>
            }
          </thead>
          <tbody>
            {sport === 'football'
              ? footballFiltered.slice(0, 20).map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.homeTeam}</td>
                  <td style={{ padding: '12px 16px', color: '#f0c040', fontWeight: 800, textAlign: 'center' }}>{m.homeScore} - {m.awayScore}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.awayTeam}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: '#2a2a3a', color: '#f0c040', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{m.league}</span></td>
                  <td style={{ padding: '12px 16px' }}><button className="btn-ghost" onClick={() => startEdit(m)}>✏️ Edit</button></td>
                </tr>
              ))
              : cricketFiltered.slice(0, 20).map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.team1}</td>
                  <td style={{ padding: '12px 16px', color: '#f0c040', fontWeight: 800, textAlign: 'center' }}>{m.team1Score} | {m.team2Score}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.team2}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>{m.tournament?.substring(0, 25)}</td>
                  <td style={{ padding: '12px 16px' }}><button className="btn-ghost" onClick={() => startEdit(m)}>✏️ Edit</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}