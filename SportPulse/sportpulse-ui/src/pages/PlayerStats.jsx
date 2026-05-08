import React, { useState, useEffect } from 'react';

const API = '';;

export default function PlayerStats() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/players`)
      .then(r => r.json())
      .then(d => { setPlayers(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = players.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title">👤 Player Stats</h1>
      <div className="card">
        <input placeholder="Search player or team..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
      </div>
      {loading ? <div className="loading">Loading players...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          <div>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ cursor: 'pointer', borderColor: selected?.id === p.id ? '#f0c040' : '#2a2a3a' }}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>{p.name}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{p.team} · {p.league}</div>
                    <div style={{ marginTop: 8 }}><span className="tag tag-yellow">{p.position}</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f0c040', fontWeight: 800, fontSize: 28 }}>{p.goals}</div>
                    <div style={{ color: '#666', fontSize: 11 }}>Goals</div>
                  </div>
                </div>
                <div className="grid-3" style={{ marginTop: 16 }}>
                  <div className="stat-box"><div className="num" style={{ fontSize: 20 }}>{p.goals}</div><div className="label">Goals</div></div>
                  <div className="stat-box"><div className="num" style={{ fontSize: 20 }}>{p.assists}</div><div className="label">Assists</div></div>
                  <div className="stat-box"><div className="num" style={{ fontSize: 20 }}>{p.rating}</div><div className="label">Rating</div></div>
                </div>
              </div>
            ))}
          </div>
          {selected && (
            <div>
              <div className="card" style={{ position: 'sticky', top: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ color: '#f0c040' }}>{selected.name}</h2>
                  <button className="btn-ghost" onClick={() => setSelected(null)}>✕ Close</button>
                </div>
                <div style={{ color: '#888', marginBottom: 20 }}>{selected.team} · {selected.league} · {selected.position}</div>
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  <div className="stat-box"><div className="num">{selected.goals}</div><div className="label">Goals</div></div>
                  <div className="stat-box"><div className="num">{selected.assists}</div><div className="label">Assists</div></div>
                  <div className="stat-box"><div className="num">{selected.matches}</div><div className="label">Matches</div></div>
                  <div className="stat-box"><div className="num">{selected.rating}</div><div className="label">Rating</div></div>
                </div>
                <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
                  <span style={{ color: '#f0c040' }}>🟨 {selected.yellowCards} Yellow Cards</span>
                  <span style={{ color: '#ff3b30' }}>🟥 {selected.redCards} Red Cards</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>📊 Season Performance Heatmap</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
                    {selected.heatmap.map((v, i) => (
                      <div key={i} title={`Week ${i+1}: ${v}/10`} style={{
                        height: 32, borderRadius: 4,
                        background: `rgba(240,192,64,${v/10})`,
                        border: '1px solid #2a2a3a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: v > 6 ? '#0f0f13' : '#666', fontWeight: 700
                      }}>{v}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#666' }}>
                    <span>Week 1</span><span>Week 20</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}