const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'nirmaan.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ─────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Labour',
    category TEXT DEFAULT 'General',
    rank TEXT DEFAULT 'SILVER',
    rating REAL DEFAULT 5.0,
    jobs_count INTEGER DEFAULT 0,
    rate TEXT DEFAULT '₹800/day',
    image TEXT DEFAULT '',
    location TEXT DEFAULT 'India',
    lat REAL DEFAULT 12.9716,
    lng REAL DEFAULT 77.6412,
    experience TEXT DEFAULT '1-2 years',
    aadhaar_last4 TEXT DEFAULT '',
    available INTEGER DEFAULT 1,
    skills TEXT DEFAULT '',
    distance TEXT DEFAULT 'Nearby',
    travel TEXT DEFAULT '₹0 — nearby zone',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    location TEXT DEFAULT '',
    lat REAL DEFAULT 12.9716,
    lng REAL DEFAULT 77.6412,
    image TEXT DEFAULT '',
    site_type TEXT DEFAULT 'Residential',
    budget TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    customer_name TEXT DEFAULT 'Anonymous',
    title TEXT NOT NULL,
    trade TEXT NOT NULL,
    location TEXT NOT NULL,
    lat REAL DEFAULT 12.9716,
    lng REAL DEFAULT 77.6412,
    rate TEXT DEFAULT '₹900/day',
    days TEXT DEFAULT '2 days',
    description TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    status TEXT DEFAULT 'open',
    hired_worker_id TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    message TEXT DEFAULT '',
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    UNIQUE(job_id, worker_id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    text TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS otp_sessions (
    phone TEXT PRIMARY KEY,
    otp TEXT DEFAULT '1234',
    role TEXT DEFAULT 'worker',
    expires_at TEXT,
    used INTEGER DEFAULT 0
  );
`);

// ── Seed demo workers if none exist ────────────────────────────────
const workerCount = db.prepare('SELECT COUNT(*) as c FROM workers').get().c;
if (workerCount === 0) {
  const insertWorker = db.prepare(`
    INSERT OR IGNORE INTO workers
    (id, name, phone, role, category, rank, rating, jobs_count, rate, image, location, lat, lng, experience, aadhaar_last4, available, skills, distance, travel)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedWorkers = [
    {
      id: 'arjun', name: 'Arjun Kumar', phone: '9876543210',
      role: 'Master Carpenter', category: 'Carpenter',
      rank: 'DIAMOND', rating: 4.9, jobs_count: 186,
      rate: '₹1,250/day',
      image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=180&q=80',
      location: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408,
      experience: '6-8 years', aadhaar_last4: '4521', available: 1,
      skills: 'Custom furniture · Wardrobes', distance: '1.2 km away', travel: '₹0 — nearby zone'
    },
    {
      id: 'meera', name: 'Meera S.', phone: '9845123456',
      role: 'Finish Painter', category: 'Painter',
      rank: 'GOLD', rating: 4.8, jobs_count: 94,
      rate: '₹1,050/day',
      image: 'https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=180&q=80',
      location: 'Domlur, Bengaluru', lat: 12.9612, lng: 77.6387,
      experience: '4-5 years', aadhaar_last4: '8832', available: 1,
      skills: 'Textures · Color consultation', distance: '2.1 km away', travel: '₹60 travel support'
    },
    {
      id: 'sameer', name: 'Sameer Khan', phone: '9811223344',
      role: 'Masonry Pro', category: 'Mason',
      rank: 'VIP', rating: 4.9, jobs_count: 241,
      rate: '₹1,500/day',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=180&q=80',
      location: 'Koramangala, Bengaluru', lat: 12.9716, lng: 77.6522,
      experience: '10+ years', aadhaar_last4: '1103', available: 1,
      skills: 'Brickwork · Plastering', distance: '0.8 km away', travel: '₹0 — nearby zone'
    },
    {
      id: 'dev', name: 'Dev Raj', phone: '9740112233',
      role: 'Electrician', category: 'Electrician',
      rank: 'SILVER', rating: 4.7, jobs_count: 58,
      rate: '₹900/day',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80',
      location: 'HSR Layout, Bengaluru', lat: 12.9856, lng: 77.6191,
      experience: '2-3 years', aadhaar_last4: '7744', available: 1,
      skills: 'Wiring · Smart homes', distance: '3.0 km away', travel: '₹90 travel support'
    },
    {
      id: 'anita', name: 'Anita Devi', phone: '9900112244',
      role: 'Tile Specialist', category: 'Mason',
      rank: 'GOLD', rating: 4.8, jobs_count: 112,
      rate: '₹1,100/day',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
      location: 'Jayanagar, Bengaluru', lat: 12.9653, lng: 77.6289,
      experience: '5 years', aadhaar_last4: '3399', available: 1,
      skills: 'Bathroom · Floor tiling', distance: '1.7 km away', travel: '₹40 travel support'
    },
    {
      id: 'ravi', name: 'Ravi Teja', phone: '9886778899',
      role: 'Plumbing Expert', category: 'Plumber',
      rank: 'DIAMOND', rating: 4.9, jobs_count: 168,
      rate: '₹1,220/day',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80',
      location: 'Old Airport Rd, Bengaluru', lat: 12.9745, lng: 77.6501,
      experience: '8 years', aadhaar_last4: '6621', available: 1,
      skills: 'Piping · Fixtures', distance: '2.4 km away', travel: '₹75 travel support'
    }
  ];
  const insertMany = db.transaction((ws) => {
    for (const w of ws) {
      insertWorker.run(
        w.id, w.name, w.phone, w.role, w.category, w.rank, w.rating,
        w.jobs_count, w.rate, w.image, w.location, w.lat, w.lng,
        w.experience, w.aadhaar_last4, w.available, w.skills, w.distance, w.travel
      );
    }
  });
  insertMany(seedWorkers);
  console.log('✅ Seeded 6 demo workers');
}

