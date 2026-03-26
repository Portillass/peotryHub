const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
    versionKey: false,
  }
);

const poemSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Poem', poemSchema);
