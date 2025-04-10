const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [Number], // index of selected answers
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
