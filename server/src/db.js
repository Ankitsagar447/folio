const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const FALLBACK_FILE = path.join(__dirname, '../data_fallback.json');

let pool = null;
let useMySQL = false;

// Default initial dataset for local fallback
const DEFAULT_FALLBACK_DATA = {
  users: [
    {
      id: 1,
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password_hash: '$2a$10$cLdFWni9k6KtxfCrLDzqTOmRB.wygfSKfDMRa2XZQY683GX7yPlDO', // 'admin123'
      name: process.env.ADMIN_NAME || 'Ankit Sagar',
      role: 'administrator',
      created_at: new Date().toISOString()
    }
  ],
  memories: [
    {
      id: 'la-1',
      stateId: 'la',
      stateName: 'Ladakh',
      title: 'Pangong Lake at Sunrise',
      month: 'Aug 2023',
      tag: 'High Altitude',
      image: 'https://framerusercontent.com/images/LDD2FKTUCCQMbUbBbhwBC04rnuI.jpg?width=1600',
      caption: 'The surreal blue-green waters of Pangong Tso mirroring the high-altitude sky.',
      moments: ['🏔️ Khardung La', '🌊 Pangong Tso', '🛺 Leh City', '⭐ Milky Way'],
      createdAt: Date.now() - 5000000
    },
    {
      id: 'rj-1',
      stateId: 'rj',
      stateName: 'Rajasthan',
      title: 'Desert Dunes of Jaisalmer',
      month: 'Jan 2024',
      tag: 'Desert Safari',
      image: 'https://framerusercontent.com/images/2LJkBFtZIoI5F4qcuQfOsUrTWkc.jpg?width=1600',
      caption: 'Golden sand dunes stretching endlessly under the amber Rajasthani sky.',
      moments: ['🐪 Camel Ride', '🌅 Sunrise Dunes', '🏰 Jaisalmer Fort', '🎵 Folk Music'],
      createdAt: Date.now() - 4000000
    },
    {
      id: 'gj-1',
      stateId: 'gj',
      stateName: 'Gujarat',
      title: 'Rann of Kutch — Salt Flats',
      month: 'Feb 2024',
      tag: 'White Desert',
      image: 'https://framerusercontent.com/images/NxsYJYfP8F45xJEur7Fh8564Ufw.jpg?width=1600',
      caption: 'The infinite white expanse of the Rann under full moon light.',
      moments: ['🌕 Full Moon Night', '🎪 Rann Utsav', '🎨 Handicrafts', '🦩 Flamingos'],
      createdAt: Date.now() - 3000000
    },
    {
      id: 'hp-1',
      stateId: 'hp',
      stateName: 'Himachal Pradesh',
      title: 'Snow Peaks of Spiti',
      month: 'Jul 2023',
      tag: 'Mountain Trek',
      image: 'https://framerusercontent.com/images/kaNtc5VMI2U9SzYecDO3bcPqsY.jpg?width=1600',
      caption: 'Ancient monasteries clinging to dramatic Himalayan cliffs in cold desert.',
      moments: ['🏔️ Himalayan Trek', '🕌 Key Monastery', '🌌 Stargazing', '❄️ Snow Peaks'],
      createdAt: Date.now() - 2000000
    },
    {
      id: 'kl-1',
      stateId: 'kl',
      stateName: 'Kerala',
      title: 'Backwaters of Alleppey',
      month: 'Dec 2023',
      tag: 'Backwaters',
      image: 'https://framerusercontent.com/images/ZB6AZU2rWR5MSGd3AJLPCn2x7g.jpg?width=1600',
      caption: 'Drifting through calm backwaters on a traditional houseboat.',
      moments: ['🚢 Houseboat', '🌴 Palm Shores', '🐟 Fishing Nets', '🍛 Kerala Cuisine'],
      createdAt: Date.now() - 1000000
    }
  ]
};

function readFallback() {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(DEFAULT_FALLBACK_DATA, null, 2));
      return DEFAULT_FALLBACK_DATA;
    }
    const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
    return data;
  } catch (err) {
    console.error('[Fallback Engine] Error reading fallback file:', err.message);
    return DEFAULT_FALLBACK_DATA;
  }
}

function writeFallback(data) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Fallback Engine] Error writing fallback file:', err.message);
  }
}

