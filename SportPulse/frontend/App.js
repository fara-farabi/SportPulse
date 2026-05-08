import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Standings from './pages/Standings';
import H2H from './pages/H2H';
import Archive from './pages/Archive';
import PlayerStats from './pages/PlayerStats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/standings" element={<Standings />} />
        <Route path="/h2h" element={<H2H />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/player" element={<PlayerStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;