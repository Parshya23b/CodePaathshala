const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional: only if you're referencing users
    required: true
  },
  type: {
    type: String,
    enum: ['enrolled', 'quiz', 'assignment', 'certificate'],
    required: true
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String
  },
  link: {
    type: String // Optional: link to course/quiz/certificate if needed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
