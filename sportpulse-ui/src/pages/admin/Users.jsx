import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.data || []));
  }, []);

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const banUser = async (id) => {
    await fetch(`/api/admin/users/${id}/ban`, { method: 'PATCH' });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' } : u));
    notify('🚫 User banned');
  };

  const unbanUser = async (id) => {
    await fetch(`/api/admin/users/${id}/unban`, { method: 'PATCH' });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
    notify('✅ User unbanned');
  };

  const deleteUser = async (id) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== id));
    notify('🗑️ User deleted');
  };

  const filtered = users.filter(u =>
    (filter === 'all' || u.status === filter) &&
    (!search || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h2 style={{ color: '#f0c040', marginBottom: 20 }}>👥 User Management</h2>
      {msg && <div style={{ background: '#1a2b1a', border: '1px solid #30d158', borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: '#30d158' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#1a1a24', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f0c040' }}>{users.length}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Total Users</div>
        </div>
        <div style={{ background: '#1a1a24', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#30d158' }}>{users.filter(u => u.status === 'active').length}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Active</div>
        </div>
        <div style={{ background: '#1a1a24', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ff3b30' }}>{users.filter(u => u.status === 'banned').length}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Banned</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <button className={filter === 'all' ? 'btn' : 'btn-ghost'} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'btn' : 'btn-ghost'} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'banned' ? 'btn' : 'btn-ghost'} onClick={() => setFilter('banned')}>Banned</button>
      </div>

      <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Username', 'Email', 'Joined', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#666', borderBottom: '1px solid #2a2a3a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>👤 {u.username}</td>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>{u.email}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: 13 }}>{u.joined}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: u.status === 'active' ? '#0d2b1a' : '#2b0d0d', color: u.status === 'active' ? '#30d158' : '#ff3b30', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                    {u.status === 'active' ? '✅ Active' : '🚫 Banned'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {u.status === 'active'
                      ? <button onClick={() => banUser(u.id)} style={{ background: '#ff3b30', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>🚫 Ban</button>
                      : <button onClick={() => unbanUser(u.id)} style={{ background: '#30d158', color: '#0f0f13', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✅ Unban</button>
                    }
                    <button onClick={() => deleteUser(u.id)} style={{ background: 'transparent', color: '#666', border: '1px solid #3a3a4a', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}