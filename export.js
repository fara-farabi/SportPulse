const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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

// Export football data as CSV
router.get('/football/csv', async (req, res) => {
  try {
    const content = fs.readFileSync(FOOTBALL_CSV, 'utf8');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=football_matches.csv');
    res.send(content);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Export cricket data as CSV
router.get('/cricket/csv', async (req, res) => {
  try {
    const content = fs.readFileSync(CRICKET_CSV, 'utf8');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=cricket_matches.csv');
    res.send(content);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Export football data as JSON
router.get('/football/json', async (req, res) => {
  try {
    const data = await loadCSV(FOOTBALL_CSV);
    res.setHeader('Content-Disposition', 'attachment; filename=football_matches.json');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Export cricket data as JSON
router.get('/cricket/json', async (req, res) => {
  try {
    const data = await loadCSV(CRICKET_CSV);
    res.setHeader('Content-Disposition', 'attachment; filename=cricket_matches.json');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;