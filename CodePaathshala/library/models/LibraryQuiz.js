const mongoose = require('mongoose');

const libraryQuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  timeLimit: {
    type: Number, // In minutes, optional
    default: null
  },
  retakeAttempts: {
    type: Number, // null = unlimited
    default: null
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number // index of correct option
    }
  ],
  section: String,
  batch: String,
  subject: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LibraryQuiz', libraryQuizSchema);
