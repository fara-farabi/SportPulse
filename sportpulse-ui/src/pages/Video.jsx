import React, { useState, useEffect } from 'react';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [sport, setSport] = useState('all');
  const [type, setType] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/videos?sport=${sport}&type=${type}`)
      .then(r => r.json())
      .then(d => { setVideos(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sport, type]);

  const share = (video, platform) => {
    const text = encodeURIComponent(`Watch: ${video.title} — via SportPulse`);
    const url = encodeURIComponent(`https://youtube.com/watch?v=${video.youtubeId}`);
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], '_blank');
  };

  const typeColors = { highlights: '#30d158', interview: '#388bfd', analysis: '#bf5af2' };

  return (
    <div className="page">
      <h1 className="page-title">🎥 Video Highlights & Interviews</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'football', 'cricket', 'basketball'].map(s => (
          <button key={s} className={sport === s ? 'btn' : 'btn-ghost'} onClick={() => setSport(s)}>
            {s === 'all' ? '🌐 All' : s === 'football' ? '⚽ Football' : s === 'cricket' ? '🏏 Cricket' : '🏀 Basketball'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'highlights', 'interview', 'analysis'].map(t => (
          <button key={t} className={type === t ? 'btn' : 'btn-ghost'} onClick={() => setType(t)} style={{ fontSize: 13 }}>
            {t === 'all' ? '📹 All Videos' : t === 'highlights' ? '🎬 Highlights' : t === 'interview' ? '🎤 Interviews' : '📊 Analysis'}
          </button>
        ))}
      </div>

      {playing && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1`}
              title={playing.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
          <div style={{ background: '#16161e', borderRadius: '0 0 16px 16px', padding: 20, border: '1px solid #2a2a3a', borderTop: 'none' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{playing.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: '#666' }}>👁️ {playing.views} views · {playing.time}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => share(playing, 'twitter')} style={{ background: '#1da1f2', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🐦 Share</button>
                <button onClick={() => share(playing, 'whatsapp')} style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>💬 WhatsApp</button>
                <button onClick={() => setPlaying(null)} className="btn-ghost" style={{ fontSize: 13 }}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="loading">Loading videos...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#16161e', border: `1px solid ${playing?.id === v.id ? '#f0c040' : '#2a2a3a'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s' }}>
              <div onClick={() => setPlaying(v)} style={{
                height: 180, background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative'
              }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{v.thumbnail}</div>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(240,192,64,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                  <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
                </div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>{v.duration}</div>
                <div style={{ position: 'absolute', top: 8, left: 8, background: typeColors[v.type] || '#888', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, color: '#0f0f13' }}>
                  {v.type === 'highlights' ? '🎬 Highlights' : v.type === 'interview' ? '🎤 Interview' : '📊 Analysis'}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{v.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: '#666' }}>👁️ {v.views} · {v.time}</div>
                  <button onClick={() => share(v, 'whatsapp')} style={{ background: '#25d366', border: 'none', color: 'white', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11 }}>💬</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}