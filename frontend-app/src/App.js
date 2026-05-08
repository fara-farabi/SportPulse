import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Standings from './pages/Standings';
import H2H from './pages/H2H';
import Archive from './pages/Archive';
import PlayerStats from './pages/PlayerStats';
import './App.css';

function NavBar() {
  const location = useLocation();
  const links = [
    { path: '/standings', label: '🏆 Standings' },
    { path: '/h2h', label: '⚔️ Head to Head' },
    { path: '/archive', label: '📁 Archive' },
    { path: '/player', label: '👤 Player Stats' },
  ];
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">⚡ SportPulse</Link>
        <nav className="nav-links">
          {links.map(l => (
            <Link key={l.path} to={l.path}
              className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>⚡ SportPulse</h1>
        <p>Your one-stop platform for live scores, standings, stats and more</p>
        <div className="hero-cards">
          <Link to="/standings" className="hero-card">🏆<span>Standings</span></Link>
          <Link to="/h2h" className="hero-card">⚔️<span>Head to Head</span></Link>
          <Link to="/archive" className="hero-card">📁<span>Archive</span></Link>
          <Link to="/player" className="hero-card">👤<span>Player Stats</span></Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/h2h" element={<H2H />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/player" element={<PlayerStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;