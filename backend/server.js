const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
const PORT = 3001;
const matchEditRoutes = require('./routes/matchEdit');
const matchAddRoutes = require('./routes/matchAdd');
const userRoutes = require('./routes/users');
const exportRoutes = require('./routes/export');
const notificationRoutes = require('./routes/notifications');
const contentRoutes = require('./routes/content');

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use('/api/admin/matches/edit', matchEditRoutes);
app.use('/api/admin/matches/add', matchAddRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/export', exportRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/admin/content', contentRoutes);

// ── CSV LOADER ─────────────────────────────────────────────────────────────
function loadCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, filename);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// ── IN-MEMORY STORE (Admin data) ───────────────────────────────────────────
let trendingTournaments = [
  { id: 1, name: "UEFA Champions League Final", date: "2026-05-31", sport: "football", highlighted: true },
  { id: 2, name: "IPL 2026 Final", date: "2026-06-01", sport: "cricket", highlighted: true },
  { id: 3, name: "NBA Playoffs 2026", date: "2026-06-15", sport: "basketball", highlighted: false },
];

let comments = [
  { id: 1, user: "fan123", text: "Great match!", article: "football-1", status: "approved", time: "2 hours ago" },
  { id: 2, user: "sportslover", text: "Incredible performance!", article: "cricket-1", status: "approved", time: "4 hours ago" },
  { id: 3, user: "spammer99", text: "Buy cheap stuff at...", article: "football-1", status: "pending", time: "1 hour ago" },
];

let scoreOverrides = {};

let engagementStats = {
  totalVisits: 15420,
  activeUsers: 342,
  topFeatures: [
    { feature: "Live Scores", clicks: 8920 },
    { feature: "Standings", clicks: 5430 },
    { feature: "H2H", clicks: 3210 },
    { feature: "Archive", clicks: 2100 },
    { feature: "News", clicks: 1890 },
  ],
  topSports: [
    { sport: "Football", visits: 7200 },
    { sport: "Cricket", visits: 5100 },
    { sport: "Basketball", visits: 3120 },
  ]
};

// ── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "SportPulse API is running!", status: "OK" });
});

// ── LIVE SCORES ────────────────────────────────────────────────────────────
app.get("/api/scores/live", (req, res) => {
  const mockLiveScores = [
    { id: 1, sport: "football", homeTeam: "Manchester City", awayTeam: "Arsenal", homeScore: 2, awayScore: 1, minute: 67, status: "LIVE", league: "Premier League" },
    { id: 2, sport: "cricket", homeTeam: "India", awayTeam: "Australia", homeScore: "245/6", awayScore: "38 overs", minute: null, status: "LIVE", league: "ICC World Cup" },
    { id: 3, sport: "basketball", homeTeam: "Lakers", awayTeam: "Bulls", homeScore: 89, awayScore: 84, minute: "Q3", status: "LIVE", league: "NBA" },
  ];
  const { sport } = req.query;
  const data = sport ? mockLiveScores.filter(s => s.sport === sport) : mockLiveScores;
  // Apply admin overrides
  const overridden = data.map(m => scoreOverrides[m.id] ? { ...m, ...scoreOverrides[m.id] } : m);
  res.json({ success: true, data: overridden, count: overridden.length });
});

// ── NEWS ───────────────────────────────────────────────────────────────────
app.get("/api/news", (req, res) => {
  const mockNews = [
    { id: 1, title: "Haaland scores hat-trick to lead City to victory", summary: "Manchester City dominated the match.", sport: "football", time: "2 hours ago" },
    { id: 2, title: "India posts massive total in World Cup opener", summary: "Rohit Sharma led India to a record total.", sport: "cricket", time: "4 hours ago" },
    { id: 3, title: "LeBron James returns from injury in style", summary: "LeBron put up 35 points to lift the Lakers.", sport: "basketball", time: "6 hours ago" },
    { id: 4, title: "Real Madrid top La Liga after comeback win", summary: "Real Madrid secured crucial 3 points.", sport: "football", time: "8 hours ago" },
    { id: 5, title: "IPL 2026: Mumbai Indians beat Chennai Super Kings", summary: "Thrilling last-over finish at the IPL.", sport: "cricket", time: "10 hours ago" },
  ];
  const { sport } = req.query;
  const data = sport ? mockNews.filter(n => n.sport === sport) : mockNews;
  res.json({ success: true, data, count: data.length });
});