async function initDB() {
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const conn = await tempPool.getConnection();
    console.log('✅ [MySQL] Successfully connected to MySQL Server.');

    // Initialize Database and Tables
    const dbName = process.env.DB_NAME || 'portfolio_db';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    // Create Tables
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(191) NOT NULL DEFAULT 'Admin',
        role VARCHAR(50) NOT NULL DEFAULT 'administrator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id VARCHAR(100) PRIMARY KEY,
        state_id VARCHAR(10) NOT NULL,
        state_name VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        month VARCHAR(50) NOT NULL,
        tag VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        caption TEXT NOT NULL,
        moments JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_state_id (state_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Ensure default admin user exists
    const [existingUsers] = await conn.query('SELECT id FROM users WHERE email = ?', [process.env.ADMIN_EMAIL || 'admin@portfolio.com']);
    if (existingUsers.length === 0) {
      await conn.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
        [
          process.env.ADMIN_EMAIL || 'admin@portfolio.com',
          '$2a$10$cLdFWni9k6KtxfCrLDzqTOmRB.wygfSKfDMRa2XZQY683GX7yPlDO', // 'admin123'
          process.env.ADMIN_NAME || 'Ankit Sagar',
          'administrator'
        ]
      );
      console.log('👤 [MySQL] Seeded default administrator account.');
    }

    // Ensure default memories exist
    const [existingMemories] = await conn.query('SELECT COUNT(*) as count FROM memories');
    if (existingMemories[0].count === 0) {
      for (const m of DEFAULT_FALLBACK_DATA.memories) {
        await conn.query(
          'INSERT INTO memories (id, state_id, state_name, title, month, tag, image, caption, moments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [m.id, m.stateId, m.stateName, m.title, m.month, m.tag, m.image, m.caption, JSON.stringify(m.moments)]
        );
      }
      console.log('🗺️ [MySQL] Seeded core memories (including Ladakh, Rajasthan, etc.) into database.');
    }

    conn.release();
    pool = tempPool;
    useMySQL = true;
    console.log(`🚀 [MySQL] Active pool running on database '${dbName}'.`);
  } catch (err) {
    console.warn(`[MySQL Notice] Could not connect to MySQL server (${err.code || err.message}).`);
    console.log(`[Storage Engine] Utilizing automated local file persistence engine at ${FALLBACK_FILE}.`);
    useMySQL = false;
    readFallback();
  }
}

// User Operations
async function findUserByEmail(email) {
  if (useMySQL && pool) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  } else {
    const data = readFallback();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

// Memories Operations
async function getAllMemories() {
  if (useMySQL && pool) {
    const [rows] = await pool.query('SELECT * FROM memories ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      stateId: r.state_id,
      stateName: r.state_name,
      title: r.title,
      month: r.month,
      tag: r.tag,
      image: r.image,
      caption: r.caption,
      moments: typeof r.moments === 'string' ? JSON.parse(r.moments) : r.moments,
      createdAt: r.created_at
    }));
  } else {
    const data = readFallback();
    return data.memories;
  }
}

async function createMemory(mem) {
  const memoryId = mem.id || `${mem.stateId}-${Date.now()}`;
  const memoryRecord = {
    id: memoryId,
    stateId: mem.stateId,
    stateName: mem.stateName,
    title: mem.title,
    month: mem.month,
    tag: mem.tag,
    image: mem.image,
    caption: mem.caption,
    moments: mem.moments || [],
    createdAt: Date.now()
  };

  if (useMySQL && pool) {
    await pool.query(
      'INSERT INTO memories (id, state_id, state_name, title, month, tag, image, caption, moments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        memoryRecord.id,
        memoryRecord.stateId,
        memoryRecord.stateName,
        memoryRecord.title,
        memoryRecord.month,
        memoryRecord.tag,
        memoryRecord.image,
        memoryRecord.caption,
        JSON.stringify(memoryRecord.moments)
      ]
    );
  } else {
    const data = readFallback();
    data.memories.push(memoryRecord);
    writeFallback(data);
  }

  return memoryRecord;
}

async function deleteMemoryById(id) {
  if (useMySQL && pool) {
    const [res] = await pool.query('DELETE FROM memories WHERE id = ?', [id]);
    return res.affectedRows > 0;
  } else {
    const data = readFallback();
    const initLen = data.memories.length;
    data.memories = data.memories.filter(m => m.id !== id);
    writeFallback(data);
    return data.memories.length < initLen;
  }
}

async function resetMemoriesToDefault() {
  if (useMySQL && pool) {
    await pool.query('DELETE FROM memories');
    for (const m of DEFAULT_FALLBACK_DATA.memories) {
      await pool.query(
        'INSERT INTO memories (id, state_id, state_name, title, month, tag, image, caption, moments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [m.id, m.stateId, m.stateName, m.title, m.month, m.tag, m.image, m.caption, JSON.stringify(m.moments)]
      );
    }
  } else {
    const data = readFallback();
    data.memories = [...DEFAULT_FALLBACK_DATA.memories];
    writeFallback(data);
  }
  return DEFAULT_FALLBACK_DATA.memories;
}

module.exports = {
  initDB,
  isUsingMySQL: () => useMySQL,
  findUserByEmail,
  getAllMemories,
  createMemory,
  deleteMemoryById,
  resetMemoriesToDefault
};
