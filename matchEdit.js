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

// Edit a football match
router.patch('/football/:id', async (req, res) => {
  try {
    const data = await loadCSV(FOOTBALL_CSV);
    const idx = data.findIndex(r => r.Match_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Match not found' });
    data[idx] = { ...data[idx], ...req.body };
    const csvContent = parse(data);
    fs.writeFileSync(FOOTBALL_CSV, csvContent);
    res.json({ success: true, message: 'Match updated', data: data[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Edit a cricket match
router.patch('/cricket/:id', async (req, res) => {
  try {
    const data = await loadCSV(CRICKET_CSV);
    const idx = data.findIndex(r => r.Match_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Match not found' });
    data[idx] = { ...data[idx], ...req.body };
    const csvContent = parse(data);
    fs.writeFileSync(CRICKET_CSV, csvContent);
    res.json({ success: true, message: 'Match updated', data: data[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;