const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'assignment', 'quiz'],
    default: 'video'
  },
  isDownloadable: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);
