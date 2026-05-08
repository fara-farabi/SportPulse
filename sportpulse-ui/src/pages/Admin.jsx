import React, { useState, useEffect } from 'react';
import EditMatch from './admin/EditMatch';
import AddMatch from './admin/AddMatch';
import Users from './admin/Users';
import Export from './admin/Export';
import Notifications from './admin/Notifications';
import NewsManager from './admin/NewsManager';
const ADMIN_PASSWORD = 'sportpulse2026';


export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('scores');
  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [comments, setComments] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [newTrend, setNewTrend] = useState({ name: '', date: '', sport: 'football' });
  const [scoreEdit, setScoreEdit] = useState({ matchId: '', homeScore: '', awayScore: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (loggedIn) {
      fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d.data));
      fetch('/api/admin/trending').then(r => r.json()).then(d => setTrending(d.data));
      fetch('/api/admin/comments').then(r => r.json()).then(d => setComments(d.data));
      fetch('/api/admin/scores/overrides').then(r => r.json()).then(d => setOverrides(d.data));
    }
  }, [loggedIn]);

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect password. Try: sportpulse2026');
    }
  };

  const overrideScore = async () => {
    const res = await fetch('/api/admin/scores/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: parseInt(scoreEdit.matchId),
        homeScore: parseInt(scoreEdit.homeScore),
        awayScore: parseInt(scoreEdit.awayScore)
      })
    });
    const d = await res.json();
    if (d.success) {
      notify('✅ Score overridden!');
      setScoreEdit({ matchId: '', homeScore: '', awayScore: '' });
      fetch('/api/admin/scores/overrides').then(r => r.json()).then(d => setOverrides(d.data));
    }
  };

  const addTrending = async () => {
    if (!newTrend.name) { notify('❌ Please enter a tournament name'); return; }
    const res = await fetch('/api/admin/trending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrend)
    });
    const d = await res.json();
    if (d.success) {
      setTrending(prev => [...prev, d.data]);
      setNewTrend({ name: '', date: '', sport: 'football' });
      notify('✅ Tournament added!');
    }
  };

  const deleteTrending = async (id) => {
    await fetch(`/api/admin/trending/${id}`, { method: 'DELETE' });
    setTrending(prev => prev.filter(t => t.id !== id));
    notify('🗑️ Deleted');
  };

  const toggleHighlight = async (id, current) => {
    await fetch(`/api/admin/trending/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlighted: !current })
    });
    setTrending(prev => prev.map(t => t.id === id ? { ...t, highlighted: !current } : t));
  };

  const moderateComment = async (id, status) => {
    await fetch(`/api/admin/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    notify(`✅ Comment ${status}`);
  };

  const deleteComment = async (id) => {
    await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
    setComments(prev => prev.filter(c => c.id !== id));
    notify('🗑️ Comment deleted');
  };

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: 380, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
          <h2 style={{ color: '#f0c040', marginBottom: 8 }}>Admin Login</h2>
          <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Enter your admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', marginBottom: 12 }}
              autoFocus
            />
            {error && <div style={{ color: '#ff3b30', marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
          </form>
          <div style={{ marginTop: 16, fontSize: 12, color: '#444' }}>
            Hint: sportpulse2026
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  const tabs = ['scores', 'trending', 'comments', 'analytics', 'editMatch', 'addMatch', 'users', 'export', 'notifications', 'content'];
  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>🔧 Admin Dashboard</h1>
        <button className="btn-ghost" onClick={() => setLoggedIn(false)}>🚪 Logout</button>
      </div>

      {msg && (
        <div style={{ background: '#1a2b1a', border: '1px solid #30d158', borderRadius: 10, padding: '12px 20px', marginBottom: 20, color: '#30d158' }}>
          {msg}
        </div>
      )}

      <div className="flex" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t} className={tab === t ? 'btn' : 'btn-ghost'} onClick={() => setTab(t)}>
            {t === 'scores' ? '⚽ Score Control' : t === 'trending' ? '🔥 Trending' : t === 'comments' ? '💬 Comments' : '📊 Analytics'}
          </button>
        ))}
      </div>

      {/* SCORE OVERRIDE */}
      {tab === 'scores' && (
        <div>
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>⚽ Override Live Score</div>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
              Use this to manually correct any score discrepancies from the API.
            </p>
            <div className="flex" style={{ marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Match ID</div>
                <input placeholder="1, 2, or 3" value={scoreEdit.matchId}
                  onChange={e => setScoreEdit({ ...scoreEdit, matchId: e.target.value })}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Home Score</div>
                <input type="number" placeholder="0" value={scoreEdit.homeScore}
                  onChange={e => setScoreEdit({ ...scoreEdit, homeScore: e.target.value })}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Away Score</div>
                <input type="number" placeholder="0" value={scoreEdit.awayScore}
                  onChange={e => setScoreEdit({ ...scoreEdit, awayScore: e.target.value })}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn" onClick={overrideScore}>Apply Override</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#555', padding: '8px 12px', background: '#1a1a24', borderRadius: 8 }}>
              📋 Match IDs: <strong style={{ color: '#f0c040' }}>1</strong> = Man City vs Arsenal &nbsp;|&nbsp;
              <strong style={{ color: '#f0c040' }}>2</strong> = India vs Australia &nbsp;|&nbsp;
              <strong style={{ color: '#f0c040' }}>3</strong> = Lakers vs Bulls
            </div>
          </div>

          {Object.keys(overrides).length > 0 && (
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>Active Overrides</div>
              <table>
                <thead>
                  <tr><th>Match ID</th><th>Home Score</th><th>Away Score</th></tr>
                </thead>
                <tbody>
                  {Object.entries(overrides).map(([id, v]) => (
                    <tr key={id}>
                      <td style={{ color: '#f0c040' }}>Match {id}</td>
                      <td>{v.homeScore}</td>
                      <td>{v.awayScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TRENDING */}
      {tab === 'trending' && (
        <div>
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>➕ Add Tournament</div>
            <div className="flex">
              <input placeholder="Tournament name" value={newTrend.name}
                onChange={e => setNewTrend({ ...newTrend, name: e.target.value })}
                style={{ flex: 2 }} />
              <input type="date" value={newTrend.date}
                onChange={e => setNewTrend({ ...newTrend, date: e.target.value })}
                style={{ flex: 1 }} />
              <select value={newTrend.sport}
                onChange={e => setNewTrend({ ...newTrend, sport: e.target.value })}>
                <option value="football">⚽ Football</option>
                <option value="cricket">🏏 Cricket</option>
                <option value="basketball">🏀 Basketball</option>
              </select>
              <button className="btn" onClick={addTrending}>Add</button>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a3a', fontWeight: 700 }}>
              🔥 Trending Tournaments ({trending.length})
            </div>
            <table>
              <thead>
                <tr><th>Tournament</th><th>Date</th><th>Sport</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {trending.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td style={{ color: '#888' }}>{t.date || 'TBD'}</td>
                    <td><span className="tag tag-yellow">{t.sport}</span></td>
                    <td>
                      <span className={`tag ${t.highlighted ? 'tag-green' : 'tag-red'}`}>
                        {t.highlighted ? '✅ Highlighted' : '❌ Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="flex">
                        <button className="btn-ghost" onClick={() => toggleHighlight(t.id, t.highlighted)}>
                          {t.highlighted ? 'Hide' : 'Highlight'}
                        </button>
                        <button className="btn-danger" style={{ background: '#ff3b30', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
                          onClick={() => deleteTrending(t.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMENTS */}
      {tab === 'comments' && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="num" style={{ fontSize: 24 }}>{comments.length}</div>
              <div className="label">Total Comments</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="num" style={{ fontSize: 24, color: '#30d158' }}>
                {comments.filter(c => c.status === 'approved').length}
              </div>
              <div className="label">Approved</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="num" style={{ fontSize: 24, color: '#f0c040' }}>
                {comments.filter(c => c.status === 'pending').length}
              </div>
              <div className="label">Pending</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="num" style={{ fontSize: 24, color: '#ff3b30' }}>
                {comments.filter(c => c.status === 'rejected').length}
              </div>
              <div className="label">Rejected</div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr><th>User</th><th>Comment</th><th>Article</th><th>Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {comments.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>👤 {c.user}</td>
                    <td style={{ maxWidth: 200 }}>{c.text}</td>
                    <td><span className="tag tag-yellow">{c.article}</span></td>
                    <td style={{ color: '#666', fontSize: 12 }}>{c.time}</td>
                    <td>
                      <span className={`tag ${c.status === 'approved' ? 'tag-green' : c.status === 'rejected' ? 'tag-red' : 'tag-yellow'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex">
                        {c.status !== 'approved' && (
                          <button className="btn-success" style={{ background: '#30d158', color: '#0f0f13', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                            onClick={() => moderateComment(c.id, 'approved')}>✅ Approve</button>
                        )}
                        {c.status !== 'rejected' && (
                          <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}
                            onClick={() => moderateComment(c.id, 'rejected')}>❌ Reject</button>
                        )}
                        <button style={{ background: '#ff3b30', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
                          onClick={() => deleteComment(c.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {tab === 'analytics' && stats && (
        <div>
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="stat-box">
              <div className="num">{stats.totalVisits.toLocaleString()}</div>
              <div className="label">Total Visits</div>
            </div>
            <div className="stat-box">
              <div className="num">{stats.activeUsers}</div>
              <div className="label">Active Users</div>
            </div>
            <div className="stat-box">
              <div className="num">{stats.topFeatures.length}</div>
              <div className="label">Features Tracked</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-title" style={{ marginBottom: 20 }}>🏆 Top Features</div>
              {stats.topFeatures.map((f, i) => (
                <div key={f.feature} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>#{i + 1} {f.feature}</span>
                    <span style={{ color: '#f0c040', fontWeight: 700 }}>{f.clicks.toLocaleString()} clicks</span>
                  </div>
                  <div style={{ background: '#2a2a3a', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #f0c040, #d4a820)',
                      borderRadius: 6, height: 10,
                      width: `${(f.clicks / stats.topFeatures[0].clicks) * 100}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 20 }}>⚽ Top Sports</div>
              {stats.topSports.map((s, i) => (
                <div key={s.sport} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>#{i + 1} {s.sport}</span>
                    <span style={{ color: '#f0c040', fontWeight: 700 }}>{s.visits.toLocaleString()} visits</span>
                  </div>
                  <div style={{ background: '#2a2a3a', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #30d158, #1a8c3a)',
                      borderRadius: 6, height: 10,
                      width: `${(s.visits / stats.topSports[0].visits) * 100}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: 16, background: '#1a1a24', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>ENGAGEMENT RATE</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f0c040' }}>
                  {((stats.activeUsers / stats.totalVisits) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Active users vs total visits</div>
              </div>
            </div>
          </div>
        </div>
      )}
    {tab === 'editMatch' && <EditMatch />}
    {tab === 'addMatch' && <AddMatch />}
    {tab === 'users' && <Users />}
    {tab === 'export' && <Export />}
    {tab === 'notifications' && <Notifications />}
    {tab === 'content' && <NewsManager />}
    </div>
  );
}