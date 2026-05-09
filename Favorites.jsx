import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_LEAGUES = ['Premier League', 'La Liga', 'Champions League', 'IPL', 'PSL', 'ICC World Cup', 'NBA'];
const ALL_TEAMS = ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham', 'Real Madrid', 'Barcelona', 'India', 'Australia', 'Pakistan', 'Mumbai Indians', 'Lakers', 'Bulls'];
const ALL_PLAYERS = ['Erling Haaland', 'Mohamed Salah', 'Vinicius Jr', 'Kylian Mbappe', 'Bukayo Saka', 'Jude Bellingham', 'Rohit Sharma', 'Virat Kohli', 'LeBron James'];

export default function Favorites({ user, onUpdate }) {
  const [favorites, setFavorites] = useState(user?.favorites || { leagues: [], teams: [], players: [] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const toggle = (category, item) => {
    setFavorites(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/auth/favorites/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorites)
      });
      const d = await res.json();
      if (d.success) {
        localStorage.setItem('sp_user', JSON.stringify(d.user));
        onUpdate(d.user);
        setMsg('✅ Favorites saved!');
        setTimeout(() => { setMsg(''); navigate('/mypulse'); }, 1500);
      }
    } catch { setMsg('❌ Error saving'); }
    setSaving(false);
  };

  const Section = ({ title, category, items }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{title}</div>
      <div style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
        {favorites[category].length} selected
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map(item => {
          const selected = favorites[category].includes(item);
          return (
            <button key={item} onClick={() => toggle(category, item)} style={{
              padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: selected ? '#f0c040' : '#2a2a3a',
              color: selected ? '#0f0f13' : '#888',
              border: selected ? '1px solid #f0c040' : '1px solid #3a3a4a',
              transition: 'all 0.2s'
            }}>
              {selected ? '✓ ' : ''}{item}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>⭐ Follow Favorites</h1>
          <p style={{ color: '#666', marginTop: 8 }}>Select the leagues, teams, and players you want to follow</p>
        </div>
        <button className="btn" onClick={save} disabled={saving}>{saving ? '⏳ Saving...' : '💾 Save & Go to My Pulse'}</button>
      </div>

      {msg && <div style={{ background: '#1a2b1a', border: '1px solid #30d158', borderRadius: 10, padding: '12px 20px', marginBottom: 24, color: '#30d158' }}>{msg}</div>}

      <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 32 }}>
        <Section title="🏆 Leagues" category="leagues" items={ALL_LEAGUES} />
        <Section title="👕 Teams" category="teams" items={ALL_TEAMS} />
        <Section title="👤 Players" category="players" items={ALL_PLAYERS} />
      </div>
    </div>
  );
}