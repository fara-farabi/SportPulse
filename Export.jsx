import React, { useState } from 'react';

export default function Export() {
  const [msg, setMsg] = useState('');

  const notify = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const downloadFile = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify(`✅ Downloading ${filename}...`);
  };

  const exports = [
    { label: '⚽ Football Matches', desc: '90 matches from Premier League, La Liga & Champions League', csvUrl: '/api/admin/export/football/csv', jsonUrl: '/api/admin/export/football/json', csvFile: 'football_matches.csv', jsonFile: 'football_matches.json', color: '#388bfd' },
    { label: '🏏 Cricket Matches', desc: '48 matches from IPL, PSL, World Cup & more', csvUrl: '/api/admin/export/cricket/csv', jsonUrl: '/api/admin/export/cricket/json', csvFile: 'cricket_matches.csv', jsonFile: 'cricket_matches.json', color: '#f0c040' },
  ];

  return (
    <div>
      <h2 style={{ color: '#f0c040', marginBottom: 8 }}>📤 Export Data</h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Download match data in CSV or JSON format for analysis.</p>
      {msg && <div style={{ background: '#1a2b1a', border: '1px solid #30d158', borderRadius: 10, padding: '12px 20px', marginBottom: 16, color: '#30d158' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {exports.map(e => (
          <div key={e.label} style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{e.label}</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>{e.desc}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn" onClick={() => downloadFile(e.csvUrl, e.csvFile)} style={{ flex: 1 }}>
                📊 Download CSV
              </button>
              <button className="btn-ghost" onClick={() => downloadFile(e.jsonUrl, e.jsonFile)} style={{ flex: 1 }}>
                📋 Download JSON
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#16161e', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24, marginTop: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Export Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <div style={{ background: '#1a1a24', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f0c040' }}>90</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Football Matches</div>
          </div>
          <div style={{ background: '#1a1a24', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f0c040' }}>48</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Cricket Matches</div>
          </div>
          <div style={{ background: '#1a1a24', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f0c040' }}>138</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Total Records</div>
          </div>
        </div>
      </div>
    </div>
  );
}