import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyPulse({ user }) {
  const [scores, setScores] = useState([]);
  const [news, setNews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const favTeams = user?.favorites?.teams || [];
  const favLeagues = user?.favorites?.leagues || [];
  const favPlayers = user?.favorites?.players || [];

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch('/api/scores/live').then(r => r.json()),
      fetch('/api/news/feed').then(r => r.json()),
      fetch(`/api/alerts/${user.id}`).then(r => r.json()),
    ]).then(([s, n, a]) => {
      setScores(s.data || []);
      setNews(n.data || []);
      setAlerts(a.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const markRead = async (id) => {
    await fetch(`/api/alerts/${id}/read`, { method: 'PATCH' });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = async () => {
    await fetch(`/api/alerts/${user.id}/read-all`, { method: 'PATCH' });
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const filteredScores = scores.filter(s =>
    favTeams.some(t => s.homeTeam?.includes(t) || s.awayTeam?.includes(t)) ||
    favLeagues.includes(s.league)
  );

  const filteredNews = news.filter(n =>
    favTeams.some(t => n.team?.includes(t) || n.title?.includes(t)) ||
    favLeagues.some(l => n.title?.includes(l)) ||
    favPlayers.some(p => n.title?.includes(p))
  );

  const unreadCount = alerts.filter(a => !a.read).length;

  const alertIcons = { goal: '⚽', match_start: '🟢', result: '🏁', wicket: '🏏', card: '🟨' };

  if (!user) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
      <h2 style={{ color: '#f0c040', marginBottom: 12 }}>Your Personal Sports Hub</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>Login to see your personalized My Pulse dashboard</p>
      <Link to="/login" className="btn">🔐 Login to Continue</Link>
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>⚡ My Pulse</h1>
          <p style={{ color: '#666', marginTop: 6 }}>Welcome back, <strong style={{ color: '#f0c040' }}>{user.username}</strong>! Here's your personalized feed.</p>
        </div>
        <Link to="/favorites" className="btn-ghost">⭐ Edit Favorites</Link>
      </div>

      {favTeams.length === 0 && favLeagues.length === 0 && (
        <div style={{ background: '#1a1a24', border: '1px dashed #3a3a4a', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>No favorites yet!</div>
          <div style={{ color: '#666', marginBottom: 20 }}>Follow leagues, teams, and players to personalize your feed</div>
          <Link to="/favorites" className="btn">Follow Teams & Leagues</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          {/* Live Scores */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b30', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              Live Scores — Your Teams
            </div>
            {loading ? <div className="loading">Loading...</div> :
              filteredScores.length === 0
                ? <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, color: '#555', textAlign: 'center' }}>No live matches for your followed teams right now</div>
                : filteredScores.map(m => (
                  <div key={m.id} style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 20, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ background: '#ff3b30', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>● LIVE</span>
                      <span style={{ fontSize: 12, color: '#666' }}>{m.league}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{m.homeTeam}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#f0c040' }}>{m.homeScore}</div>
                      </div>
                      <div style={{ color: '#444', fontWeight: 800 }}>VS</div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{m.awayTeam}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#f0c040' }}>{m.awayScore}</div>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* News Feed */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>📰 News — Your Teams</div>
            {loading ? <div className="loading">Loading...</div> :
              filteredNews.length === 0
                ? <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, color: '#555', textAlign: 'center' }}>No news for your followed teams right now</div>
                : filteredNews.map(n => (
                  <div key={n.id} style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 20, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 32, flexShrink: 0 }}>{n.image}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{n.title}</div>
                      <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{n.summary}</div>
                      <div style={{ fontSize: 12, color: '#555' }}>🕐 {n.time} · By {n.author}</div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Alerts Panel */}
        <div>
          <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                🔔 Smart Alerts
                {unreadCount > 0 && <span style={{ background: '#ff3b30', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{unreadCount}</span>}
              </div>
              {unreadCount > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#f0c040', cursor: 'pointer', fontSize: 12 }}>Mark all read</button>}
            </div>
            {alerts.length === 0
              ? <div style={{ color: '#555', textAlign: 'center', padding: 20 }}>No alerts yet</div>
              : alerts.map(a => (
                <div key={a.id} onClick={() => markRead(a.id)} style={{
                  padding: '12px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                  background: a.read ? '#1a1a24' : '#1e1e2e',
                  border: `1px solid ${a.read ? '#2a2a3a' : '#3a3a5a'}`,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>{alertIcons[a.type] || '🔔'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: a.read ? 400 : 700, marginBottom: 4 }}>{a.message}</div>
                      <div style={{ fontSize: 11, color: '#555' }}>{a.time}</div>
                    </div>
                    {!a.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0c040', flexShrink: 0, marginTop: 4 }}></div>}
                  </div>
                </div>
              ))
            }

            {/* Favorites Summary */}
            <div style={{ marginTop: 20, padding: 16, background: '#1a1a24', borderRadius: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>⭐ Following</div>
              {favLeagues.length > 0 && <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>LEAGUES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {favLeagues.map(l => <span key={l} style={{ background: '#2a2a3a', color: '#f0c040', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{l}</span>)}
                </div>
              </div>}
              {favTeams.length > 0 && <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>TEAMS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {favTeams.map(t => <span key={t} style={{ background: '#2a2a3a', color: '#e8e8f0', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{t}</span>)}
                </div>
              </div>}
              {favPlayers.length > 0 && <div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>PLAYERS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {favPlayers.map(p => <span key={p} style={{ background: '#2a2a3a', color: '#e8e8f0', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{p}</span>)}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}