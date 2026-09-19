const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/memories - Fetch all travel chronicles
router.get('/', async (req, res) => {
  try {
    const list = await db.getAllMemories();
    res.json(list);
  } catch (err) {
    console.error('Error fetching memories:', err);
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
});

// POST /api/memories - Add new expedition memory
router.post('/', async (req, res) => {
  try {
    const { stateId, stateName, title, month, tag, image, caption, moments } = req.body;

    if (!stateId || !image) {
      return res.status(400).json({ error: 'State ID and Image are required' });
    }

    const newMem = await db.createMemory({
      stateId,
      stateName: stateName || 'India',
      title: title || `${stateName || 'India'} Journey`,
      month: month || 'Travel Chronicle',
      tag: tag || 'Visual Expedition',
      image,
      caption: caption || `Memories captured across ${stateName || 'India'}.`,
      moments: Array.isArray(moments) ? moments : (moments ? String(moments).split(',').map(s => s.trim()) : ['Expedition'])
    });

    res.status(201).json(newMem);
  } catch (err) {
    console.error('Error creating memory:', err);
    res.status(500).json({ error: 'Failed to save travel memory' });
  }
});

// DELETE /api/memories/:id - Remove memory
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const success = await db.deleteMemoryById(id);
    if (!success) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json({ success: true, message: `Memory ${id} deleted` });
  } catch (err) {
    console.error('Error deleting memory:', err);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// POST /api/memories/reset - Restore default memories
router.post('/reset', async (req, res) => {
  try {
    const defaults = await db.resetMemoriesToDefault();
    res.json({ success: true, message: 'Reset to default memories', data: defaults });
  } catch (err) {
    console.error('Error resetting memories:', err);
    res.status(500).json({ error: 'Failed to reset memories' });
  }
});

module.exports = router;
