const express = require('express');
const mongoose = require('mongoose');
const Poem = require('../models/Poem');

const router = express.Router();

// Create a new poem.
router.post('/', async (req, res) => {
  try {
    const { author, title, content, topic } = req.body;

    if (!title || !content || !topic) {
      return res.status(400).json({
        message: 'title, content, and topic are required.',
      });
    }

    const poem = await Poem.create({
      author: author?.trim() ? author : 'Anonymous',
      title,
      content,
      topic,
    });

    return res.status(201).json(poem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create poem.' });
  }
});

// Get all poems, optionally filtered by topic, newest first.
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    const query = topic ? { topic } : {};

    const poems = await Poem.find(query).sort({ created_at: -1 });
    return res.json(poems);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch poems.' });
  }
});

// Get one poem by id.
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poem ID.' });
    }

    const poem = await Poem.findById(id);
    if (!poem) {
      return res.status(404).json({ message: 'Poem not found.' });
    }

    return res.json(poem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch poem.' });
  }
});

// Increment likes for a poem.
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poem ID.' });
    }

    const poem = await Poem.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found.' });
    }

    return res.json(poem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to like poem.' });
  }
});

// Add a comment to a poem.
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poem ID.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required.' });
    }

    const poem = await Poem.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            author: author?.trim() ? author : 'Anonymous',
            content: content.trim(),
          },
        },
      },
      { new: true }
    );

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found.' });
    }

    return res.status(201).json(poem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add comment.' });
  }
});

module.exports = router;
