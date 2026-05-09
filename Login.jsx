import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.success) {
        localStorage.setItem('sp_user', JSON.stringify(d.user));
        onLogin(d.user);
        navigate('/mypulse');
      } else setError(d.message);
    } catch { setError('Connection error. Make sure backend is running.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
          <h1 style={{ color: '#f0c040', fontSize: 28, fontWeight: 800 }}>SportPulse</h1>
          <p style={{ color: '#666', marginTop: 8 }}>{isRegister ? 'Create your account' : 'Welcome back!'}</p>
        </div>

        <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 20, padding: 32 }}>
          {error && <div style={{ background: '#2b0d0d', border: '1px solid #ff3b30', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ff3b30', fontSize: 14 }}>{error}</div>}

          <form onSubmit={submit}>
            {isRegister && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Username</div>
                <input placeholder="Choose a username" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{ width: '100%' }} required />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Email</div>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%' }} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Password</div>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%' }} required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', padding: '14px', fontSize: 16 }} disabled={loading}>
              {loading ? '⏳ Please wait...' : isRegister ? '🚀 Create Account' : '🔐 Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#f0c040', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>

          {!isRegister && (
            <div style={{ marginTop: 16, padding: 12, background: '#1a1a24', borderRadius: 10, fontSize: 12, color: '#555', textAlign: 'center' }}>
              Demo: oishy@email.com / pass123
            </div>
          )}
        </div>
      </div>
    </div>
  );
}