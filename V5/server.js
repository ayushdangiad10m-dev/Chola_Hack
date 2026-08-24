require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3001', 'file://', 'null', '*'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // 10mb for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nirmaan Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── Stats endpoint (for dashboard/hackathon demo) ──────────────────
app.get('/api/stats', (req, res) => {
  const db = require('./db');
  const workers = db.prepare('SELECT COUNT(*) as c FROM workers').get().c;
  const customers = db.prepare('SELECT COUNT(*) as c FROM customers').get().c;
  const jobs = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;
  const openJobs = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'open'").get().c;
  const hiredJobs = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'hired'").get().c;
  res.json({ workers, customers, jobs, openJobs, hiredJobs });
});

// ── Catch-all: serve index.html for SPA routing ───────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// ── Global error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🏗️  NIRMAAN BACKEND — RUNNING          ║');
  console.log(`║   📡 http://localhost:${PORT}              ║`);
  console.log('║   📊 API: /api/health                    ║');
  console.log('║   🌐 Frontend: open index.html           ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
