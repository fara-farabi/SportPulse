import React, { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'general' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/notifications').then(r => r.json()).then(d => setNotifications(d.data || []));
  }, []);

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const send = async () => {
    if (!form.title || !form.message) { notify('❌ Please fill title and message'); return; }
    const res = await fetch('/api/admin/notifications/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.success) {
      setNotifications(prev => [...prev, d.data]);
      setForm({ title: '', message: '', type: 'general' });
      notify('✅ Notification sent to all users!');
    }
  };

  const saveDraft = async () => {
    if (!form.title) { notify('❌ Please enter a title'); return; }
    const res = await fetch('/api/admin/notifications/draft', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.success) {
      setNotifications(prev => [...prev, d.data]);
      setForm({ title: '', message: '', type: 'general' });
      notify('💾 Saved as draft');
    }
  };

  const deleteNotif = async (id) => {
    await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
    setNotifications(prev => prev.filter(n => n.id !== id));
    notify('🗑️ Deleted');
  };

  const typeColors = { match: '#388bfd', goal: '#30d158', tournament: '#f0c040', general: '#888' };

  return (
    <div>
      <h2 style={{ color: '#f0c040', marginBottom: 20 }}>🔔 Notification Sender</h2>
      {msg && <div style={{ background: msg.includes('✅') || msg.includes('💾') ? '#1a2b1a' : '#2b1a1a', border: `1px solid ${msg.includes('✅') || msg.includes('💾') ? '#30d158' : '#ff3b30'}`, borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: msg.includes('✅') || msg.includes('💾') ? '#30d158' : '#ff3b30' }}>{msg}</div>}

      <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>✉️ Compose Notification</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Title *</div>
            <input placeholder="Notification title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Message *</div>
            <textarea placeholder="Notification message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ width: '100%', background: '#2a2a3a', border: '1px solid #3a3a4a', color: '#e8e8f0', padding: '10px 16px', borderRadius: 10, fontSize: 14, outline: 'none', minHeight: 100, resize: 'vertical' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Type</div>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%' }}>
              <option value="general">📢 General</option>
              <option value="match">⚽ Match</option>
              <option value="goal">🎯 Goal</option>
              <option value="tournament">🏆 Tournament</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn" onClick={send} style={{ flex: 1 }}>📤 Send Now</button>
            <button className="btn-ghost" onClick={saveDraft} style={{ flex: 1 }}>💾 Save Draft</button>
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 700, marginBottom: 16 }}>📋 Notification History</div>
      <div style={{ display: 'grid', gap: 12 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>{n.title}</span>
                <span style={{ background: '#2a2a3a', color: typeColors[n.type] || '#888', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{n.type}</span>
                <span style={{ background: n.sent ? '#0d2b1a' : '#2a2a3a', color: n.sent ? '#30d158' : '#888', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>{n.sent ? '✅ Sent' : '📝 Draft'}</span>
              </div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{n.time} {n.recipients > 0 ? `· ${n.recipients.toLocaleString()} recipients` : ''}</div>
            </div>
            <button onClick={() => deleteNotif(n.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16, marginLeft: 12 }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}