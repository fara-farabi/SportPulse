const express = require('express');
const router = express.Router();

let articles = [
  { id: 1, title: 'Haaland scores hat-trick to lead City to victory', body: 'Erling Haaland was unstoppable as Manchester City dominated the match with a brilliant display of finishing.', sport: 'football', status: 'published', author: 'Admin', time: '2 hours ago' },
  { id: 2, title: 'India posts massive total in World Cup opener', body: 'Rohit Sharma led India to a record-breaking total as they set a tough target for Australia in the World Cup opener.', sport: 'cricket', status: 'published', author: 'Admin', time: '4 hours ago' },
  { id: 3, title: 'LeBron James returns from injury in style', body: 'LeBron put up 35 points on his return to lift the Lakers over the Bulls in a thrilling contest at the Staples Center.', sport: 'basketball', status: 'draft', author: 'Admin', time: 'Draft' },
];

// Get all articles
router.get('/', (req, res) => {
  const { sport, status } = req.query;
  let result = articles;
  if (sport) result = result.filter(a => a.sport === sport);
  if (status) result = result.filter(a => a.status === status);
  res.json({ success: true, count: result.length, data: result });
});

// Add article
router.post('/', (req, res) => {
  const { title, body, sport, status } = req.body;
  if (!title || !body) return res.status(400).json({ success: false, message: 'Title and body required' });
  const newArticle = {
    id: Date.now(),
    title, body,
    sport: sport || 'football',
    status: status || 'draft',
    author: 'Admin',
    time: 'Just now',
  };
  articles.push(newArticle);
  res.json({ success: true, message: 'Article created', data: newArticle });
});

// Update article
router.patch('/:id', (req, res) => {
  articles = articles.map(a => a.id === parseInt(req.params.id) ? { ...a, ...req.body } : a);
  res.json({ success: true, message: 'Article updated' });
});

// Delete article
router.delete('/:id', (req, res) => {
  articles = articles.filter(a => a.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Article deleted' });
});

module.exports = router;