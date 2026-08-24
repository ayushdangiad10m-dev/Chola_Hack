const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/customers/:id
router.get('/:id', (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json({ success: true, customer });
});

// PUT /api/customers/:id
router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.id !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
  const { name, location, lat, lng, image, siteType, budget } = req.body;
  db.prepare(`
    UPDATE customers SET
      name = COALESCE(?, name),
      location = COALESCE(?, location),
      lat = COALESCE(?, lat),
      lng = COALESCE(?, lng),
      image = COALESCE(?, image),
      site_type = COALESCE(?, site_type),
      budget = COALESCE(?, budget)
    WHERE id = ?
  `).run(name, location, lat, lng, image, siteType, budget, req.params.id);
  const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  res.json({ success: true, customer: updated });
});

// GET /api/customers/:id/jobs — jobs posted by customer
router.get('/:id/jobs', (req, res) => {
  const jobs = db.prepare(`
    SELECT j.*,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'pending') as pending_count,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as total_applicants
    FROM jobs j
    WHERE j.customer_id = ?
    ORDER BY j.created_at DESC
  `).all(req.params.id);
  res.json({ success: true, jobs });
});

module.exports = router;