// Seed demo jobs
const jobCount = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;
if (jobCount === 0) {
  const insertJob = db.prepare(`
    INSERT OR IGNORE INTO jobs (id, customer_id, customer_name, title, trade, location, lat, lng, rate, days, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedJobs = [
    {
      id: 'j1', customer_id: null, customer_name: 'Rahul Sharma',
      title: 'Wardrobe & Modular Kitchen Shuttering',
      trade: 'Carpenter', location: 'Indiranagar, Bengaluru',
      lat: 12.9784, lng: 77.6408,
      rate: '₹1,350/day', days: '4 days',
      description: 'Need experienced carpenter for 2 wardrobes and modular kitchen shuttering. Material provided.',
      status: 'open'
    },
    {
      id: 'j2', customer_id: null, customer_name: 'Priya Nair',
      title: 'Full 3BHK Texture Wall Finish & Polish',
      trade: 'Painter', location: 'Domlur, Bengaluru',
      lat: 12.9612, lng: 77.6387,
      rate: '₹1,150/day', days: '6 days',
      description: 'Premium texture work for 3BHK flat. Asian Paints texture preferred. 1800 sq ft.',
      status: 'open'
    },
    {
      id: 'j3', customer_id: null, customer_name: 'Deepak Mehta',
      title: 'Terrace Waterproofing & Brick Masonry',
      trade: 'Mason', location: 'Koramangala, Bengaluru',
      lat: 12.9716, lng: 77.6522,
      rate: '₹1,400/day', days: '3 days',
      description: 'Waterproofing + compound wall repair. Materials arranged by us.',
      status: 'open'
    },
    {
      id: 'j4', customer_id: null, customer_name: 'Kavita Reddy',
      title: 'Electrical Panel Rewiring & Safety Audit',
      trade: 'Electrician', location: 'Jayanagar, Bengaluru',
      lat: 12.9653, lng: 77.6289,
      rate: '₹1,200/day', days: '2 days',
      description: 'Complete rewiring of 2BHK + MCB panel upgrade. Immediate requirement.',
      status: 'open'
    },
    {
      id: 'j5', customer_id: null, customer_name: 'Suresh Kumar',
      title: 'Bathroom Concealed Plumbing Upgrade',
      trade: 'Plumber', location: 'HSR Layout, Bengaluru',
      lat: 12.9856, lng: 77.6191,
      rate: '₹1,100/day', days: '2 days',
      description: 'CPVC concealed piping + Jaquar shower and basin fixtures installation.',
      status: 'open'
    },
    {
      id: 'j6', customer_id: null, customer_name: 'Amit Gupta',
      title: 'Floor & Wall Tile Work — New Bathroom',
      trade: 'Mason', location: 'Old Airport Rd, Bengaluru',
      lat: 12.9745, lng: 77.6501,
      rate: '₹1,250/day', days: '4 days',
      description: 'Italian marble-look tiles for master bathroom. Precision cutting required.',
      status: 'open'
    }
  ];
  const insertManyJobs = db.transaction((js) => {
    for (const j of js) {
      insertJob.run(j.id, j.customer_id, j.customer_name, j.title, j.trade, j.location, j.lat, j.lng, j.rate, j.days, j.description, j.status);
    }
  });
  insertManyJobs(seedJobs);
  console.log('✅ Seeded 6 demo jobs');
}

module.exports = db;
