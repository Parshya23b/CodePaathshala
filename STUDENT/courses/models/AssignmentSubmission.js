const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    enum: ['Passed', 'Failed', 'Error'],
    default: 'Failed'
  },
  output: String, // optional summary log

  // ✅ Test case-wise breakdown
  testResults: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
      time: String,     // e.g. "0.01s"
      memory: String    // e.g. "1.2MB"
    }
  ],

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
