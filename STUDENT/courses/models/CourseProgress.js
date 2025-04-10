const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture'
    }
  ],
  lastViewedLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  progressPercent: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'incomplete'],
    default: 'active'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
