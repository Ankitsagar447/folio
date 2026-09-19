const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('./db');
const authRoutes = require('./routes/auth');
const memoriesRoutes = require('./routes/memories');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
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
    serverPort: PORT
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoriesRoutes);

// 404 Handler
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
    console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🗄️ Database: ${db.isUsingMySQL() ? 'MySQL (Connected)' : 'Fallback Local Engine'}`);
    console.log(`===================================================`);
  });
}

start();
