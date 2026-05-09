import React, { useState, useEffect } from 'react';

export default function Analysis() {
  const [articles, setArticles] = useState([]);
  const [sport, setSport] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analysis?sport=${sport}`)
      .then(r => r.json())
      .then(d => { setArticles(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sport]);

  const like = async (id) => {
    if (liked.includes(id)) return;
    await fetch(`/api/analysis/${id}/like`, { method: 'PATCH' });
    setLiked(prev => [...prev, id]);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  };

  const share = (article, platform) => {
    const text = encodeURIComponent(`${article.title} — Expert Analysis on SportPulse`);
    const url = encodeURIComponent(window.location.href);
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], '_blank');
  };

  const roleColors = { 'UEFA Licensed Coach': '#f0c040', 'Former Test Cricketer': '#30d158', 'NBA Analyst': '#388bfd', 'Football Journalist': '#bf5af2', 'Sports Statistician': '#ff9f0a' };

  return (
    <div className="page">
      <h1 className="page-title">🧠 Expert Analysis</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Tactical previews, expert columns, and deep-dive match analysis from our team of specialists.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'football', 'cricket', 'basketball'].map(s => (
          <button key={s} className={sport === s ? 'btn' : 'btn-ghost'} onClick={() => setSport(s)}>
            {s === 'all' ? '🌐 All Sports' : s === 'football' ? '⚽ Football' : s === 'cricket' ? '🏏 Cricket' : '🏀 Basketball'}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading analysis...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 440px' : '1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map(a => (
              <div key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
                style={{ background: '#16161e', border: `1px solid ${selected?.id === a.id ? '#f0c040' : '#2a2a3a'}`, borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {a.sport === 'football' ? '⚽' : a.sport === 'cricket' ? '🏏' : '🏀'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.author}</div>
                      <div style={{ fontSize: 12, color: roleColors[a.role] || '#888' }}>{a.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>{a.readTime}</div>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10, lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{a.content.substring(0, 150)}...</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {a.tags.map(tag => <span key={tag} style={{ background: '#2a2a3a', color: '#888', padding: '3px 10px', borderRadius: 10, fontSize: 12 }}>#{tag}</span>)}
                </div>
                <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => like(a.id)} style={{
                    background: liked.includes(a.id) ? '#2a1a3a' : '#2a2a3a',
                    border: `1px solid ${liked.includes(a.id) ? '#bf5af2' : '#3a3a4a'}`,
                    color: liked.includes(a.id) ? '#bf5af2' : '#888',
                    padding: '6px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13
                  }}>
                    {liked.includes(a.id) ? '💜' : '🤍'} {a.likes} Likes
                  </button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => share(a, 'twitter')} style={{ background: '#1da1f2', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>🐦</button>
                    <button onClick={() => share(a, 'whatsapp')} style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>💬</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
              <div style={{ background: '#16161e', border: '1px solid #f0c040', borderRadius: 16, padding: 28 }}>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 20, float: 'right' }}>✕</button>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {selected.sport === 'football' ? '⚽' : selected.sport === 'cricket' ? '🏏' : '🏀'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.author}</div>
                    <div style={{ fontSize: 13, color: roleColors[selected.role] || '#888' }}>{selected.role}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{selected.readTime} · {selected.time}</div>
                  </div>
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16, lineHeight: 1.3 }}>{selected.title}</h2>
                <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 16, fontSize: 14 }}>{selected.content}</p>
                <p style={{ color: '#888', lineHeight: 1.8, fontSize: 14 }}>Our expert continues to monitor this situation closely. This analysis is based on data from the last 10 matches and extensive video review. Follow SportPulse for more expert insights.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16, marginBottom: 20 }}>
                  {selected.tags.map(tag => <span key={tag} style={{ background: '#2a2a3a', color: '#888', padding: '3px 10px', borderRadius: 10, fontSize: 12 }}>#{tag}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => share(selected, 'twitter')} style={{ flex: 1, background: '#1da1f2', border: 'none', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>🐦 Twitter</button>
                  <button onClick={() => share(selected, 'whatsapp')} style={{ flex: 1, background: '#25d366', border: 'none', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>💬 WhatsApp</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}