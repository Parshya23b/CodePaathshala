const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number // index of correct option
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