// ── STANDINGS (calculated from CSV) ───────────────────────────────────────
app.get("/api/standings/:league", async (req, res) => {
  try {
    const data = await loadCSV("SportPulse_Database.csv");
    const leagueMap = {
      "premier-league": "Premier League",
      "la-liga": "La Liga",
      "champions-league": "Champions League",
      "football": "Premier League"
    };
    const targetLeague = leagueMap[req.params.league] || req.params.league;
    const filtered = data.filter(r => r.League === targetLeague);
    const teams = {};
    filtered.forEach(row => {
      const home = row["Home Team"];
      const away = row["Away Team"];
      const hs = parseInt(row["Home Score"]);
      const as = parseInt(row["Away Score"]);
      if (!teams[home]) teams[home] = { team: home, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
      if (!teams[away]) teams[away] = { team: away, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
      teams[home].played++; teams[away].played++;
      teams[home].gf += hs; teams[home].ga += as;
      teams[away].gf += as; teams[away].ga += hs;
      if (hs > as) { teams[home].won++; teams[home].points += 3; teams[away].lost++; }
      else if (hs < as) { teams[away].won++; teams[away].points += 3; teams[home].lost++; }
      else { teams[home].drawn++; teams[home].points++; teams[away].drawn++; teams[away].points++; }
    });
    const standings = Object.values(teams)
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga))
      .map((t, i) => ({ position: i + 1, ...t, gd: t.gf - t.ga }));
    res.json({ success: true, league: targetLeague, data: standings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── FOOTBALL MATCHES (Archive) ─────────────────────────────────────────────
app.get("/api/football/matches", async (req, res) => {
  try {
    const data = await loadCSV("SportPulse_Database.csv");
    const { league, team, search } = req.query;
    let results = data.map(row => ({
      id: row.Match_ID,
      league: row.League,
      date: new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-GB"),
      stadium: row.Stadium,
      homeTeam: row["Home Team"],
      awayTeam: row["Away Team"],
      homeScore: parseInt(row["Home Score"]),
      awayScore: parseInt(row["Away Score"]),
      sport: "football"
    }));
    if (league) results = results.filter(r => r.league.toLowerCase().includes(league.toLowerCase()));
    if (team) results = results.filter(r =>
      r.homeTeam.toLowerCase().includes(team.toLowerCase()) ||
      r.awayTeam.toLowerCase().includes(team.toLowerCase())
    );
    if (search) results = results.filter(r =>
      r.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
      r.awayTeam.toLowerCase().includes(search.toLowerCase()) ||
      r.league.toLowerCase().includes(search.toLowerCase()) ||
      r.stadium.toLowerCase().includes(search.toLowerCase())
    );
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── CRICKET MATCHES (Archive) ──────────────────────────────────────────────
app.get("/api/cricket/matches", async (req, res) => {
  try {
    const data = await loadCSV("SportPulse_Cricket_Database.csv");
    const { tournament, team, search } = req.query;
    let results = data.map(row => ({
      id: row.Match_ID,
      tournament: row.Tournament,
      stadium: row.Stadium,
      team1: row["Team 1"],
      team2: row["Team 2"],
      team1Score: row["Team 1 Score"],
      team2Score: row["Team 2 Score"],
      sport: "cricket"
    }));
    if (tournament) results = results.filter(r => r.tournament.toLowerCase().includes(tournament.toLowerCase()));
    if (team) results = results.filter(r =>
      r.team1.toLowerCase().includes(team.toLowerCase()) ||
      r.team2.toLowerCase().includes(team.toLowerCase())
    );
    if (search) results = results.filter(r =>
      r.team1.toLowerCase().includes(search.toLowerCase()) ||
      r.team2.toLowerCase().includes(search.toLowerCase()) ||
      r.tournament.toLowerCase().includes(search.toLowerCase())
    );
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── HEAD TO HEAD ───────────────────────────────────────────────────────────
app.get("/api/h2h", async (req, res) => {
  try {
    const { team1, team2 } = req.query;
    if (!team1 || !team2) return res.status(400).json({ success: false, message: "team1 and team2 required" });
    const data = await loadCSV("SportPulse_Database.csv");
    const matches = data.filter(row =>
      (row["Home Team"].toLowerCase().includes(team1.toLowerCase()) && row["Away Team"].toLowerCase().includes(team2.toLowerCase())) ||
      (row["Home Team"].toLowerCase().includes(team2.toLowerCase()) && row["Away Team"].toLowerCase().includes(team1.toLowerCase()))
    ).map(row => ({
      id: row.Match_ID,
      league: row.League,
      date: new Date(parseInt(row.Date) * 1000).toLocaleDateString("en-GB"),
      stadium: row.Stadium,
      homeTeam: row["Home Team"],
      awayTeam: row["Away Team"],
      homeScore: parseInt(row["Home Score"]),
      awayScore: parseInt(row["Away Score"]),
    }));
    let team1Wins = 0, team2Wins = 0, draws = 0;
    let team1Goals = 0, team2Goals = 0;
    matches.forEach(m => {
      const t1IsHome = m.homeTeam.toLowerCase().includes(team1.toLowerCase());
      const t1Score = t1IsHome ? m.homeScore : m.awayScore;
      const t2Score = t1IsHome ? m.awayScore : m.homeScore;
      team1Goals += t1Score;
      team2Goals += t2Score;
      if (t1Score > t2Score) team1Wins++;
      else if (t1Score < t2Score) team2Wins++;
      else draws++;
    });
    res.json({
      success: true, team1, team2,
      summary: { team1Wins, team2Wins, draws, total: matches.length, team1Goals, team2Goals },
      matches
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PLAYER STATS (mock) ────────────────────────────────────────────────────
app.get("/api/players", (req, res) => {
  const players = [
    { id: 1, name: "Erling Haaland", team: "Manchester City", league: "Premier League", position: "Forward", goals: 32, assists: 8, matches: 35, rating: 9.1, yellowCards: 2, redCards: 0, heatmap: [8,6,9,7,8,9,8,7,9,8,6,9,8,7,8,9,8,7,6,9] },
    { id: 2, name: "Mohamed Salah", team: "Liverpool", league: "Premier League", position: "Forward", goals: 28, assists: 14, matches: 36, rating: 8.9, yellowCards: 1, redCards: 0, heatmap: [7,8,9,8,7,9,8,9,7,8,9,8,7,9,8,7,8,9,8,7] },
    { id: 3, name: "Vinicius Jr", team: "Real Madrid", league: "La Liga", position: "Forward", goals: 24, assists: 11, matches: 34, rating: 8.7, yellowCards: 4, redCards: 1, heatmap: [9,8,7,9,8,7,9,8,9,7,8,9,8,7,9,8,7,9,8,7] },
    { id: 4, name: "Kylian Mbappe", team: "Real Madrid", league: "La Liga", position: "Forward", goals: 30, assists: 9, matches: 35, rating: 9.0, yellowCards: 3, redCards: 0, heatmap: [8,9,8,7,9,8,9,7,8,9,8,7,9,8,7,9,8,9,7,8] },
    { id: 5, name: "Bukayo Saka", team: "Arsenal", league: "Premier League", position: "Midfielder", goals: 18, assists: 16, matches: 37, rating: 8.5, yellowCards: 2, redCards: 0, heatmap: [7,8,8,9,7,8,9,8,7,8,9,7,8,9,8,7,8,9,8,7] },
    { id: 6, name: "Jude Bellingham", team: "Real Madrid", league: "La Liga", position: "Midfielder", goals: 22, assists: 13, matches: 36, rating: 8.8, yellowCards: 5, redCards: 0, heatmap: [8,7,9,8,9,7,8,9,8,7,9,8,7,8,9,8,9,7,8,9] },
  ];
  const { search, league, position } = req.query;
  let results = players;
  if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()));
  if (league) results = results.filter(p => p.league.toLowerCase().includes(league.toLowerCase()));
  if (position) results = results.filter(p => p.position.toLowerCase().includes(position.toLowerCase()));
  res.json({ success: true, data: results });
});

// ── SEARCH ─────────────────────────────────────────────────────────────────
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Query param q is required" });
    const [football, cricket] = await Promise.all([
      loadCSV("SportPulse_Database.csv"),
      loadCSV("SportPulse_Cricket_Database.csv")
    ]);
    const query = q.toLowerCase();
    res.json({
      success: true, query: q, results: {
        footballTeams: [...new Set(football.flatMap(r => [r["Home Team"], r["Away Team"]]))].filter(t => t.toLowerCase().includes(query)),
        cricketTeams: [...new Set(cricket.flatMap(r => [r["Team 1"], r["Team 2"]]))].filter(t => t.toLowerCase().includes(query)),
        leagues: [...new Set(football.map(r => r.League))].filter(l => l.toLowerCase().includes(query)),
        tournaments: [...new Set(cricket.map(r => r.Tournament))].filter(t => t.toLowerCase().includes(query)),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: Get dashboard stats ─────────────────────────────────────────────
app.get("/api/admin/stats", (req, res) => {
  res.json({ success: true, data: engagementStats });
});

// ── ADMIN: Override a live score ───────────────────────────────────────────
app.post("/api/admin/scores/override", (req, res) => {
  const { matchId, homeScore, awayScore } = req.body;
  if (!matchId) return res.status(400).json({ success: false, message: "matchId required" });
  scoreOverrides[matchId] = { homeScore, awayScore };
  res.json({ success: true, message: "Score overridden successfully" });
});

// ── ADMIN: Get all score overrides ────────────────────────────────────────
app.get("/api/admin/scores/overrides", (req, res) => {
  res.json({ success: true, data: scoreOverrides });
});

// ── ADMIN: Trending tournaments ────────────────────────────────────────────
app.get("/api/admin/trending", (req, res) => {
  res.json({ success: true, data: trendingTournaments });
});

app.post("/api/admin/trending", (req, res) => {
  const { name, date, sport } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "name required" });
  const newItem = { id: Date.now(), name, date, sport, highlighted: true };
  trendingTournaments.push(newItem);
  res.json({ success: true, data: newItem });
});

app.delete("/api/admin/trending/:id", (req, res) => {
  trendingTournaments = trendingTournaments.filter(t => t.id !== parseInt(req.params.id));
  res.json({ success: true, message: "Deleted" });
});

app.patch("/api/admin/trending/:id", (req, res) => {
  trendingTournaments = trendingTournaments.map(t =>
    t.id === parseInt(req.params.id) ? { ...t, ...req.body } : t
  );
  res.json({ success: true });
});

// ── ADMIN: Comments moderation ─────────────────────────────────────────────
app.get("/api/admin/comments", (req, res) => {
  res.json({ success: true, data: comments });
});

app.patch("/api/admin/comments/:id", (req, res) => {
  comments = comments.map(c =>
    c.id === parseInt(req.params.id) ? { ...c, status: req.body.status } : c
  );
  res.json({ success: true });
});

app.delete("/api/admin/comments/:id", (req, res) => {
  comments = comments.filter(c => c.id !== parseInt(req.params.id));
  res.json({ success: true, message: "Comment deleted" });
});

// ── PUBLIC: Get trending ───────────────────────────────────────────────────
app.get("/api/trending", (req, res) => {
  res.json({ success: true, data: trendingTournaments.filter(t => t.highlighted) });
});

app.listen(PORT, () => {
  console.log("SportPulse backend running at http://localhost:" + PORT);
});