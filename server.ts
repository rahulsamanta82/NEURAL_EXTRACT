import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cheque-secret-key';
const db = new Database('cheque_app.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );
`);

db.exec(`DROP TABLE IF EXISTS extractions;`);

db.exec(`
  CREATE TABLE IF NOT EXISTS extractions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT DEFAULT 'cheque',
    json_data TEXT,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Authenticating token...');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    console.log('Authenticated user:', user.email);
    next();
  });
};

// --- API Routes ---

app.use('/api', (req, res, next) => {
  console.log(`[API] ${req.method} ${req.path} - Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const info = stmt.run(email, hashedPassword);
    const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET);
    res.json({ token, user: { id: info.lastInsertRowid, email } });
  } catch (err: any) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Extraction
app.post('/api/extract', authenticateToken, upload.single('file'), async (req: any, res: any) => {
  console.log('Processing extraction save request...');
  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const extractedData = JSON.parse(req.body.data || '{}');
    const type = req.body.type || 'cheque';
    console.log(`Extracted ${type} data to save:`, extractedData);

    // Save to DB
    const stmt = db.prepare(`
      INSERT INTO extractions (user_id, type, json_data, file_path) 
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(
      req.user.id,
      type,
      JSON.stringify(extractedData),
      req.file.path
    );

    console.log('Extraction saved successfully');
    res.json({ success: true, file_path: req.file.path });
  } catch (error: any) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save extracted data', details: error.message });
  }
});

app.get('/api/history', authenticateToken, (req: any, res) => {
  const type = req.query.type || 'cheque';
  console.log(`Fetching ${type} history for user:`, req.user.email);
  try {
    const extractions = db.prepare('SELECT * FROM extractions WHERE user_id = ? AND type = ? ORDER BY created_at DESC').all(req.user.id, type);
    
    // Parse json_data for each extraction
    const formattedExtractions = extractions.map((ex: any) => ({
      ...ex,
      ...JSON.parse(ex.json_data || '{}')
    }));

    res.json(formattedExtractions);
  } catch (err: any) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// 404 Handler for API
app.use('/api', (req, res) => {
  console.warn(`[API] 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'API route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Server Error:', err);
  
  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error', details: err.message });
  }

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
