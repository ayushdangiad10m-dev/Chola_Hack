const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// GET /api/jobs — feed for workers (open jobs)
router.get('/', optionalAuth, (req, res) => {
  const { trade, status = 'open', limit = 20 } = req.query;
  let query = 'SELECT * FROM jobs WHERE status = ?';
  const params = [status];
  if (trade && trade !== 'All') {
    query += ' AND trade = ?';
    params.push(trade);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit));
  const jobs = db.prepare(query).all(...params);
  res.json({ success: true, jobs });
});

// POST /api/jobs — customer posts a job
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can post jobs' });
  }
  const { title, trade, location, lat, lng, rate, days, description, budget } = req.body;
  if (!title || !trade || !location) {
    return res.status(400).json({ error: 'Title, trade, and location are required' });
  }
  const customer = db.prepare('SELECT name FROM customers WHERE id = ?').get(req.user.id);
  const id = uuidv4();
  db.prepare(`
    INSERT INTO jobs (id, customer_id, customer_name, title, trade, location, lat, lng, rate, days, description, budget, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `).run(
    id, req.user.id, customer?.name || 'Customer',
    title, trade, location, lat || 12.9716, lng || 77.6412,
    rate || '₹900/day', days || '2 days', description || '', budget || ''
  );
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  res.json({ success: true, job });
});

// GET /api/jobs/:id
router.get('/:id', (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const applications = db.prepare(`
    SELECT a.*, w.name as worker_name, w.category, w.rating, w.rank, w.image, w.phone, w.rate, w.experience
    FROM applications a
    JOIN workers w ON a.worker_id = w.id
    WHERE a.job_id = ?
    ORDER BY w.rating DESC
  `).all(req.params.id);
  res.json({ success: true, job, applications });
});

// POST /api/jobs/:id/apply — worker applies for a job
router.post('/:id/apply', authMiddleware, (req, res) => {
  if (req.user.role !== 'worker') {
    return res.status(403).json({ error: 'Only workers can apply' });
  }
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'open') return res.status(400).json({ error: 'Job is no longer open' });

  const existing = db.prepare('SELECT id FROM applications WHERE job_id = ? AND worker_id = ?').get(req.params.id, req.user.id);
  if (existing) return res.status(409).json({ error: 'Already applied', applicationId: existing.id });

  const id = uuidv4();
  const { message } = req.body;
  db.prepare(`INSERT INTO applications (id, job_id, worker_id, status, message) VALUES (?, ?, ?, 'pending', ?)`).run(id, req.params.id, req.user.id, message || '');

  res.json({ success: true, message: 'Application submitted!', applicationId: id });
});

// POST /api/jobs/:id/hire — customer hires a specific worker
router.post('/:id/hire', authMiddleware, (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can hire' });
  }
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.customer_id && job.customer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your job' });
  }

  const { workerId } = req.body;
  if (!workerId) return res.status(400).json({ error: 'workerId required' });

  const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(workerId);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  // Update job
  db.prepare(`UPDATE jobs SET status = 'hired', hired_worker_id = ?, customer_id = ? WHERE id = ?`).run(workerId, req.user.id, req.params.id);

  // Accept this application, reject others
  db.prepare(`UPDATE applications SET status = 'accepted' WHERE job_id = ? AND worker_id = ?`).run(req.params.id, workerId);
  db.prepare(`UPDATE applications SET status = 'rejected' WHERE job_id = ? AND worker_id != ?`).run(req.params.id, workerId);

  // Update worker job count
  db.prepare(`UPDATE workers SET jobs_count = jobs_count + 1 WHERE id = ?`).run(workerId);

  // Auto-recalculate rank
  recalculateRank(workerId);

  res.json({ success: true, message: `${worker.name} hired successfully!`, worker });
});

// POST /api/jobs/:id/complete — mark job as completed
router.post('/:id/complete', authMiddleware, (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  db.prepare(`UPDATE jobs SET status = 'completed' WHERE id = ?`).run(req.params.id);

  // If review provided
  const { rating, reviewText, workerId } = req.body;
  if (rating && workerId) {
    const rid = uuidv4();
    db.prepare(`INSERT INTO reviews (id, worker_id, customer_id, job_id, rating, text) VALUES (?, ?, ?, ?, ?, ?)`).run(rid, workerId, req.user.id, req.params.id, rating, reviewText || '');

    // Update worker average rating
    const avgResult = db.prepare(`SELECT AVG(rating) as avg_rating, COUNT(*) as cnt FROM reviews WHERE worker_id = ?`).get(workerId);
    if (avgResult) {
      db.prepare(`UPDATE workers SET rating = ? WHERE id = ?`).run(Math.round(avgResult.avg_rating * 10) / 10, workerId);
    }
    recalculateRank(workerId);
  }

  res.json({ success: true, message: 'Job marked as completed' });
});

// DELETE /api/jobs/:id — customer removes job
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  if (job.customer_id !== req.user.id) return res.status(403).json({ error: 'Not your job' });
  db.prepare('DELETE FROM applications WHERE job_id = ?').run(req.params.id);
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

function recalculateRank(workerId) {
  const w = db.prepare('SELECT jobs_count, rating FROM workers WHERE id = ?').get(workerId);
  if (!w) return;
  const score = 15 + (w.jobs_count * 14) + ((w.rating - 4.0) * 10);
  let rank = 'SILVER';
  if (score >= 90) rank = 'VIP';
  else if (score >= 70) rank = 'DIAMOND';
  else if (score >= 40) rank = 'GOLD';
  db.prepare('UPDATE workers SET rank = ? WHERE id = ?').run(rank, workerId);
}

module.exports = router;
