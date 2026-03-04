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
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? '/tmp/cheque_app.db' : 'cheque_app.db';
const uploadDir = isVercel ? '/tmp/uploads' : 'uploads';

const db = new Database(dbPath);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );
`);

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

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Verify user exists in DB (especially important for ephemeral DBs like on Vercel)
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists. Please log in again.' });
    }
    
    req.user = user;
    next();
  });
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadDir));

// --- API Router ---
const apiRouter = express.Router();

// Logging middleware for API
apiRouter.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Auth Routes
apiRouter.post('/auth/register', async (req, res) => {
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

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Extraction Routes
apiRouter.post('/extract', authenticateToken, upload.single('file'), async (req: any, res: any) => {
  console.log('Processing extraction save request...');
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log('Extraction data received:', req.body.data ? 'Yes' : 'No');
    console.log('File received:', req.file ? req.file.filename : 'No');
    
    const extractedData = JSON.parse(req.body.data || '{}');
    const type = req.body.type || 'cheque';
    
    if (!req.user || !req.user.id) {
      console.error('User ID missing from request');
      return res.status(401).json({ error: 'User session invalid' });
    }

    const stmt = db.prepare(`
      INSERT INTO extractions (user_id, type, json_data, file_path) 
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      type,
      JSON.stringify(extractedData),
      req.file.path
    );

    console.log('Extraction saved successfully, ID:', result.lastInsertRowid);
    res.json({ success: true, id: result.lastInsertRowid, file_path: req.file.path });
  } catch (error: any) {
    console.error('Save error details:', error);
    res.status(500).json({ 
      error: 'Failed to save extracted data', 
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
});

apiRouter.get('/history', authenticateToken, (req: any, res) => {
  const type = req.query.type || 'cheque';
  try {
    const extractions = db.prepare('SELECT * FROM extractions WHERE user_id = ? AND type = ? ORDER BY created_at DESC').all(req.user.id, type);
    const formattedExtractions = extractions.map((ex: any) => ({
      ...ex,
      ...JSON.parse(ex.json_data || '{}')
    }));
    res.json(formattedExtractions);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), environment: process.env.VERCEL ? 'vercel' : 'local' });
});

// Mount API Router
app.use('/api', apiRouter);

// Specific API 404 handler to prevent falling through to Vite
app.use('/api/*', (req, res) => {
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
export default app;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}
