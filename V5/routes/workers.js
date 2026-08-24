const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/workers — list all workers (with optional category filter)
router.get('/', (req, res) => {
  const { category, available, limit = 20 } = req.query;
  let query = 'SELECT * FROM workers WHERE 1=1';
  const params = [];
  if (category && category !== 'All professionals') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (available === '1') {
    query += ' AND available = 1';
  }
  query += ' ORDER BY rating DESC, jobs_count DESC LIMIT ?';
  params.push(parseInt(limit));
  const workers = db.prepare(query).all(...params);
  // Format for frontend compatibility
  const formatted = workers.map(w => ({
    ...w,
    jobs: `${w.jobs_count} jobs`,
    cls: rankToCls(w.rank)
  }));
  res.json({ success: true, workers: formatted });
});

// GET /api/workers/:id
router.get('/:id', (req, res) => {
  const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  const reviews = db.prepare('SELECT * FROM reviews WHERE worker_id = ? ORDER BY created_at DESC LIMIT 5').all(req.params.id);
  res.json({ success: true, worker: { ...worker, jobs: `${worker.jobs_count} jobs`, cls: rankToCls(worker.rank) }, reviews });
});

// PUT /api/workers/:id — update profile
router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, location, lat, lng, image, available, rate, skills } = req.body;
  db.prepare(`
    UPDATE workers SET
      name = COALESCE(?, name),
      location = COALESCE(?, location),
      lat = COALESCE(?, lat),
      lng = COALESCE(?, lng),
      image = COALESCE(?, image),
      available = COALESCE(?, available),
      rate = COALESCE(?, rate),
      skills = COALESCE(?, skills)
    WHERE id = ?
  `).run(name, location, lat, lng, image, available, rate, skills, req.params.id);
  const updated = db.prepare('SELECT * FROM workers WHERE id = ?').get(req.params.id);
  res.json({ success: true, worker: { ...updated, jobs: `${updated.jobs_count} jobs`, cls: rankToCls(updated.rank) } });
});

// GET /api/workers/:id/jobs — worker's accepted/completed jobs
router.get('/:id/jobs', (req, res) => {
  const jobs = db.prepare(`
    SELECT j.*, a.status as application_status, a.applied_at
    FROM jobs j
    JOIN applications a ON j.id = a.job_id
    WHERE a.worker_id = ?
    ORDER BY a.applied_at DESC
  `).all(req.params.id);
  res.json({ success: true, jobs });
});

// GET /api/workers/:id/reviews
router.get('/:id/reviews', (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews WHERE worker_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ success: true, reviews });
});

function rankToCls(rank) {
  const map = { SILVER: 'silver', GOLD: 'gold', DIAMOND: 'diamond', VIP: 'pro' };
  return map[rank] || 'silver';
}

module.exports = router;
