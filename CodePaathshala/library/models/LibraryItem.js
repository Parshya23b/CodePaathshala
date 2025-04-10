const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Assignment', 'Course', 'Quiz'], required: true },
  subject: { type: String },
  batch: { type: String },
  description: { type: String },
  modules: [
    {
      type: { type: String }, // e.g., pdf, video, quiz, assignment
      name: String,
      url: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LibraryItem', libraryItemSchema);
