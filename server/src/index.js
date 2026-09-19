const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('./db');
const authRoutes = require('./routes/auth');
const memoriesRoutes = require('./routes/memories');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for decoupled frontend or cross-origin requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    storageEngine: db.isUsingMySQL() ? 'MySQL Server' : 'Local Persistence Engine',
    serverPort: PORT,
    environment: process.env.NODE_ENV || 'production'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoriesRoutes);

// Static Angular Client Serving (for Unified Web Service on Render)
const clientDistPath = path.join(__dirname, '../../client/dist/portfolio-app/browser');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving compiled Angular client from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA fallback for all client routes (excluding /api)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Fallback 404 handler if static files are not present
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server & Init Database
async function start() {
  await db.initDB();
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Portfolio Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🗄️ Database: ${db.isUsingMySQL() ? 'MySQL (Connected)' : 'Fallback Local Engine'}`);
    console.log(`🌐 Static Web: ${fs.existsSync(clientDistPath) ? 'Active' : 'Disabled (API Only)'}`);
    console.log(`===================================================`);
  });
}

start();
