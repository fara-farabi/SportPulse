const express = require('express');
const router = express.Router();

// In-memory user store
let users = [
  { id: 1, username: 'fan123', email: 'fan123@email.com', status: 'active', joined: '2026-01-15', role: 'user' },
  { id: 2, username: 'sportslover', email: 'sports@email.com', status: 'active', joined: '2026-02-20', role: 'user' },
  { id: 3, username: 'spammer99', email: 'spam@email.com', status: 'banned', joined: '2026-03-10', role: 'user' },
  { id: 4, username: 'cricketfan', email: 'cricket@email.com', status: 'active', joined: '2026-03-22', role: 'user' },
  { id: 5, username: 'gooner_forever', email: 'arsenal@email.com', status: 'active', joined: '2026-04-01', role: 'user' },
];

// Get all users
router.get('/', (req, res) => {
  const { search, status } = req.query;
  let result = users;
  if (search) result = result.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  if (status) result = result.filter(u => u.status === status);
  res.json({ success: true, count: result.length, data: result });
});

// Ban a user
router.patch('/:id/ban', (req, res) => {
  users = users.map(u => u.id === parseInt(req.params.id) ? { ...u, status: 'banned' } : u);
  res.json({ success: true, message: 'User banned' });
});

// Unban a user
router.patch('/:id/unban', (req, res) => {
  users = users.map(u => u.id === parseInt(req.params.id) ? { ...u, status: 'active' } : u);
  res.json({ success: true, message: 'User unbanned' });
});

// Delete a user
router.delete('/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'User deleted' });
});

module.exports = router;