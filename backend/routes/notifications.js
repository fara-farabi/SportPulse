const express = require('express');
const router = express.Router();

let notifications = [
  { id: 1, title: 'Match Starting Soon', message: 'Man City vs Arsenal kicks off in 30 mins!', type: 'match', sent: true, time: '2 hours ago', recipients: 1250 },
  { id: 2, title: 'Score Update', message: 'GOAL! Haaland scores for Man City (67\')', type: 'goal', sent: true, time: '1 hour ago', recipients: 980 },
  { id: 3, title: 'New Tournament', message: 'ICC World Cup 2026 registration now open!', type: 'tournament', sent: false, time: 'Draft', recipients: 0 },
];

// Get all notifications
router.get('/', (req, res) => {
  res.json({ success: true, data: notifications });
});

// Send a new notification
router.post('/send', (req, res) => {
  const { title, message, type } = req.body;
  if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' });
  const newNotif = {
    id: Date.now(),
    title,
    message,
    type: type || 'general',
    sent: true,
    time: 'Just now',
    recipients: Math.floor(Math.random() * 2000) + 500,
  };
  notifications.push(newNotif);
  res.json({ success: true, message: 'Notification sent!', data: newNotif });
});

// Save as draft
router.post('/draft', (req, res) => {
  const { title, message, type } = req.body;
  const draft = {
    id: Date.now(),
    title,
    message,
    type: type || 'general',
    sent: false,
    time: 'Draft',
    recipients: 0,
  };
  notifications.push(draft);
  res.json({ success: true, message: 'Saved as draft', data: draft });
});

// Delete notification
router.delete('/:id', (req, res) => {
  notifications = notifications.filter(n => n.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

module.exports = router;