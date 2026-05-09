import React, { useState, useEffect } from 'react';

export default function NewsManager() {
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', sport: 'football', status: 'draft' });
  const [msg, setMsg] = useState('');
  const [view, setView] = useState('list');

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(d => setArticles(d.data || []));
  }, []);

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const saveArticle = async () => {
    if (!form.title || !form.body) { notify('❌ Title and body required'); return; }
    if (editing) {
      await fetch(`/api/admin/content/${editing}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setArticles(prev => prev.map(a => a.id === editing ? { ...a, ...form } : a));
      notify('✅ Article updated!');
    } else {
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.success) { setArticles(prev => [...prev, d.data]); notify('✅ Article created!'); }
    }
    setForm({ title: '', body: '', sport: 'football', status: 'draft' });
    setEditing(null);
    setView('list');
  };

  const deleteArticle = async (id) => {
    await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
    setArticles(prev => prev.filter(a => a.id !== id));
    notify('🗑️ Article deleted');
  };

  const startEdit = (a) => {
    setEditing(a.id);
    setForm({ title: a.title, body: a.body, sport: a.sport, status: a.status });
    setView('edit');
  };

  const publish = async (id) => {
    await fetch(`/api/admin/content/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' })
    });
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a));
    notify('✅ Article published!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#f0c040' }}>📰 Content Management</h2>
        <button className="btn" onClick={() => { setEditing(null); setForm({ title: '', body: '', sport: 'football', status: 'draft' }); setView('edit'); }}>
          ➕ New Article
        </button>
      </div>

      {msg && <div style={{ background: msg.includes('✅') ? '#1a2b1a' : '#2b1a1a', border: `1px solid ${msg.includes('✅') ? '#30d158' : '#ff3b30'}`, borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: msg.includes('✅') ? '#30d158' : '#ff3b30' }}>{msg}</div>}

      {view === 'edit' && (
        <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>{editing ? '✏️ Edit Article' : '✍️ New Article'}</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Title *</div><input placeholder="Article title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%' }} /></div>
            <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Body *</div>
              <textarea placeholder="Article content..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                style={{ width: '100%', background: '#2a2a3a', border: '1px solid #3a3a4a', color: '#e8e8f0', padding: '10px 16px', borderRadius: 10, fontSize: 14, outline: 'none', minHeight: 150, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Sport</div>
                <select value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })} style={{ width: '100%' }}>
                  <option value="football">⚽ Football</option>
                  <option value="cricket">🏏 Cricket</option>
                  <option value="basketball">🏀 Basketball</option>
                </select>
              </div>
              <div><div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Status</div>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%' }}>
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn" onClick={saveArticle}>{editing ? '💾 Update' : '✅ Create'}</button>
              <button className="btn-ghost" onClick={() => setView('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {articles.map(a => (
          <div key={a.id} style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</span>
                  <span style={{ background: '#2a2a3a', color: '#f0c040', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{a.sport}</span>
                  <span style={{ background: a.status === 'published' ? '#0d2b1a' : '#2a2a3a', color: a.status === 'published' ? '#30d158' : '#888', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{a.status}</span>
                </div>
                <div style={{ color: '#888', fontSize: 13 }}>{a.body?.substring(0, 120)}...</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                {a.status === 'draft' && <button onClick={() => publish(a.id)} style={{ background: '#30d158', color: '#0f0f13', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Publish</button>}
                <button className="btn-ghost" onClick={() => startEdit(a)} style={{ fontSize: 12, padding: '6px 12px' }}>✏️ Edit</button>
                <button onClick={() => deleteArticle(a.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}