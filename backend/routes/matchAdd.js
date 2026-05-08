const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

const FOOTBALL_CSV = path.join(__dirname, '../SportPulse_Database.csv');
const CRICKET_CSV = path.join(__dirname, '../SportPulse_Cricket_Database.csv');

function loadCSV(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', d => results.push(d))
      .on('end', () => resolve(results))
      .on('error', err => reject(err));
  });
}

// Add a football match
router.post('/football', async (req, res) => {
  try {
    const data = await loadCSV(FOOTBALL_CSV);
    const newMatch = {
      Match_ID: Date.now().toString(),
      League: req.body.league || 'Premier League',
      Date: Math.floor(Date.now() / 1000).toString(),
      Stadium: req.body.stadium || 'Unknown',
      'Home Team': req.body.homeTeam,
      'Away Team': req.body.awayTeam,
      'Home Score': req.body.homeScore || '0',
      'Away Score': req.body.awayScore || '0',
    };
    data.push(newMatch);
    const csvContent = parse(data);
    fs.writeFileSync(FOOTBALL_CSV, csvContent);
    res.json({ success: true, message: 'Match added', data: newMatch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a cricket match
router.post('/cricket', async (req, res) => {
  try {
    const data = await loadCSV(CRICKET_CSV);
    const newMatch = {
      Match_ID: Date.now().toString(),
      Tournament: req.body.tournament || 'Unknown Tournament',
      Date: Math.floor(Date.now() / 1000).toString(),
      Stadium: req.body.stadium || 'Unknown',
      'Team 1': req.body.team1,
      'Team 2': req.body.team2,
      'Team 1 Score': req.body.team1Score || '0/0',
      'Team 2 Score': req.body.team2Score || '0/0',
    };
    data.push(newMatch);
    const csvContent = parse(data);
    fs.writeFileSync(CRICKET_CSV, csvContent);
    res.json({ success: true, message: 'Match added', data: newMatch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;