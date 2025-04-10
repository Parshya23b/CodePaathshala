const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  title: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  solution: {
    type: String, // ✅ New field to store the correct solution
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
