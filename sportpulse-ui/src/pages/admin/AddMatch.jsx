import React, { useState } from 'react';

export default function AddMatch() {
  const [sport, setSport] = useState('football');
  const [msg, setMsg] = useState('');
  const [footballForm, setFootballForm] = useState({ homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', league: 'Premier League', stadium: '' });
  const [cricketForm, setCricketForm] = useState({ team1: '', team2: '', team1Score: '', team2Score: '', tournament: '', stadium: '' });

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const addFootball = async () => {
    if (!footballForm.homeTeam || !footballForm.awayTeam) { notify('❌ Please fill in both teams'); return; }
    const res = await fetch('/api/admin/matches/add/football', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(footballForm)
    });
    const d = await res.json();
    if (d.success) {
      notify('✅ Football match added!');
      setFootballForm({ homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', league: 'Premier League', stadium: '' });
    } else notify('❌ ' + d.message);
  };

  const addCricket = async () => {
    if (!cricketForm.team1 || !cricketForm.team2) { notify('❌ Please fill in both teams'); return; }
    const res = await fetch('/api/admin/matches/add/cricket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cricketForm)
    });
    const d = await res.json();
    if (d.success) {
      notify('✅ Cricket match added!');
      setCricketForm({ team1: '', team2: '', team1Score: '', team2Score: '', tournament: '', stadium: '' });
    } else notify('❌ ' + d.message);
  };

  return (
    <div>
      <h2 style={{ color: '#f0c040', marginBottom: 20 }}>➕ Add New Match</h2>
      {msg && <div style={{ background: msg.includes('✅') ? '#1a2b1a' : '#2b1a1a', border: `1px solid ${msg.includes('✅') ? '#30d158' : '#ff3b30'}`, borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: msg.includes('✅') ? '#30d158' : '#ff3b30' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className={sport === 'football' ? 'btn' : 'btn-ghost'} onClick={() => setSport('football')}>⚽ Football</button>
        <button className={sport === 'cricket' ? 'btn' : 'btn-ghost'} onClick={() => setSport('cricket')}>🏏 Cricket</button>
      </div>

      {sport === 'football' && (
        <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Home Team *</div><input placeholder="e.g. Arsenal" value={footballForm.homeTeam} onChange={e => setFootballForm({ ...footballForm, homeTeam: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Away Team *</div><input placeholder="e.g. Chelsea" value={footballForm.awayTeam} onChange={e => setFootballForm({ ...footballForm, awayTeam: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Home Score</div><input type="number" placeholder="0" value={footballForm.homeScore} onChange={e => setFootballForm({ ...footballForm, homeScore: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Away Score</div><input type="number" placeholder="0" value={footballForm.awayScore} onChange={e => setFootballForm({ ...footballForm, awayScore: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>League</div>
              <select value={footballForm.league} onChange={e => setFootballForm({ ...footballForm, league: e.target.value })} style={{ width: '100%' }}>
                <option>Premier League</option>
                <option>La Liga</option>
                <option>Champions League</option>
              </select>
            </div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Stadium</div><input placeholder="e.g. Emirates Stadium" value={footballForm.stadium} onChange={e => setFootballForm({ ...footballForm, stadium: e.target.value })} style={{ width: '100%' }} /></div>
          </div>
          <button className="btn" onClick={addFootball}>➕ Add Football Match</button>
        </div>
      )}

      {sport === 'cricket' && (
        <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Team 1 *</div><input placeholder="e.g. India" value={cricketForm.team1} onChange={e => setCricketForm({ ...cricketForm, team1: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Team 2 *</div><input placeholder="e.g. Australia" value={cricketForm.team2} onChange={e => setCricketForm({ ...cricketForm, team2: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Team 1 Score</div><input placeholder="e.g. 245/6" value={cricketForm.team1Score} onChange={e => setCricketForm({ ...cricketForm, team1Score: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Team 2 Score</div><input placeholder="e.g. 210/8" value={cricketForm.team2Score} onChange={e => setCricketForm({ ...cricketForm, team2Score: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Tournament</div><input placeholder="e.g. IPL 2026" value={cricketForm.tournament} onChange={e => setCricketForm({ ...cricketForm, tournament: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Stadium</div><input placeholder="e.g. Wankhede Stadium" value={cricketForm.stadium} onChange={e => setCricketForm({ ...cricketForm, stadium: e.target.value })} style={{ width: '100%' }} /></div>
          </div>
          <button className="btn" onClick={addCricket}>➕ Add Cricket Match</button>
        </div>
      )}
    </div>
  );
}