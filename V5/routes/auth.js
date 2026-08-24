const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'nirmaan_mvp_secret_2026';
const DEMO_OTP = '1234';

function makeToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  const { phone, role } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone required' });
  }
  // In demo/MVP, OTP is always 1234
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT OR REPLACE INTO otp_sessions (phone, otp, role, expires_at, used)
    VALUES (?, ?, ?, ?, 0)
  `).run(phone, DEMO_OTP, role || 'worker', expiresAt);

  res.json({
    success: true,
    message: `OTP sent to +91 ${phone}`,
    demo_otp: DEMO_OTP  // Only in dev — remove in production
  });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { phone, otp, role } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });
  if (otp !== DEMO_OTP) return res.status(401).json({ error: 'Invalid OTP' });

  // Check if user exists
  let user = null;
  let userType = role || 'worker';

  if (userType === 'worker') {
    user = db.prepare('SELECT * FROM workers WHERE phone = ?').get(phone);
  } else {
    user = db.prepare('SELECT * FROM customers WHERE phone = ?').get(phone);
  }

  if (!user) {
    return res.json({
      success: true,
      isNewUser: true,
      role: userType,
      phone,
      message: 'New user — please complete registration'
    });
  }

  const token = makeToken({ id: user.id, phone, role: userType });
  return res.json({
    success: true,
    isNewUser: false,
    role: userType,
    token,
    user
  });
});

// POST /api/auth/register/worker
router.post('/register/worker', (req, res) => {
  const { name, phone, category, role, experience, aadhaarLast4, location, lat, lng, image, rate } = req.body;
  if (!name || !phone || !category) {
    return res.status(400).json({ error: 'Name, phone, and category are required' });
  }

  const existing = db.prepare('SELECT id FROM workers WHERE phone = ?').get(phone);
  if (existing) {
    const token = makeToken({ id: existing.id, phone, role: 'worker' });
    const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(existing.id);
    return res.json({ success: true, token, worker, message: 'Worker already registered, logged in.' });
  }

  const id = uuidv4();
  const rateVal = rate || '₹850/day';
  const roleVal = role || category;

  db.prepare(`
    INSERT INTO workers (id, name, phone, role, category, rank, rating, jobs_count, rate, image, location, lat, lng, experience, aadhaar_last4, available, skills)
    VALUES (?, ?, ?, ?, ?, 'SILVER', 5.0, 0, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(id, name, phone, roleVal, category, rateVal, image || '', location || 'India', lat || 12.9716, lng || 77.6412, experience || '1-2 years', aadhaarLast4 || '', category);

  const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(id);
  const token = makeToken({ id, phone, role: 'worker' });
  res.json({ success: true, token, worker });
});

// POST /api/auth/register/customer
router.post('/register/customer', (req, res) => {
  const { name, phone, location, lat, lng, image, siteType, budget } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const existing = db.prepare('SELECT id FROM customers WHERE phone = ?').get(phone);
  if (existing) {
    const token = makeToken({ id: existing.id, phone, role: 'customer' });
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(existing.id);
    return res.json({ success: true, token, customer, message: 'Customer already registered, logged in.' });
  }

  const id = uuidv4();
  db.prepare(`
    INSERT INTO customers (id, name, phone, location, lat, lng, image, site_type, budget)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, phone, location || '', lat || 12.9716, lng || 77.6412, image || '', siteType || 'Residential', budget || '');

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  const token = makeToken({ id, phone, role: 'customer' });
  res.json({ success: true, token, customer });
});

module.exports = router;
