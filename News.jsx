import React, { useState, useEffect } from 'react';

const categoryColors = { match_report: '#30d158', transfer: '#ff9f0a', preview: '#388bfd', analysis: '#bf5af2' };
const categoryLabels = { match_report: '📋 Match Report', transfer: '💰 Transfer', preview: '👁️ Preview', analysis: '🔍 Analysis' };

export default function News() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('all');
  const [sport, setSport] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/feed?category=${category}&sport=${sport}`)
      .then(r => r.json())
      .then(d => { setNews(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, sport]);

  const share = (article, platform) => {
    const text = encodeURIComponent(`${article.title} — via SportPulse`);
    const url = encodeURIComponent(window.location.href);
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], '_blank');
    setSharing(null);
  };

  const categories = ['all', 'match_report', 'transfer', 'preview', 'analysis'];
  const sports = ['all', 'football', 'cricket', 'basketball'];

  return (
    <div className="page">
      <h1 className="page-title">📰 Sports News Feed</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} className={category === c ? 'btn' : 'btn-ghost'} onClick={() => setCategory(c)} style={{ fontSize: 13 }}>
            {c === 'all' ? '📰 All News' : categoryLabels[c]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {sports.map(s => (
          <button key={s} className={sport === s ? 'btn' : 'btn-ghost'} onClick={() => setSport(s)} style={{ fontSize: 13 }}>
            {s === 'all' ? '🌐 All Sports' : s === 'football' ? '⚽ Football' : s === 'cricket' ? '🏏 Cricket' : '🏀 Basketball'}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading news...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, alignContent: 'start' }}>
            {news.map(article => (
              <div key={article.id} onClick={() => setSelected(selected?.id === article.id ? null : article)}
                style={{ background: '#16161e', border: `1px solid ${selected?.id === article.id ? '#f0c040' : '#2a2a3a'}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{article.image}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ background: '#2a2a3a', color: categoryColors[article.category] || '#888', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                    {categoryLabels[article.category]}
                  </span>
                  <span style={{ background: '#2a2a3a', color: '#888', padding: '3px 10px', borderRadius: 10, fontSize: 11 }}>{article.sport}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{article.title}</div>
                <div style={{ color: '#888', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{article.summary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: '#555' }}>🕐 {article.time}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); setSharing(sharing === article.id ? null : article.id); }}
                      style={{ background: '#2a2a3a', border: 'none', color: '#888', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                      📤 Share
                    </button>
                  </div>
                </div>
                {sharing === article.id && (
                  <div onClick={e => e.stopPropagation()} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={() => share(article, 'twitter')} style={{ flex: 1, background: '#1da1f2', border: 'none', color: 'white', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>🐦 Twitter</button>
                    <button onClick={() => share(article, 'facebook')} style={{ flex: 1, background: '#1877f2', border: 'none', color: 'white', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>📘 Facebook</button>
                    <button onClick={() => share(article, 'whatsapp')} style={{ flex: 1, background: '#25d366', border: 'none', color: 'white', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>💬 WhatsApp</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
              <div style={{ background: '#16161e', border: '1px solid #f0c040', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ background: '#2a2a3a', color: categoryColors[selected.category], padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{categoryLabels[selected.category]}</span>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 20 }}>✕</button>
                </div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{selected.image}</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>{selected.title}</h2>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>By <strong style={{ color: '#e8e8f0' }}>{selected.author}</strong> · {selected.time}</div>
                <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: 20 }}>{selected.summary}</p>
                <p style={{ color: '#888', lineHeight: 1.7, fontSize: 14 }}>This is a developing story. Our reporters on the ground are gathering more information. Stay tuned to SportPulse for the latest updates as they happen. Follow {selected.team} to get instant notifications about this story.</p>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📤 Share this article:</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => share(selected, 'twitter')} style={{ flex: 1, background: '#1da1f2', border: 'none', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>🐦 Twitter</button>
                    <button onClick={() => share(selected, 'facebook')} style={{ flex: 1, background: '#1877f2', border: 'none', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>📘 Facebook</button>
                    <button onClick={() => share(selected, 'whatsapp')} style={{ flex: 1, background: '#25d366', border: 'none', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>💬 WhatsApp</button>
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