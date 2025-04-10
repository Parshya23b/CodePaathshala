const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  instructor: {
    type: String // Or ref: 'User' if instructor data is stored separately
  },
  language: {
    type: String,
    default: 'English'
  },
  thumbnail: {
    type: String // Image URL or uploaded filename
  },
  promoVideo: {
    type: String // Video file URL or filename
  },
  tags: [String], // Tags like "beginner", "react", etc.

  isPublished: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
